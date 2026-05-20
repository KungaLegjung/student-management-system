@extends('layouts.app')

@section('content')

<h1 class="h3 mb-3">Student Details</h1>

<div class="card">
    <div class="card-body">
        <p><strong>ID:</strong> {{ $student->id }}</p>

        <p><strong>Name:</strong> {{ $student->name }}</p>

        <p><strong>Email:</strong> {{ $student->email }}</p>

        <p><strong>Phone:</strong> {{ $student->phone }}</p>

        <p><strong>Course:</strong> {{ $student->course }}</p>

        <p><strong>Created At:</strong> {{ $student->created_at }}</p>

        <p><strong>Updated At:</strong> {{ $student->updated_at }}</p>

        <a href="{{ route('students.edit', $student->id) }}" class="btn btn-warning">
            Edit
        </a>

        <a href="{{ route('students.index') }}" class="btn btn-secondary">
            Back
        </a>
    </div>
</div>

@endsection