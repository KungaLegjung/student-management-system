<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentApiController extends Controller
{
    // GET /api/students
    public function index()
    {
        $students = Student::latest()->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Students fetched successfully.',
            'data' => $students,
        ]);
    }

    // POST /api/students
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|min:3',
            'email' => 'required|email|unique:students,email',
            'phone' => 'required|min:10',
            'course' => 'required|min:2',
        ]);

        $student = Student::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Student created successfully.',
            'data' => $student,
        ], 201);
    }

    // GET /api/students/{student}
    public function show(Student $student)
    {
        return response()->json([
            'success' => true,
            'message' => 'Student fetched successfully.',
            'data' => $student,
        ]);
    }

    // PUT /api/students/{student}
    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'name' => 'required|min:3',
            'email' => 'required|email|unique:students,email,' . $student->id,
            'phone' => 'required|min:10',
            'course' => 'required|min:2',
        ]);

        $student->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Student updated successfully.',
            'data' => $student,
        ]);
    }

    // DELETE /api/students/{student}
    public function destroy(Student $student)
    {
        $student->delete();

        return response()->json([
            'success' => true,
            'message' => 'Student deleted successfully.',
        ]);
    }
    public function trash()
    {
        $students = Student::onlyTrashed()->latest()->get();
    
        return response()->json([
            'data' => $students
        ]);
    }
    
    public function restore($id)
    {
        $student = Student::onlyTrashed()->findOrFail($id);
    
        $student->restore();
    
        return response()->json([
            'message' => 'Student restored successfully',
            'data' => $student
        ]);
    }
    
    public function forceDelete($id)
    {
        $student = Student::onlyTrashed()->findOrFail($id);
    
        $student->forceDelete();
    
        return response()->json([
            'message' => 'Student permanently deleted successfully'
        ]);
    }
}