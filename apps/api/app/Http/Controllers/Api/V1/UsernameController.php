<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\UsernameAvailabilityRequest;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class UsernameController extends Controller
{
    public function availability(UsernameAvailabilityRequest $request, string $username): JsonResponse
    {
        $username = strtolower(trim($username));
        $key = 'username-availability|'.$request->ip();
        if (RateLimiter::tooManyAttempts($key, 30)) {
            throw ValidationException::withMessages(['username' => ['Too many availability checks. Please try again later.']]);
        }
        RateLimiter::hit($key, 60);

        return response()->json(['data' => ['username' => $username, 'available' => ! Profile::where('username', $username)->exists()]]);
    }
}
