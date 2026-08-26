<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class CreateLinkRequest extends FormRequest {
 public function authorize(): bool { return true; }
 public function rules(): array { return ['label'=>['required','string','max:80'],'url'=>['required','url:http,https','max:2048'],'icon'=>['nullable','string','max:64'],'category'=>['nullable','string','max:40'],'enabled'=>['sometimes','boolean']]; }
}
