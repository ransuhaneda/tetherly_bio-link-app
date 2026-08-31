<?php

namespace Tests\Feature;

use App\Enums\AccountDeletionState;
use App\Enums\PublicationState;
use App\Models\AccountDeletion;
use App\Models\Profile;
use App\Models\PublicationSnapshot;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class AccountRecoveryApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(ValidateCsrfToken::class);
        Carbon::setTestNow('2026-08-31 01:30:00');
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    public function test_valid_pending_account_login_requires_explicit_restoration_without_authenticating(): void
    {
        $user = $this->createPendingUser();

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'password-password',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.status', 'restoration_required')
            ->assertJsonPath('data.deletion.username', 'recoverable')
            ->assertJsonPath('data.deletion.deletion_date', '2026-09-30');
        $this->app['auth']->forgetGuards();
        $this->assertGuest();
        $this->getJson('/api/v1/auth/me')->assertUnauthorized();
        $this->getJson('/api/v1/auth/recovery')
            ->assertOk()
            ->assertJsonPath('data.status', 'restoration_required');
        $this->assertSame(AccountDeletionState::Pending, $user->accountDeletion->fresh()->state);
    }

    public function test_explicit_restoration_returns_an_unpublished_draft_and_preserves_history(): void
    {
        $user = $this->createPendingUser();
        $profile = $user->profile;
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

        $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'password-password',
        ])->assertJsonPath('data.status', 'restoration_required');

        $this->postJson('/api/v1/auth/restore')
            ->assertOk()
            ->assertJsonPath('data.status', 'authenticated')
            ->assertJsonPath('data.user.email', $user->email)
            ->assertJsonPath('message', 'Account restored.');

        $this->assertAuthenticatedAs($user);
        $this->assertSame(AccountDeletionState::Restored, $user->accountDeletion->fresh()->state);
        $this->assertSame(PublicationState::Draft, $profile->fresh()->publication_state);
        $this->assertNull($profile->fresh()->published_snapshot_id);
        $this->assertNull($profile->fresh()->published_at);
        $this->assertDatabaseHas('publication_snapshots', ['id' => $snapshot->id]);
        $this->getJson('/api/v1/profiles/recoverable')->assertNotFound();
        $this->getJson('/api/v1/auth/me')->assertOk();
    }

    public function test_expired_pending_account_cannot_login_or_restore(): void
    {
        $user = $this->createPendingUser([
            'recovery_deadline' => now(),
        ]);

        $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'password-password',
        ])->assertForbidden()->assertJson([
            'message' => 'This account is unavailable.',
        ]);

        $this->app['auth']->forgetGuards();
        $this->assertGuest();
        $this->postJson('/api/v1/auth/restore')->assertNotFound();
        $this->assertSame(AccountDeletionState::Pending, $user->accountDeletion->fresh()->state);
    }

    public function test_nonrecoverable_deletion_states_return_the_same_unavailable_outcome(): void
    {
        foreach ([
            AccountDeletionState::PurgeEligible,
            AccountDeletionState::Purging,
            AccountDeletionState::Failed,
        ] as $index => $state) {
            $user = $this->createPendingUser([
                'state' => $state,
                'email' => "state{$index}@example.com",
            ], "state{$index}@example.com", "state{$index}");

            $this->postJson('/api/v1/auth/login', [
                'email' => $user->email,
                'password' => 'password-password',
            ])->assertForbidden()->assertJson([
                'message' => 'This account is unavailable.',
            ]);
        }
    }

    public function test_pending_accounts_are_blocked_from_existing_authenticated_routes(): void
    {
        $user = $this->createPendingUser();

        $this->actingAs($user)
            ->getJson('/api/v1/auth/me')
            ->assertUnauthorized()
            ->assertJson(['message' => 'This account is unavailable.']);
    }

    public function test_logout_clears_the_limited_recovery_session(): void
    {
        $user = $this->createPendingUser();

        $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'password-password',
        ])->assertJsonPath('data.status', 'restoration_required');

        $this->postJson('/api/v1/auth/logout')->assertNoContent();
        $this->getJson('/api/v1/auth/recovery')->assertNotFound();
        $this->postJson('/api/v1/auth/restore')->assertNotFound();
    }

    public function test_restored_account_can_use_normal_login(): void
    {
        $user = $this->createPendingUser([
            'state' => AccountDeletionState::Restored,
        ]);

        $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'password-password',
        ])->assertOk()
            ->assertJsonPath('data.status', 'authenticated')
            ->assertJsonPath('data.user.email', $user->email);

        $this->assertAuthenticatedAs($user);
    }

    /**
     * @param  array<string, mixed>  $deletionOverrides
     */
    private function createPendingUser(
        array $deletionOverrides = [],
        string $email = 'recoverable@example.com',
        string $username = 'recoverable',
    ): User {
        $user = User::factory()->create([
            'email' => $email,
            'password' => 'password-password',
        ]);
        Profile::factory()->for($user)->create(['username' => $username]);
        AccountDeletion::create(array_merge([
            'user_id' => $user->id,
            'state' => AccountDeletionState::Pending,
            'requested_at' => now(),
            'recovery_deadline' => now()->addDays(30),
            'email' => $email,
        ], $deletionOverrides));

        return $user->load(['profile', 'accountDeletion']);
    }
}
