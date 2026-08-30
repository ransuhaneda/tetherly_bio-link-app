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

    public function scopePending($query)
    {
        return $query->where('state', AccountDeletionState::Pending);
    }

    public function scopePurgeEligible($query)
    {
        return $query->whereIn('state', [
            AccountDeletionState::Pending,
            AccountDeletionState::Failed,
        ])->where('recovery_deadline', '<=', now());
    }
}
