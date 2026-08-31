<?php

namespace Tests\Feature;

use App\Enums\PublicationState;
use App\Models\Link;
use App\Models\Profile;
use App\Models\PublicationSnapshot;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicationApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(ValidateCsrfToken::class);
    }

    public function test_authenticated_creator_can_publish_their_draft(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->for($user)->create([
            'display_name' => 'Tetherly Creator',
        ]);
        Link::factory()->for($profile)->create([
            'label' => 'Portfolio',
            'url' => 'https://example.com',
            'enabled' => true,
        ]);

        $this->actingAs($user)
            ->postJson('/api/v1/profile/publish')
            ->assertOk()
            ->assertJsonPath('message', 'Profile published.')
            ->assertJsonPath('data.publication_state', 'published');

        $this->assertSame(PublicationState::Published, $profile->fresh()->publication_state);
        $this->assertNotNull($profile->fresh()->published_snapshot_id);
    }

    public function test_authenticated_creator_can_unpublish_their_profile(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->for($user)->create();
        $snapshot = PublicationSnapshot::factory()->for($profile)->create([
            'source_revision' => $profile->draft_revision,
        ]);
        $profile->update([
            'publication_state' => PublicationState::Published,
            'published_at' => $snapshot->published_at,
            'published_snapshot_id' => $snapshot->id,
        ]);

        $this->actingAs($user)
            ->postJson('/api/v1/profile/unpublish')
            ->assertOk()
            ->assertJsonPath('message', 'Profile unpublished.')
            ->assertJsonPath('data.publication_state', 'draft');

        $profile = $profile->fresh();
        $this->assertSame(PublicationState::Draft, $profile->publication_state);
        $this->assertNull($profile->published_snapshot_id);
        $this->assertNull($profile->published_at);
    }
}
