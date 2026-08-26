<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReorderLinksRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return ['ordered_link_ids' => ['required', 'array', 'list'], 'ordered_link_ids.*' => ['required', 'integer', 'distinct', 'min:1']];
    }
}
