<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AvatarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->user()->profile) ?? false;
    }

    public function rules(): array
    {
        return ['avatar' => ['required', 'file', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120']];
    }
}
