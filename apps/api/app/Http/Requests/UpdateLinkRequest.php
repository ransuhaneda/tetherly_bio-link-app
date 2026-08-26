<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLinkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return ['label' => ['sometimes', 'required', 'string', 'max:80'], 'url' => ['sometimes', 'required', 'url:http,https', 'max:2048'], 'icon' => ['sometimes', 'nullable', 'string', 'max:64'], 'category' => ['sometimes', 'nullable', 'string', 'max:40'], 'enabled' => ['sometimes', 'boolean']];
    }
}
