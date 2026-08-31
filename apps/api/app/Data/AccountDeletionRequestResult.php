<?php

namespace App\Data;

use App\Models\AccountDeletion;

final readonly class AccountDeletionRequestResult
{
    public function __construct(
        public AccountDeletion $deletion,
        public bool $wasRequestedNow,
    ) {}
}
