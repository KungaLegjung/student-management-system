@extends('layouts.app')

@section('content')

<h1 class="h3 mb-3">Edit Student</h1>

@if ($errors->any())
    <div class="alert alert-danger">
        <strong>Please fix these errors:</strong>
        <ul class="mb-0 mt-2">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form action="{{ route('students.update', $student->id) }}" method="POST">
    @csrf
    @method('PUT')

    <div class="mb-3">
        <label class="form-label">Name:</label>
        <input
            type="text"
            name="name"
            class="form-control"
            value="{{ old('name', $student->name) }}"
        >

        @error('name')
            <small class="text-danger">{{ $message }}</small>
        @enderror
    </div>

    <div class="mb-3">
        <label class="form-label">Email:</label>
        <input
            type="email"
            name="email"
            class="form-control"
            value="{{ old('email', $student->email) }}"
        >

        @error('email')
            <small class="text-danger">{{ $message }}</small>
        @enderror
    </div>

    <div class="mb-3">
        <label class="form-label">Phone:</label>
        <input
            type="text"
            name="phone"
            class="form-control"
            value="{{ old('phone', $student->phone) }}"
        >

        @error('phone')
            <small class="text-danger">{{ $message }}</small>
        @enderror
    </div>

    <div class="mb-3">
        <label class="form-label">Course:</label>
    
        <select name="course" class="form-select">
            <option value="">Select Course</option>
    
            <option value="MCA" {{ old('course', $student->course) == 'MCA' ? 'selected' : '' }}>
                MCA
            </option>
    
            <option value="BCA" {{ old('course', $student->course) == 'BCA' ? 'selected' : '' }}>
                BCA
            </option>
    
            <option value="MBA" {{ old('course', $student->course) == 'MBA' ? 'selected' : '' }}>
                MBA
            </option>
    
            <option value="BBA" {{ old('course', $student->course) == 'BBA' ? 'selected' : '' }}>
                BBA
            </option>
    
            <option value="B.Tech" {{ old('course', $student->course) == 'B.Tech' ? 'selected' : '' }}>
                B.Tech
            </option>
        </select>
    
        @error('course')
            <small class="text-danger">{{ $message }}</small>
        @enderror
    </div>

    <button type="submit" class="btn btn-primary">
        Update
    </button>

    <a href="{{ route('students.index') }}" class="btn btn-secondary">
        Back
    </a>
</form>

@endsection