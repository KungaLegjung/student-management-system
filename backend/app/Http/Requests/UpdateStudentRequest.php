<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $studentId = $this->route('student')->id;

        return [
            'name' => 'required|min:3',
            'email' => 'required|email|unique:students,email,' . $studentId,
            'phone' => 'required|min:10',
            'course' => 'required|min:2',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Student name is required.',
            'name.min' => 'Student name must be at least 3 characters.',
            'email.required' => 'Student email is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email is already used by another student.',
            'phone.required' => 'Phone number is required.',
            'phone.min' => 'Phone number must be at least 10 digits.',
            'course.required' => 'Course name is required.',
            'course.min' => 'Course name must be at least 2 characters.',
        ];
    }
}