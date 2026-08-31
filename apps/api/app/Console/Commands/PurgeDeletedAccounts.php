<?php

namespace App\Console\Commands;

use App\Models\AccountDeletion;
use App\Services\PurgeAccount;
use Illuminate\Console\Command;

class PurgeDeletedAccounts extends Command
{
    protected $signature = 'accounts:purge-deleted {--limit=100 : Maximum accounts to process (1-500)}';

    protected $description = 'Purge accounts whose recovery deadline has passed';

    public function handle(PurgeAccount $purgeAccount): int
    {
        $limit = filter_var($this->option('limit'), FILTER_VALIDATE_INT);
        if ($limit === false || $limit < 1 || $limit > 500) {
            $this->error('The --limit option must be an integer between 1 and 500.');

            return self::INVALID;
        }

        $deletions = AccountDeletion::query()
            ->purgeEligible()
            ->orderBy('id')
            ->limit($limit)
            ->get();
        $completed = 0;
        $failed = 0;

        foreach ($deletions as $deletion) {
            if ($purgeAccount->handle($deletion)) {
                $completed++;
            } else {
                $failed++;
            }
        }

        $this->info("Account purge finished: {$completed} completed, {$failed} failed.");

        return $failed > 0 ? self::FAILURE : self::SUCCESS;
    }
}
