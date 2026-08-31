<?php

namespace App\Models;

use App\Enums\AccountDeletionState;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccountDeletion extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'state', 'requested_at', 'recovery_deadline', 'email',
        'purge_attempts', 'last_error', 'next_retry_at',
    ];

    protected function casts(): array
    {
        return [
            'state' => AccountDeletionState::class,
            'requested_at' => 'datetime',
            'recovery_deadline' => 'datetime',
            'next_retry_at' => 'datetime',
            'purge_attempts' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function restrictsAccountAccess(): bool
    {
        return $this->state !== AccountDeletionState::Restored;
    }

    public function isRestorable(): bool
    {
        return $this->state === AccountDeletionState::Pending
            && $this->recovery_deadline->isFuture();
    }

    public function isPurgeEligible(): bool
    {
        if ($this->recovery_deadline->isFuture()) {
            return false;
        }

        if (in_array($this->state, [
            AccountDeletionState::Pending,
            AccountDeletionState::PurgeEligible,
        ], true)) {
            return true;
        }

        return in_array($this->state, [
            AccountDeletionState::Failed,
            AccountDeletionState::Purging,
        ], true) && (! $this->next_retry_at || $this->next_retry_at->lessThanOrEqualTo(now()));
    }

    public function scopePending($query)
    {
        return $query->where('state', AccountDeletionState::Pending);
    }

    public function scopePurgeEligible($query)
    {
        return $query
            ->where('recovery_deadline', '<=', now())
            ->where(function ($query): void {
                $query->whereIn('state', [
                    AccountDeletionState::Pending,
                    AccountDeletionState::PurgeEligible,
                ])->orWhere(function ($query): void {
                    $query->whereIn('state', [
                        AccountDeletionState::Failed,
                        AccountDeletionState::Purging,
                    ])->where(function ($query): void {
                        $query->whereNull('next_retry_at')
                            ->orWhere('next_retry_at', '<=', now());
                    });
                });
            });
    }
}
