<?php

namespace App\Http\Requests;

use App\Support\Username;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->user()->profile) ?? false;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('username')) {
            $this->merge(['username' => Username::normalize($this->username)]);
        }
    }

    public function rules(): array
    {
        return ['username' => ['sometimes', ...Username::validationRules(false), Rule::unique('profiles', 'username')->ignore($this->user()->profile)], 'display_name' => ['sometimes', 'nullable', 'string', 'max:80'], 'bio' => ['sometimes', 'nullable', 'string', 'max:280'], 'theme' => ['sometimes', 'string', 'in:editorial-bento']];
    }
}
