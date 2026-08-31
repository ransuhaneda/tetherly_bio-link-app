<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\UsernameAvailabilityRequest;
use App\Models\Profile;
use App\Models\PublicationSnapshot;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\RateLimiter;

class UsernameController extends Controller
{
    public function availability(UsernameAvailabilityRequest $request): JsonResponse
    {
        $username = $request->validated('username');
        $key = 'username-availability|'.$request->ip();
        if (RateLimiter::tooManyAttempts($key, 30)) {
            $retryAfter = RateLimiter::availableIn($key);

            return response()->json([
                'message' => 'Too many availability checks. Please try again later.',
                'retry_after' => $retryAfter,
            ], 429)->header('Retry-After', (string) $retryAfter);
        }
        RateLimiter::hit($key, 60);

        $claimedByDraft = Profile::where('username', $username)->exists();
        $claimedByPublication = PublicationSnapshot::where('username', $username)
            ->whereHas('profile', fn ($query) => $query->where('publication_state', 'published')->whereColumn('published_snapshot_id', 'publication_snapshots.id'))
            ->exists();
        return response()->json(['data' => ['username' => $username, 'available' => ! $claimedByDraft && ! $claimedByPublication]]);
    }
}
