<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
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
            'id_number' => 'required|unique:employees,id_number,' . $this->id,
            'phone' => 'required|unique:employees,phone,' . $this->id,
            'email' => 'nullable|email|unique:employees,email,' . $this->id,
            'designation' => 'required|string',
            'department' => 'nullable|string',
            'joining_date' => 'nullable|date',
            'image' => 'nullable|image|max:2048'
        ];
    }
}
