<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\UsernameAvailabilityRequest;
use App\Models\Profile;
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

        return response()->json(['data' => ['username' => $username, 'available' => ! Profile::where('username', $username)->exists()]]);
    }
}
