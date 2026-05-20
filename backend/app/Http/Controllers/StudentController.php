<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
class StudentController extends Controller
{
    public function index(Request $request)
{
    $search = $request->search;
    $course = $request->course;

    $students = Student::query()
        ->when($search, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
    ->orWhere('email', 'ilike', "%{$search}%")
    ->orWhere('phone', 'ilike', "%{$search}%")
    ->orWhere('course', 'ilike', "%{$search}%");
            });
        })
        ->when($course, function ($query, $course) {
            $query->where('course', $course);
        })
        ->latest()
        ->paginate(5);

    return view('students.index', compact('students', 'search', 'course'));
}

    // Show add student form
    public function create()
    {
        return view('students.create');
    }

    // Store student data
    public function store(StoreStudentRequest $request)
{
    Student::create($request->validated());

    return redirect()->route('students.index')
        ->with('success', 'Student added successfully.');
}

    // Show one student
    public function show(Student $student)
{
    return view('students.show', compact('student'));
}

    // Show edit form
    public function edit(Student $student)
    {
        return view('students.edit', compact('student'));
    }

    // Update student data
    public function update(UpdateStudentRequest $request, Student $student)
{
    $student->update($request->validated());

    return redirect()->route('students.index')
        ->with('success', 'Student updated successfully.');
}

    // Delete student
    public function destroy(Student $student, Request $request)
    {
        $student->delete();
    
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Student deleted successfully.',
                'id' => $student->id,
            ]);
        }
    
        return redirect()->route('students.index')
            ->with('success', 'Student deleted successfully.');
    }
    // Show soft deleted students
public function trash()
{
    $students = Student::onlyTrashed()->latest()->paginate(5);

    return view('students.trash', compact('students'));
}

// Restore soft deleted student
public function restore($id, Request $request)
{
    $student = Student::onlyTrashed()->findOrFail($id);

    $student->restore();

    if ($request->expectsJson()) {
        return response()->json([
            'success' => true,
            'message' => 'Student restored successfully.',
            'id' => $student->id,
        ]);
    }

    return redirect()->route('students.trash')
        ->with('success', 'Student restored successfully.');
}

// Permanently delete student
public function forceDelete($id, Request $request)
{
    $student = Student::onlyTrashed()->findOrFail($id);

    $student->forceDelete();

    if ($request->expectsJson()) {
        return response()->json([
            'success' => true,
            'message' => 'Student permanently deleted.',
            'id' => $id,
        ]);
    }

    return redirect()->route('students.trash')
        ->with('success', 'Student permanently deleted.');
}
}