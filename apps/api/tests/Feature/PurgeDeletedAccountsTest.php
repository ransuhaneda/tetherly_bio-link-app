<?php

namespace Tests\Feature;

use App\Enums\AccountDeletionState;
use App\Enums\PublicationState;
use App\Models\AccountDeletion;
use App\Models\Link;
use App\Models\Profile;
use App\Models\PublicationSnapshot;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Tests\TestCase;

class PurgeDeletedAccountsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(ValidateCsrfToken::class);
        Carbon::setTestNow('2026-09-30 03:00:00');
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    public function test_expired_account_is_fully_purged_and_username_is_released(): void
    {
        Storage::fake('public');
        $deletion = $this->createExpiredAccount('released');
        $user = $deletion->user;
        $profile = $user->profile;
        Link::factory()->for($profile)->create();
        $snapshot = PublicationSnapshot::factory()->for($profile)->create([
            'version' => 1,
            'source_revision' => $profile->draft_revision,
            'username' => $profile->username,
            'avatar_path' => 'avatars/historical.webp',
        ]);
        $profile->update([
            'avatar_path' => 'avatars/current.webp',
            'publication_state' => PublicationState::Published,
            'published_at' => $snapshot->published_at,
            'published_snapshot_id' => $snapshot->id,
        ]);
        Storage::disk('public')->put('avatars/current.webp', 'current');
        Storage::disk('public')->put('avatars/historical.webp', 'historical');
        $token = $user->createToken('purge-test');
        DB::table('sessions')->insert([
            'id' => 'purge-session',
            'user_id' => $user->id,
            'ip_address' => '127.0.0.1',
            'user_agent' => 'test',
            'payload' => 'test',
            'last_activity' => now()->timestamp,
        ]);
        DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => 'hashed-reset-token',
            'created_at' => now(),
        ]);

        $this->artisan('accounts:purge-deleted', ['--limit' => 100])
            ->expectsOutput('Account purge finished: 1 completed, 0 failed.')
            ->assertSuccessful();

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
        $this->assertDatabaseMissing('profiles', ['id' => $profile->id]);
        $this->assertDatabaseMissing('links', ['profile_id' => $profile->id]);
        $this->assertDatabaseMissing('publication_snapshots', ['id' => $snapshot->id]);
        $this->assertDatabaseMissing('account_deletions', ['id' => $deletion->id]);
        $this->assertDatabaseMissing('personal_access_tokens', ['id' => $token->accessToken->id]);
        $this->assertDatabaseMissing('sessions', ['user_id' => $user->id]);
        $this->assertDatabaseMissing('password_reset_tokens', ['email' => $user->email]);
        Storage::disk('public')->assertMissing('avatars/current.webp');
        Storage::disk('public')->assertMissing('avatars/historical.webp');
        $this->getJson('/api/v1/usernames/released/availability')
            ->assertOk()
            ->assertJsonPath('data.available', true);
    }

    public function test_required_file_cleanup_failure_keeps_account_reserved_and_retryable(): void
    {
        $deletion = $this->createExpiredAccount('reserved');
        $deletion->user->profile->update([
            'avatar_path' => 'avatars/required.webp',
            'publication_state' => PublicationState::Published,
        ]);
        Storage::shouldReceive('disk')
            ->once()
            ->with('public')
            ->andThrow(new RuntimeException('Storage unavailable'));

        $this->artisan('accounts:purge-deleted')
            ->expectsOutput('Account purge finished: 0 completed, 1 failed.')
            ->assertFailed();

        $deletion->refresh();
        $this->assertSame(AccountDeletionState::Failed, $deletion->state);
        $this->assertSame(1, $deletion->purge_attempts);
        $this->assertSame('Account purge did not complete.', $deletion->last_error);
        $this->assertTrue($deletion->next_retry_at->equalTo(now()->addHour()));
        $this->assertDatabaseHas('users', ['id' => $deletion->user_id]);
        $this->getJson('/api/v1/profiles/reserved')->assertNotFound();
        $this->getJson('/api/v1/usernames/reserved/availability')
            ->assertOk()
            ->assertJsonPath('data.available', false);
        $this->assertFalse(AccountDeletion::purgeEligible()->whereKey($deletion)->exists());

        Carbon::setTestNow(now()->addHour()->addSecond());
        $this->assertTrue(AccountDeletion::purgeEligible()->whereKey($deletion)->exists());
    }

    public function test_unexpired_accounts_are_not_purged(): void
    {
        $deletion = $this->createExpiredAccount('recovering', [
            'recovery_deadline' => now()->addSecond(),
        ]);

        $this->artisan('accounts:purge-deleted')
            ->expectsOutput('Account purge finished: 0 completed, 0 failed.')
            ->assertSuccessful();

        $this->assertDatabaseHas('users', ['id' => $deletion->user_id]);
        $this->assertDatabaseHas('account_deletions', ['id' => $deletion->id]);
    }

    public function test_command_processes_no_more_than_the_requested_limit(): void
    {
        Storage::fake('public');
        $this->createExpiredAccount('bounded-one');
        $this->createExpiredAccount('bounded-two');

        $this->artisan('accounts:purge-deleted', ['--limit' => 1])
            ->expectsOutput('Account purge finished: 1 completed, 0 failed.')
            ->assertSuccessful();

        $this->assertDatabaseCount('users', 1);
        $this->assertDatabaseCount('account_deletions', 1);
    }

    public function test_stale_purging_lease_is_retried_idempotently(): void
    {
        Storage::fake('public');
        $deletion = $this->createExpiredAccount('stale-purge', [
            'state' => AccountDeletionState::Purging,
            'purge_attempts' => 1,
            'next_retry_at' => now()->subSecond(),
        ]);

        $this->artisan('accounts:purge-deleted')
            ->expectsOutput('Account purge finished: 1 completed, 0 failed.')
            ->assertSuccessful();

        $this->assertDatabaseMissing('users', ['id' => $deletion->user_id]);
        $this->assertDatabaseMissing('account_deletions', ['id' => $deletion->id]);
    }

    public function test_command_rejects_an_unbounded_limit(): void
    {
        $this->artisan('accounts:purge-deleted', ['--limit' => 501])
            ->expectsOutput('The --limit option must be an integer between 1 and 500.')
            ->assertExitCode(2);
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function createExpiredAccount(string $username, array $overrides = []): AccountDeletion
    {
        $user = User::factory()->create([
            'email' => $username.'@example.com',
            'password' => 'password-password',
        ]);
        Profile::factory()->for($user)->create(['username' => $username]);

        return AccountDeletion::create(array_merge([
            'user_id' => $user->id,
            'state' => AccountDeletionState::Pending,
            'requested_at' => now()->subDays(30),
            'recovery_deadline' => now(),
            'email' => $user->email,
        ], $overrides))->load('user.profile');
    }
}
