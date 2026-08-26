<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LinkResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return ['id' => $this->id, 'label' => $this->label, 'url' => $this->url, 'icon' => $this->icon, 'category' => $this->category, 'position' => $this->position, 'enabled' => $this->enabled, 'created_at' => $this->created_at?->toISOString(), 'updated_at' => $this->updated_at?->toISOString()];
    }
}
