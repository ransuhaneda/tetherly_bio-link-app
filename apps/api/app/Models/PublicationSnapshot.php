<?php

namespace App\Models;

use App\Enums\ProfileTheme;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PublicationSnapshot extends Model
{
    use HasFactory;

    protected $fillable = ['profile_id', 'version', 'username', 'display_name', 'bio', 'avatar_path', 'theme', 'links', 'published_at'];

    protected function casts(): array
    {
        return [
            'version' => 'integer',
            'theme' => ProfileTheme::class,
            'links' => 'array',
            'published_at' => 'datetime',
        ];
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }
}
