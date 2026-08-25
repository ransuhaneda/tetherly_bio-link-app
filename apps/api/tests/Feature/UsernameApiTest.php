<?php

namespace Tests\Feature;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
}
