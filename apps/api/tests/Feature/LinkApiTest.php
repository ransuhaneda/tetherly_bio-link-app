<?php

namespace Tests\Feature;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LinkApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(ValidateCsrfToken::class);
    }

    public function test_authenticated_creator_can_add_a_link(): void
    {
        $user = User::factory()->create();
        Profile::factory()->for($user)->create();

        $this->actingAs($user)
            ->postJson('/api/v1/profile/links', [
                'label' => 'Portfolio',
                'url' => 'https://example.com',
                'enabled' => true,
            ])
            ->assertCreated()
            ->assertJsonPath('data.label', 'Portfolio');

        $this->assertDatabaseHas('links', [
            'profile_id' => $user->profile->id,
            'label' => 'Portfolio',
            'url' => 'https://example.com',
        ]);
    }
}
