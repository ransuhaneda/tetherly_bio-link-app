<?php

namespace Tests\Feature;

use App\Models\Profile;
use App\Models\PublicationSnapshot;
use App\Models\User;
use App\Enums\PublicationState;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class UsernameApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_username_availability_is_reported(): void
    {
        $this->getJson('/api/v1/usernames/available/availability')
            ->assertOk()
            ->assertJsonPath('data.available', true);

        $user = User::factory()->create();
        Profile::create(['user_id' => $user->id, 'username' => 'taken']);
        $this->getJson('/api/v1/usernames/taken/availability')->assertJsonPath('data.available', false);
    }

    public function test_invalid_username_is_rejected(): void
    {
        $this->getJson('/api/v1/usernames/not valid/availability')->assertNotFound();
    }

    public function test_username_availability_normalizes_case_and_rejects_reserved_routes(): void
    {
        $this->getJson('/api/v1/usernames/Lo-Fi/availability')
            ->assertOk()
            ->assertJsonPath('data.username', 'lo-fi');

        $this->getJson('/api/v1/usernames/Login/availability')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('username');
    }

    public function test_username_availability_rate_limit_returns_a_429_envelope(): void
    {
        $key = 'username-availability|127.0.0.1';
        for ($attempt = 0; $attempt < 30; $attempt++) {
            RateLimiter::hit($key, 60);
        }

        $response = $this->getJson('/api/v1/usernames/available/availability');

        $response->assertStatus(429)->assertJsonStructure(['message', 'retry_after']);
        $this->assertSame((string) $response->json('retry_after'), $response->headers->get('Retry-After'));
    }

    public function test_selected_publication_username_remains_reserved_after_draft_username_changes(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->for($user)->create([
            'username' => 'new-name',
            'publication_state' => PublicationState::Published,
        ]);
        $snapshot = PublicationSnapshot::factory()->for($profile)->create(['username' => 'old-name']);
        $profile->update(['published_snapshot_id' => $snapshot->id]);

        $this->getJson('/api/v1/usernames/old-name/availability')->assertJsonPath('data.available', false);
        $this->getJson('/api/v1/usernames/new-name/availability')->assertJsonPath('data.available', false);
    }
}
