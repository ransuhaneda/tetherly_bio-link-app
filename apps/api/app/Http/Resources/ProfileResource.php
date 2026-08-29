<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'display_name' => $this->display_name,
            'bio' => $this->bio,
            'avatar_url' => $this->avatar_path ? asset('storage/'.$this->avatar_path) : null,
            'theme' => $this->theme?->value,
            'publication_state' => $this->publication_state?->value,
            'published_at' => $this->published_at?->toISOString(),
            'published_version' => $this->published_snapshot_id
                ? $this->publishedSnapshot?->version
                : null,
            'has_published' => $this->publicationSnapshots()->exists(),
            'draft_revision' => $this->draft_revision,
            'publication_revision' => $this->publishedSnapshot?->source_revision,
            'publication_status' => $this->publication_status,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
