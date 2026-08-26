<?php

namespace App\Policies;

use App\Models\Profile;
use App\Models\PublicationSnapshot;
use App\Models\User;

class PublicationSnapshotPolicy
{
    public function view(User $user, PublicationSnapshot $snapshot): bool
    {
        return $user->id === $snapshot->profile()->value('user_id');
    }

    public function create(User $user, Profile $profile): bool
    {
        return $user->id === $profile->user_id;
    }

    public function update(User $user, PublicationSnapshot $snapshot): bool
    {
        return false;
    }

    public function delete(User $user, PublicationSnapshot $snapshot): bool
    {
        return false;
    }
}
