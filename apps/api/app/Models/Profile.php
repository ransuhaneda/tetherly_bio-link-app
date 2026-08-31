<?php

namespace App\Models;

use App\Enums\ProfileTheme;
use App\Enums\PublicationState;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'username', 'display_name', 'bio', 'avatar_path', 'theme', 'publication_state', 'published_at', 'published_snapshot_id'];

    private const REVISION_FIELDS = ['username', 'display_name', 'bio', 'avatar_path', 'theme'];

    protected static function booted(): void
    {
        static::saving(function (self $profile): void {
            if ($profile->exists && $profile->isDirty(self::REVISION_FIELDS)) {
                $profile->draft_revision = ((int) $profile->getRawOriginal('draft_revision')) + 1;
            }
        });
    }

    protected function casts(): array
    {
        return [
            'theme' => ProfileTheme::class,
            'publication_state' => PublicationState::class,
            'published_at' => 'datetime',
            'draft_revision' => 'integer',
        ];
    }

    public function setUsernameAttribute(string $value): void
    {
        $this->attributes['username'] = strtolower(trim($value));
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function links(): HasMany
    {
        return $this->hasMany(Link::class)->orderBy('position')->orderBy('id');
    }

    public function publicationSnapshots(): HasMany
    {
        return $this->hasMany(PublicationSnapshot::class)->latest('version');
    }

    public function publishedSnapshot(): BelongsTo
    {
        return $this->belongsTo(PublicationSnapshot::class, 'published_snapshot_id');
    }

    public function getPublicationStatusAttribute(): string
    {
        if (! $this->published_snapshot_id) return 'draft';
        return (int) $this->draft_revision === (int) ($this->publishedSnapshot?->source_revision ?? 0) ? 'published' : 'changes_not_published';
    }
}
