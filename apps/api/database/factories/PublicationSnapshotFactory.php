<?php

namespace Database\Factories;

use App\Enums\ProfileTheme;
use App\Models\Profile;
use App\Models\PublicationSnapshot;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<PublicationSnapshot> */
class PublicationSnapshotFactory extends Factory
{
    protected $model = PublicationSnapshot::class;

    public function definition(): array
    {
        return [
            'profile_id' => Profile::factory(),
            'version' => 1,
            'username' => fake()->unique()->regexify('[a-z][a-z0-9]{5,12}'),
            'display_name' => fake()->name(),
            'bio' => fake()->sentence(8),
            'avatar_path' => null,
            'theme' => ProfileTheme::EditorialBento,
            'links' => [],
            'published_at' => now(),
        ];
    }
}
