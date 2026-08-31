<?php

namespace App\Http\Requests;

use App\Support\Username;
use App\Models\PublicationSnapshot;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['username' => Username::normalize($this->username)]);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'username' => [...Username::validationRules(), 'unique:profiles,username', function (string $attribute, mixed $value, \Closure $fail): void {
                if (PublicationSnapshot::where('username', $value)->whereHas('profile', fn ($query) => $query->where('publication_state', 'published')->whereColumn('published_snapshot_id', 'publication_snapshots.id'))->exists()) {
                    $fail('The username has already been reserved by a published profile.');
                }
            }],
            'password' => ['required', 'confirmed', Password::defaults()],
        ];
    }
}
