<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\AccountDeletionResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\RegisterUser;
use App\Support\AccountRecoverySession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request, RegisterUser $registerUser): JsonResponse
    {
        if (Auth::check()) {
            return response()->json(['message' => 'You are already logged in.'], 409);
        }

        $user = $registerUser->handle($request->validated());
        $request->session()->forget(AccountRecoverySession::USER_ID);
        Auth::login($user);
        $request->session()->regenerate();

        return (new UserResource($user))->response()->setStatusCode(201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        if (Auth::check()) {
            $authenticatedUser = $request->user()->loadMissing('accountDeletion');

            if (! $authenticatedUser->accountDeletion?->restrictsAccountAccess()) {
                return response()->json(['message' => 'You are already logged in.'], 409);
            }

            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        $credentials = $request->validated();
        $email = strtolower($credentials['email']);
        $key = $email.'|'.$request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $retryAfter = RateLimiter::availableIn($key);

            return response()->json([
                'message' => 'Too many login attempts. Please try again later.',
                'retry_after' => $retryAfter,
            ], 429)->header('Retry-After', (string) $retryAfter);
        }

        $request->session()->forget(AccountRecoverySession::USER_ID);
        $user = User::query()
            ->with(['profile', 'accountDeletion'])
            ->where('email', $email)
            ->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            RateLimiter::hit($key, 60);
            throw ValidationException::withMessages(['email' => ['The provided credentials are incorrect.']]);
        }

        RateLimiter::clear($key);

        if ($user->accountDeletion?->restrictsAccountAccess()) {
            if (! $user->accountDeletion->isRestorable()) {
                return response()->json(['message' => 'This account is unavailable.'], 403);
            }

            $request->session()->regenerate();
            $request->session()->put(AccountRecoverySession::USER_ID, $user->getKey());

            return response()->json([
                'data' => [
                    'status' => 'restoration_required',
                    'deletion' => new AccountDeletionResource($user->accountDeletion),
                ],
            ]);
        }

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'data' => [
                'status' => 'authenticated',
                'user' => new UserResource($user),
            ],
        ]);
    }

    public function me(Request $request): UserResource
    {
        return new UserResource($request->user()->load('profile'));
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->forget(AccountRecoverySession::USER_ID);
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(null, 204);
    }
}
