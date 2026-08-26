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

    protected function casts(): array
    {
        return [
            'theme' => ProfileTheme::class,
            'publication_state' => PublicationState::class,
            'published_at' => 'datetime',
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
}
