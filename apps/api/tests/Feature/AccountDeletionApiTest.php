<?php

namespace Tests\Feature;

use App\Enums\AccountDeletionState;
use App\Enums\PublicationState;
use App\Mail\AccountDeletionRequested;
use App\Models\Profile;
use App\Models\PublicationSnapshot;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use RuntimeException;
use Tests\TestCase;

class AccountDeletionApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(ValidateCsrfToken::class);
        Carbon::setTestNow('2026-08-31 01:30:00');
        Mail::fake();
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    public function test_deletion_request_requires_authentication_and_the_current_password(): void
    {
        $this->postJson('/api/v1/account/deletion', [
            'current_password' => 'password-password',
        ])->assertUnauthorized();

        $user = $this->createUserWithProfile();

        $this->actingAs($user)->postJson('/api/v1/account/deletion', [
            'current_password' => 'incorrect-password',
        ])->assertUnprocessable()->assertJsonValidationErrors('current_password');

        $this->assertDatabaseCount('account_deletions', 0);
        $this->assertAuthenticatedAs($user);
    }

    public function test_request_immediately_unpublishes_and_signs_out_the_account(): void
    {
        $user = $this->createUserWithProfile();
        $profile = $this->publishProfile($user->profile);
        $token = $user->createToken('deletion-test');
        DB::table('sessions')->insert([
            'id' => 'other-account-session',
            'user_id' => $user->id,
            'ip_address' => '127.0.0.2',
            'user_agent' => 'test',
            'payload' => 'test',
            'last_activity' => now()->timestamp,
        ]);

        $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'password-password',
        ])->assertOk();
        $this->getJson('/api/v1/profiles/requester')->assertOk();

        $response = $this->postJson('/api/v1/account/deletion', [
            'current_password' => 'password-password',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.state', 'pending')
            ->assertJsonPath('data.username', 'requester')
            ->assertJsonPath('data.deletion_date', '2026-09-30')
            ->assertJsonPath('message', 'Account deletion requested.');

        $this->app['auth']->forgetGuards();
        $this->assertGuest();
        $this->getJson('/api/v1/auth/me')->assertUnauthorized();
        $this->assertDatabaseHas('account_deletions', [
            'user_id' => $user->id,
            'state' => AccountDeletionState::Pending->value,
            'email' => 'requester@example.com',
        ]);
        $this->assertSame(PublicationState::Draft, $profile->fresh()->publication_state);
        $this->assertNull($profile->fresh()->published_at);
        $this->assertNull($profile->fresh()->published_snapshot_id);
        $this->assertDatabaseHas('publication_snapshots', ['profile_id' => $profile->id]);
        $this->assertDatabaseMissing('sessions', ['user_id' => $user->id]);
        $this->assertDatabaseMissing('personal_access_tokens', ['id' => $token->accessToken->id]);
        $this->getJson('/api/v1/profiles/requester')->assertNotFound();
        Mail::assertQueued(AccountDeletionRequested::class, function (AccountDeletionRequested $mail): bool {
            return $mail->hasTo('requester@example.com')
                && $mail->username === 'requester'
                && $mail->requestDate === 'August 31, 2026'
                && $mail->deletionDate === 'September 30, 2026'
                && $mail->loginUrl === 'http://localhost:3000/login';
        });
    }

    public function test_repeated_request_does_not_extend_the_recovery_deadline(): void
    {
        $user = $this->createUserWithProfile();

        $first = $this->actingAs($user)->postJson('/api/v1/account/deletion', [
            'current_password' => 'password-password',
        ])->assertOk();

        Carbon::setTestNow('2026-09-05 12:00:00');

        $second = $this->actingAs($user)->postJson('/api/v1/account/deletion', [
            'current_password' => 'password-password',
        ])->assertOk();

        $this->assertSame($first->json('data.requested_at'), $second->json('data.requested_at'));
        $this->assertSame($first->json('data.recovery_deadline'), $second->json('data.recovery_deadline'));
        $this->assertSame('2026-09-30', $second->json('data.deletion_date'));
        $this->assertDatabaseCount('account_deletions', 1);
        Mail::assertQueuedCount(1);
    }

    public function test_failed_password_confirmation_is_rate_limited_per_account_and_ip(): void
    {
        $user = $this->createUserWithProfile();
        $key = 'account-deletion-confirmation|'.$user->id.'|127.0.0.1';

        for ($attempt = 0; $attempt < 5; $attempt++) {
            RateLimiter::hit($key, 60);
        }

        $response = $this->actingAs($user)->postJson('/api/v1/account/deletion', [
            'current_password' => 'incorrect-password',
        ]);

        $response->assertTooManyRequests()
            ->assertJsonStructure(['message', 'retry_after']);
        $this->assertSame(
            (string) $response->json('retry_after'),
            $response->headers->get('Retry-After'),
        );
        $this->assertDatabaseCount('account_deletions', 0);
    }

    public function test_email_queue_failure_does_not_roll_back_deletion(): void
    {
        $user = $this->createUserWithProfile();
        Mail::shouldReceive('to')
            ->once()
            ->with('requester@example.com')
            ->andThrow(new RuntimeException('Queue unavailable'));

        $this->actingAs($user)->postJson('/api/v1/account/deletion', [
            'current_password' => 'password-password',
        ])->assertOk();

        $this->assertDatabaseHas('account_deletions', [
            'user_id' => $user->id,
            'state' => AccountDeletionState::Pending->value,
        ]);
        $this->assertSame(PublicationState::Draft, $user->profile->fresh()->publication_state);
    }

    public function test_deletion_email_explains_visibility_dates_and_authenticated_restoration(): void
    {
        $mail = new AccountDeletionRequested(
            username: 'requester',
            requestDate: 'August 31, 2026',
            deletionDate: 'September 30, 2026',
            loginUrl: 'http://localhost:3000/login',
        );

        $template = file_get_contents(resource_path('views/emails/account-deletion-requested.blade.php'));

        $this->assertSame('emails.account-deletion-requested', $mail->content()->markdown);
        $this->assertSame('requester', $mail->username);
        $this->assertSame('September 30, 2026', $mail->deletionDate);
        $this->assertStringContainsString('no longer publicly visible', $template);
        $this->assertStringContainsString('Signing in does not restore the account automatically', $template);
        $this->assertStringNotContainsString('token=', $template);
    }

    private function createUserWithProfile(): User
    {
        $user = User::factory()->create([
            'email' => 'requester@example.com',
            'password' => 'password-password',
        ]);
        Profile::factory()->for($user)->create(['username' => 'requester']);

        return $user->load('profile');
    }

    private function publishProfile(Profile $profile): Profile
    {
        $snapshot = PublicationSnapshot::factory()->for($profile)->create([
            'version' => 1,
            'source_revision' => $profile->draft_revision,
            'username' => $profile->username,
        ]);
        $profile->update([
            'publication_state' => PublicationState::Published,
            'published_at' => $snapshot->published_at,
            'published_snapshot_id' => $snapshot->id,
        ]);

        return $profile->refresh();
    }
}
