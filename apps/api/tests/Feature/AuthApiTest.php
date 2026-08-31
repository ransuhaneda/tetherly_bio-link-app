<?php

namespace Tests\Feature;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(ValidateCsrfToken::class);
    }

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
        $this->app['auth']->forgetGuards();
        $this->getJson('/api/v1/auth/me')->assertUnauthorized();
    }

    public function test_stateful_api_routes_do_not_start_the_session_twice(): void
    {
        $request = \Illuminate\Http\Request::create('/api/v1/auth/me', 'GET');
        $middleware = app('router')->getRoutes()->match($request)->gatherMiddleware();

        $this->assertContains(
            'api',
            $middleware
        );
        $this->assertNotContains('web', $middleware);
    }

    public function test_authenticated_user_cannot_login_as_another_user(): void
    {
        $currentUser = User::factory()->create([
            'email' => 'current@example.com',
            'password' => 'password-password',
        ]);
        $otherUser = User::factory()->create([
            'email' => 'other@example.com',
            'password' => 'password-password',
        ]);

        $this->actingAs($currentUser)
            ->postJson('/api/v1/auth/login', [
                'email' => $otherUser->email,
                'password' => 'password-password',
            ])
            ->assertStatus(409)
            ->assertJson(['message' => 'You are already logged in.']);

        $this->assertAuthenticatedAs($currentUser);
    }

    public function test_authenticated_user_cannot_register_another_account(): void
    {
        $currentUser = User::factory()->create();

        $this->actingAs($currentUser)
            ->postJson('/api/v1/auth/register', [
                'name' => 'Another User',
                'email' => 'another@example.com',
                'username' => 'another-user',
                'password' => 'password-password',
                'password_confirmation' => 'password-password',
            ])
            ->assertStatus(409)
            ->assertJson(['message' => 'You are already logged in.']);

        $this->assertAuthenticatedAs($currentUser);
        $this->assertDatabaseMissing('users', ['email' => 'another@example.com']);
    }

    public function test_login_rate_limit_returns_a_429_envelope(): void
    {
        $key = 'limited@example.com|127.0.0.1';
        RateLimiter::hit($key, 60);
        RateLimiter::hit($key, 60);
        RateLimiter::hit($key, 60);
        RateLimiter::hit($key, 60);
        RateLimiter::hit($key, 60);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'limited@example.com',
            'password' => 'password-password',
        ]);

        $response->assertStatus(429)->assertJsonStructure(['message', 'retry_after']);
        $this->assertSame((string) $response->json('retry_after'), $response->headers->get('Retry-After'));
    }

    public function test_invalid_login_credentials_remain_a_safe_422_validation_error(): void
    {
        $this->postJson('/api/v1/auth/login', [
            'email' => 'missing@example.com',
            'password' => 'password-password',
        ])->assertUnprocessable()->assertJsonValidationErrors('email');
    }

    public function test_registration_rejects_reserved_application_routes(): void
    {
        $this->postJson('/api/v1/auth/register', [
            'name' => 'Reserved',
            'email' => 'reserved@example.com',
            'username' => 'Login',
            'password' => 'password-password',
            'password_confirmation' => 'password-password',
        ])->assertUnprocessable()->assertJsonValidationErrors('username');
    }
}
