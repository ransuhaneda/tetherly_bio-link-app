<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\AvatarRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\ProfileResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(Request $request): ProfileResource
    {
        return new ProfileResource($request->user()->profile);
    }

    public function update(UpdateProfileRequest $request): ProfileResource
    {
        $profile = $request->user()->profile;
        $profile->update($request->validated());

        return new ProfileResource($profile->refresh());
    }

    public function avatar(AvatarRequest $request): ProfileResource
    {
        $profile = $request->user()->profile;
        $old = $profile->avatar_path;
        $path = $request->file('avatar')->store('avatars', 'public');
        $profile->update(['avatar_path' => $path]);
        if ($old) {
            Storage::disk('public')->delete($old);
        }

        return new ProfileResource($profile->refresh());
    }

    public function deleteAvatar(Request $request): ProfileResource
    {
        $profile = $request->user()->profile;
        $old = $profile->avatar_path;
        $profile->update(['avatar_path' => null]);
        if ($old) {
            Storage::disk('public')->delete($old);
        }

        return new ProfileResource($profile->refresh());
    }
}
