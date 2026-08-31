<?php

namespace App\Enums;

enum AccountDeletionState: string
{
    case Pending = 'pending';
    case Restored = 'restored';
    case PurgeEligible = 'purge_eligible';
    case Purging = 'purging';
    case Completed = 'completed';
    case Failed = 'failed';
}

// The lifecycle is intentionally separate from the account's active state.
// It preserves recovery and operational retry metadata without weakening User.
