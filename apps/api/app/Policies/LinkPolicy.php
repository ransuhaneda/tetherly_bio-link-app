<?php

namespace App\Policies;

use App\Models\Link;
use App\Models\Profile;
use App\Models\User;

class LinkPolicy
{
    public function view(User $user, Link $link): bool
    {
        return $this->owns($user, $link);
    }

    public function create(User $user, Profile $profile): bool
    {
        return $user->id === $profile->user_id;
    }

    public function update(User $user, Link $link): bool
    {
        return $this->owns($user, $link);
    }

    public function delete(User $user, Link $link): bool
    {
        return $this->owns($user, $link);
    }

    public function reorder(User $user, Profile $profile): bool
    {
        return $user->id === $profile->user_id;
    }

    private function owns(User $user, Link $link): bool
    {
        return $user->id === $link->profile()->value('user_id');
    }
}
