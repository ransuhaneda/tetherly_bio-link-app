<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Link extends Model
{
    use HasFactory;

    protected static function booted(): void
    {
        static::saved(function (self $link): void {
            if ($link->wasRecentlyCreated || $link->wasChanged(['label', 'url', 'icon', 'category', 'position', 'enabled'])) {
                $link->profile()->increment('draft_revision');
            }
        });
        static::deleted(function (self $link): void {
            if ($link->profile) {
                $link->profile->increment('draft_revision');
            }
        });
    }

    protected $fillable = ['profile_id', 'label', 'url', 'icon', 'category', 'position', 'enabled'];

    protected function casts(): array
    {
        return ['position' => 'integer', 'enabled' => 'boolean'];
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }
}
