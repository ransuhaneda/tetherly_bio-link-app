<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountDeletionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'state' => $this->state->value,
            'requested_at' => $this->requested_at->toISOString(),
            'recovery_deadline' => $this->recovery_deadline->toISOString(),
            'deletion_date' => $this->recovery_deadline->toDateString(),
            'username' => $this->user?->profile?->username,
        ];
    }
}
