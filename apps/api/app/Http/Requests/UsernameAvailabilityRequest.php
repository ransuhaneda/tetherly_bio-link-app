<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UsernameAvailabilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['username' => strtolower(trim((string) $this->route('username')))]);
    }

    public function rules(): array
    {
        return ['username' => ['required', 'string', 'regex:/^[a-z0-9](?:[a-z0-9_-]{1,28}[a-z0-9])?$/', 'min:3', 'max:30']];
    }
}
