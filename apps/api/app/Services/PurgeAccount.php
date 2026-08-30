<?php

namespace App\Services;

use App\Enums\AccountDeletionState;
use App\Enums\PublicationState;
use App\Models\AccountDeletion;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Throwable;

class PurgeAccount
{
    public function handle(AccountDeletion $candidate): bool
    {
        $deletionId = $candidate->getKey();
        $userId = $candidate->user_id;
        $phase = 'claim';

        try {
            $paths = DB::transaction(function () use ($deletionId): ?array {
                $deletion = AccountDeletion::query()->lockForUpdate()->find($deletionId);
                if (! $deletion?->isPurgeEligible()) {
                    return null;
                }

                $user = User::query()
                    ->with(['profile.publicationSnapshots'])
                    ->lockForUpdate()
                    ->find($deletion->user_id);
                if (! $user) {
                    $deletion->delete();

                    return [];
                }

                $paths = collect([
                    $user->profile?->avatar_path,
                    ...($user->profile?->publicationSnapshots
                        ->pluck('avatar_path')
                        ->all() ?? []),
                ])->filter(fn (mixed $path): bool => is_string($path) && $path !== '')
                    ->unique()
                    ->values()
                    ->all();

                $deletion->update([
                    'state' => AccountDeletionState::Purging,
                    'purge_attempts' => $deletion->purge_attempts + 1,
                    'last_error' => null,
                    'next_retry_at' => now()->addMinutes(15),
                ]);

                return $paths;
            });

            if ($paths === null) {
                return true;
            }

            $phase = 'external_files';
            if ($paths !== [] && ! Storage::disk('public')->delete($paths)) {
                throw new RuntimeException('Required external-file cleanup failed.');
            }

            $phase = 'database';
            DB::transaction(function () use ($deletionId): void {
                $deletion = AccountDeletion::query()->lockForUpdate()->find($deletionId);
                if (! $deletion) {
                    return;
                }

                $user = User::query()->lockForUpdate()->find($deletion->user_id);
                if (! $user) {
                    $deletion->delete();

                    return;
                }

                DB::table('sessions')->where('user_id', $user->getKey())->delete();
                DB::table('password_reset_tokens')->where('email', $user->email)->delete();
                $user->tokens()->delete();
                $user->profile()->update([
                    'publication_state' => PublicationState::Draft,
                    'published_at' => null,
                    'published_snapshot_id' => null,
                ]);
                $user->delete();
            });

            return true;
        } catch (Throwable $exception) {
            AccountDeletion::query()->whereKey($deletionId)->update([
                'state' => AccountDeletionState::Failed,
                'last_error' => 'Account purge did not complete.',
                'next_retry_at' => now()->addHour(),
            ]);
            Log::error('Account purge failed.', [
                'account_deletion_id' => $deletionId,
                'user_id' => $userId,
                'phase' => $phase,
                'exception' => $exception::class,
            ]);

            return false;
        }
    }
}
