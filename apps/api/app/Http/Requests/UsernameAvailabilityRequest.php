<?php

namespace App\Http\Requests;

use App\Support\Username;
use Illuminate\Foundation\Http\FormRequest;

class UsernameAvailabilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['username' => Username::normalize($this->route('username'))]);
    }

    public function rules(): array
    {
        return ['username' => Username::validationRules()];
    }
}
