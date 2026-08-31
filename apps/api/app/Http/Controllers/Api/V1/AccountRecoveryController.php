<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\AccountDeletionState;
use App\Enums\PublicationState;
use App\Http\Controllers\Controller;
use App\Http\Resources\AccountDeletionResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Support\AccountRecoverySession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AccountRecoveryController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $this->recoveryUser($request);

        if (! $user) {
            return response()->json(['message' => 'No account restoration is available.'], 404);
        }

        if (! $user->accountDeletion?->isRestorable()) {
            $request->session()->forget(AccountRecoverySession::USER_ID);

            return response()->json(['message' => 'This account cannot be restored.'], 403);
        }

        return response()->json([
            'data' => [
                'status' => 'restoration_required',
                'deletion' => new AccountDeletionResource($user->accountDeletion),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $userId = $request->session()->get(AccountRecoverySession::USER_ID);

        if (! is_int($userId)) {
            return response()->json(['message' => 'No account restoration is available.'], 404);
        }

        $user = DB::transaction(function () use ($userId): ?User {
            $user = User::query()->with('profile')->lockForUpdate()->find($userId);
            if (! $user) {
                return null;
            }

            $deletion = $user->accountDeletion()->lockForUpdate()->first();
            if (! $deletion?->isRestorable()) {
                return null;
            }

            $deletion->update([
                'state' => AccountDeletionState::Restored,
                'last_error' => null,
                'next_retry_at' => null,
            ]);
            $user->profile->update([
                'publication_state' => PublicationState::Draft,
                'published_at' => null,
                'published_snapshot_id' => null,
            ]);

            return $user->load('profile');
        });

        if (! $user) {
            $request->session()->forget(AccountRecoverySession::USER_ID);

            return response()->json(['message' => 'This account cannot be restored.'], 403);
        }

        Auth::login($user);
        $request->session()->forget(AccountRecoverySession::USER_ID);
        $request->session()->regenerate();

        return response()->json([
            'data' => [
                'status' => 'authenticated',
                'user' => new UserResource($user),
            ],
            'message' => 'Account restored.',
        ]);
    }

    private function recoveryUser(Request $request): ?User
    {
        $userId = $request->session()->get(AccountRecoverySession::USER_ID);

        if (! is_int($userId)) {
            return null;
        }

        return User::query()
            ->with(['profile', 'accountDeletion'])
            ->find($userId);
    }
}
