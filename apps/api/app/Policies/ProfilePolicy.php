<?php

namespace App\Policies;

use App\Models\Profile;
use App\Models\User;

class ProfilePolicy
{
    public function view(User $user, Profile $profile): bool
    {
        return $user->id === $profile->user_id;
    }

    public function update(User $user, Profile $profile): bool
    {
        return $this->view($user, $profile);
    }

    public function publish(User $user, Profile $profile): bool
    {
        return $this->view($user, $profile);
    }

    public function unpublish(User $user, Profile $profile): bool
    {
        return $this->view($user, $profile);
    }
}
