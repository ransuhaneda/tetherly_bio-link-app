<?php

namespace Database\Factories;

use App\Models\Link;
use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Link> */
class LinkFactory extends Factory
{
    protected $model = Link::class;

    public function definition(): array
    {
        return [
            'profile_id' => Profile::factory(),
            'label' => fake()->words(2, true),
            'url' => fake()->url(),
            'icon' => null,
            'category' => null,
            'position' => 0,
            'enabled' => true,
        ];
    }
}
