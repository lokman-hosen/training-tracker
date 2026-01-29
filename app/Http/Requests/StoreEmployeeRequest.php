<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'id_number' => 'nullable|unique:employees',
            'phone' => 'required|unique:employees',
            'email' => 'nullable|email|unique:employees',
            'designation' => 'required|string',
            'department' => 'nullable|string',
            'joining_date' => 'nullable|date',
            'image' => 'nullable|image|max:2048'
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'id_number.unique' => 'The employee ID number field is required',
        ];
    }
}
