<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class RegisterUser
{
    public function handle(array $attributes): User
    {
        return DB::transaction(function () use ($attributes): User {
            $user = User::create([
                'name' => $attributes['name'],
                'email' => $attributes['email'],
                'password' => $attributes['password'],
            ]);

            $user->profile()->create(['username' => $attributes['username']]);

            return $user->load('profile');
        });
    }
}
