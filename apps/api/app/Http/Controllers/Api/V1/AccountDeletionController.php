<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\RequestAccountDeletionRequest;
use App\Http\Resources\AccountDeletionResource;
use App\Mail\AccountDeletionRequested;
use App\Services\RequestAccountDeletion;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Throwable;

class AccountDeletionController extends Controller
{
    public function store(
        RequestAccountDeletionRequest $request,
        RequestAccountDeletion $requestAccountDeletion,
    ): JsonResponse {
        $user = $request->user();
        $rateLimitKey = 'account-deletion-confirmation|'.$user->getKey().'|'.$request->ip();

        if (RateLimiter::tooManyAttempts($rateLimitKey, 5)) {
            $retryAfter = RateLimiter::availableIn($rateLimitKey);

            return response()->json([
                'message' => 'Too many password attempts. Please try again later.',
                'retry_after' => $retryAfter,
            ], 429)->header('Retry-After', (string) $retryAfter);
        }

        if (! Hash::check($request->validated('current_password'), $user->password)) {
            RateLimiter::hit($rateLimitKey, 60);

            throw ValidationException::withMessages([
                'current_password' => ['The provided password is incorrect.'],
            ]);
        }

        RateLimiter::clear($rateLimitKey);
        $result = $requestAccountDeletion->handle($user);

        if ($result->wasRequestedNow) {
            try {
                $deletion = $result->deletion;
                Mail::to($deletion->email)->queue(new AccountDeletionRequested(
                    username: $deletion->user->profile->username,
                    requestDate: $deletion->requested_at->format('F j, Y'),
                    deletionDate: $deletion->recovery_deadline->format('F j, Y'),
                    loginUrl: rtrim(config('app.frontend_url'), '/').'/login',
                ));
            } catch (Throwable $exception) {
                Log::warning('Account deletion email could not be queued.', [
                    'account_deletion_id' => $result->deletion->getKey(),
                    'exception' => $exception::class,
                ]);
            }
        }

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'data' => new AccountDeletionResource($result->deletion),
            'message' => 'Account deletion requested.',
        ]);
    }
}
