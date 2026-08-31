<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\AccountDeletionState;
use App\Enums\PublicationState;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProfileResource;
use App\Models\Profile;
use App\Models\PublicationSnapshot;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PublicationController extends Controller
{
    public function publish(Request $request): JsonResponse
    {
        $profile = $request->user()->profile;
        abort_unless($request->user()->can('publish', $profile), 403);
        $profile = DB::transaction(function () use ($profile): Profile {
            $profile->lockForUpdate()->refresh();
            if ($profile->published_snapshot_id && $profile->publication_status === 'published') {
                throw ValidationException::withMessages(['publication' => 'There are no unpublished changes to publish.']);
            }
            if (! is_string($profile->display_name) || trim($profile->display_name) === '') {
                throw ValidationException::withMessages(['display_name' => 'A display name is required to publish.']);
            }
            $links = $profile->links()->where('enabled', true)->get();
            if ($links->isEmpty()) {
                throw ValidationException::withMessages(['links' => 'At least one enabled link is required to publish.']);
            }
            $version = ((int) $profile->publicationSnapshots()->max('version')) + 1;
            $snapshot = PublicationSnapshot::create([
                'profile_id' => $profile->id, 'version' => $version, 'source_revision' => $profile->draft_revision, 'username' => $profile->username,
                'display_name' => $profile->display_name, 'bio' => $profile->bio, 'avatar_path' => $profile->avatar_path,
                'theme' => $profile->theme, 'links' => $links->map(fn ($link) => [
                    'id' => $link->id, 'label' => $link->label, 'url' => $link->url, 'icon' => $link->icon,
                    'category' => $link->category, 'position' => $link->position,
                ])->values()->all(), 'published_at' => now(),
            ]);
            $profile->update(['publication_state' => PublicationState::Published, 'published_at' => $snapshot->published_at, 'published_snapshot_id' => $snapshot->id]);

            return $profile->refresh();
        });

        return response()->json(['data' => new ProfileResource($profile), 'message' => 'Profile published.']);
    }

    public function unpublish(Request $request): JsonResponse
    {
        $profile = $request->user()->profile;
        abort_unless($request->user()->can('unpublish', $profile), 403);
        DB::transaction(function () use ($profile): void {
            $profile->lockForUpdate()->refresh();
            $profile->update(['publication_state' => PublicationState::Draft, 'published_at' => null, 'published_snapshot_id' => null]);
        });

        return response()->json(['data' => new ProfileResource($profile->refresh()), 'message' => 'Profile unpublished.']);
    }

    public function showPublic(string $username): JsonResponse
    {
        $username = strtolower(trim($username));
        $snapshot = PublicationSnapshot::query()->where('username', $username)
            ->whereHas('profile', fn ($q) => $q->where('publication_state', PublicationState::Published)->whereColumn('published_snapshot_id', 'publication_snapshots.id'))
            ->whereHas('profile.user', fn ($query) => $query
                ->whereDoesntHave('accountDeletion')
                ->orWhereHas('accountDeletion', fn ($deletionQuery) => $deletionQuery->where('state', AccountDeletionState::Restored)))
            ->latest('version')->first();
        abort_unless($snapshot, 404);
        $data = ['username' => $snapshot->username, 'display_name' => $snapshot->display_name, 'bio' => $snapshot->bio,
            'avatar_url' => $snapshot->avatar_path ? asset('storage/'.$snapshot->avatar_path) : null,
            'theme' => $snapshot->theme?->value, 'published_at' => $snapshot->published_at?->toISOString(), 'links' => $snapshot->links];

        return response()->json(['data' => $data]);
    }
}
