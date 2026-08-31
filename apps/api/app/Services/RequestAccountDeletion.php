<?php

namespace App\Services;

use App\Data\AccountDeletionRequestResult;
use App\Enums\AccountDeletionState;
use App\Enums\PublicationState;
use App\Models\AccountDeletion;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class RequestAccountDeletion
{
    public function handle(User $authenticatedUser): AccountDeletionRequestResult
    {
        return DB::transaction(function () use ($authenticatedUser): AccountDeletionRequestResult {
            $user = User::query()
                ->with('profile')
                ->lockForUpdate()
                ->findOrFail($authenticatedUser->getKey());

            $deletion = AccountDeletion::query()
                ->where('user_id', $user->getKey())
                ->lockForUpdate()
                ->first();

            if ($deletion && $deletion->state !== AccountDeletionState::Restored) {
                return new AccountDeletionRequestResult(
                    $deletion->loadMissing('user.profile'),
                    false,
                );
            }

            $requestedAt = now();
            $attributes = [
                'state' => AccountDeletionState::Pending,
                'requested_at' => $requestedAt,
                'recovery_deadline' => $requestedAt->copy()->addDays(30),
                'email' => $user->email,
                'purge_attempts' => 0,
                'last_error' => null,
                'next_retry_at' => null,
            ];

            if ($deletion) {
                $deletion->update($attributes);
            } else {
                $deletion = $user->accountDeletion()->create($attributes);
            }

            $user->profile->update([
                'publication_state' => PublicationState::Draft,
                'published_at' => null,
                'published_snapshot_id' => null,
            ]);

            $user->tokens()->delete();
            DB::table('sessions')->where('user_id', $user->getKey())->delete();

            return new AccountDeletionRequestResult(
                $deletion->loadMissing('user.profile'),
                true,
            );
        });
    }
}
