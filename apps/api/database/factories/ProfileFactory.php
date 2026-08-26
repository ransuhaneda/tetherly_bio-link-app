<?php

namespace Database\Factories;

use App\Enums\ProfileTheme;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Profile> */
class ProfileFactory extends Factory
{
    protected $model = Profile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'username' => fake()->unique()->regexify('[a-z][a-z0-9]{5,12}'),
            'display_name' => fake()->name(),
            'bio' => fake()->sentence(8),
            'avatar_path' => null,
            'theme' => ProfileTheme::EditorialBento,
            'publication_state' => 'draft',
            'published_at' => null,
            'published_snapshot_id' => null,
        ];
    }
}
