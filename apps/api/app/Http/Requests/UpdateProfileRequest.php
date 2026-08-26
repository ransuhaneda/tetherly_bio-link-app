<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class UpdateProfileRequest extends FormRequest {
 public function authorize(): bool { return $this->user()?->can('update',$this->user()->profile) ?? false; }
 protected function prepareForValidation(): void { if ($this->has('username')) $this->merge(['username'=>strtolower(trim((string)$this->username))]); }
 public function rules(): array { return ['username'=>['sometimes','required','string','min:3','max:30','regex:/^[a-z0-9](?:[a-z0-9_-]{1,28}[a-z0-9])?$/',Rule::unique('profiles','username')->ignore($this->user()->profile),function($attribute,$value,$fail){ if(in_array($value,['admin','api','app','login','support','www'],true)) $fail('That username is reserved.'); }],'display_name'=>['sometimes','nullable','string','max:80'],'bio'=>['sometimes','nullable','string','max:280'],'theme'=>['sometimes','string','in:editorial-bento']]; }
}
