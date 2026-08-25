<?php

namespace Tests\Feature;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_with_a_profile(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Sol',
            'email' => 'sol@example.com',
            'username' => 'Sol-Notes',
            'password' => 'password-password',
            'password_confirmation' => 'password-password',
        ]);

        $response->assertCreated()->assertJsonPath('data.profile.username', 'sol-notes');
        $this->assertAuthenticated();
        $this->assertDatabaseHas('profiles', ['username' => 'sol-notes']);
    }

    public function test_duplicate_username_is_rejected(): void
    {
        $user = User::factory()->create();
        Profile::create(['user_id' => $user->id, 'username' => 'claimed']);

        $this->postJson('/api/v1/auth/register', [
            'name' => 'Other',
            'email' => 'other@example.com',
            'username' => 'claimed',
            'password' => 'password-password',
            'password_confirmation' => 'password-password',
        ])->assertUnprocessable()->assertJsonValidationErrors('username');
    }

    public function test_user_can_login_get_me_and_logout(): void
    {
        $user = User::factory()->create(['email' => 'sol@example.com', 'password' => 'password-password']);
        Profile::create(['user_id' => $user->id, 'username' => 'sol']);

        $this->postJson('/api/v1/auth/login', ['email' => 'sol@example.com', 'password' => 'password-password'])->assertOk();
        $this->getJson('/api/v1/auth/me')->assertOk()->assertJsonPath('data.email', 'sol@example.com');
        $this->postJson('/api/v1/auth/logout')->assertNoContent();
        $this->getJson('/api/v1/auth/me')->assertUnauthorized();
    }
}
