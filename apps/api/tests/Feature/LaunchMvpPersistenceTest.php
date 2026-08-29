<?php

namespace Tests\Feature;

use App\Enums\ProfileTheme;
use App\Enums\PublicationState;
use App\Models\Link;
use App\Models\Profile;
use App\Models\PublicationSnapshot;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LaunchMvpPersistenceTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_casts_normalizes_username_and_orders_links_deterministically(): void
    {
        $profile = Profile::factory()->create(['username' => '  Studio-Notes ']);
        Link::factory()->for($profile)->create(['position' => 1, 'label' => 'Second']);
        Link::factory()->for($profile)->create(['position' => 0, 'label' => 'First']);

        $profile->refresh();
        $this->assertSame('studio-notes', $profile->username);
        $this->assertSame(ProfileTheme::EditorialBento, $profile->theme);
        $this->assertSame(PublicationState::Draft, $profile->publication_state);
        $this->assertSame(['First', 'Second'], $profile->links->pluck('label')->all());
    }

    public function test_profile_revision_advances_for_profile_and_link_content_changes(): void
    {
        $profile = Profile::factory()->create(['draft_revision' => 1]);
        $this->assertSame(1, $profile->draft_revision);

        $profile->update(['display_name' => 'Changed']);
        $this->assertSame(2, $profile->fresh()->draft_revision);

        $link = Link::factory()->for($profile)->create(['position' => 0]);
        $this->assertSame(3, $profile->fresh()->draft_revision);

        $link->update(['enabled' => false]);
        $this->assertSame(4, $profile->fresh()->draft_revision);
    }

    public function test_publication_snapshot_records_source_revision_and_status_distinguishes_unpublished_changes(): void
    {
        $profile = Profile::factory()->create(['draft_revision' => 4, 'published_snapshot_id' => null]);
        $snapshot = PublicationSnapshot::factory()->for($profile)->create(['source_revision' => 4]);
        $profile->update(['published_snapshot_id' => $snapshot->id]);

        $this->assertSame('published', $profile->fresh()->publication_status);
        $profile->update(['bio' => 'A newer draft']);
        $this->assertSame('changes_not_published', $profile->fresh()->publication_status);
    }

    public function test_profile_link_position_is_unique_per_profile(): void
    {
        $profile = Profile::factory()->create();
        Link::factory()->for($profile)->create(['position' => 0]);

        $this->expectException(QueryException::class);
        Link::factory()->for($profile)->create(['position' => 0]);
    }

    public function test_published_snapshot_is_immutable_from_draft_edits(): void
    {
        $profile = Profile::factory()->create([
            'username' => 'creator',
            'display_name' => 'Published name',
            'publication_state' => PublicationState::Published,
            'published_at' => now(),
        ]);
        $snapshot = PublicationSnapshot::factory()->for($profile)->create([
            'version' => 1,
            'username' => 'creator',
            'display_name' => 'Published name',
            'links' => [['id' => 1, 'label' => 'Original', 'url' => 'https://example.com', 'position' => 0]],
        ]);
        $profile->update(['published_snapshot_id' => $snapshot->id]);

        $profile->update(['display_name' => 'Draft name']);
        $profile->links()->create(['label' => 'Draft only', 'url' => 'https://draft.example', 'position' => 0, 'enabled' => true]);

        $this->assertSame('Published name', $profile->publishedSnapshot->display_name);
        $this->assertSame('Original', $profile->publishedSnapshot->links[0]['label']);
        $this->assertSame('Draft name', $profile->fresh()->display_name);
    }

    public function test_profile_and_link_policies_enforce_ownership(): void
    {
        $owner = User::factory()->create();
        $stranger = User::factory()->create();
        $profile = Profile::factory()->for($owner)->create();
        $link = Link::factory()->for($profile)->create();

        $this->assertTrue($owner->can('update', $profile));
        $this->assertFalse($stranger->can('update', $profile));
        $this->assertTrue($owner->can('update', $link));
        $this->assertFalse($stranger->can('update', $link));
    }

    public function test_deleting_user_cascades_profile_links_and_snapshots(): void
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->for($user)->create();
        Link::factory()->for($profile)->create();
        PublicationSnapshot::factory()->for($profile)->create();

        $user->delete();
        $this->assertDatabaseMissing('profiles', ['id' => $profile->id]);
        $this->assertDatabaseCount('links', 0);
        $this->assertDatabaseCount('publication_snapshots', 0);
    }
}
