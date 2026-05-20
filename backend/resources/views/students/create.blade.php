@extends('layouts.app')

@section('content')

<h1 class="h3 mb-3">Add Student</h1>

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

<form action="{{ route('students.store') }}" method="POST">
    @csrf

    <div class="mb-3">
        <label class="form-label">Name:</label>
        <input
            type="text"
            name="name"
            class="form-control"
            value="{{ old('name') }}"
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
            value="{{ old('email') }}"
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
            value="{{ old('phone') }}"
        >

        @error('phone')
            <small class="text-danger">{{ $message }}</small>
        @enderror
    </div>

    <div class="mb-3">
        <label class="form-label">Course:</label>
    
        <select name="course" class="form-select">
            <option value="">Select Course</option>
    
            <option value="MCA" {{ old('course') == 'MCA' ? 'selected' : '' }}>
                MCA
            </option>
    
            <option value="BCA" {{ old('course') == 'BCA' ? 'selected' : '' }}>
                BCA
            </option>
    
            <option value="MBA" {{ old('course') == 'MBA' ? 'selected' : '' }}>
                MBA
            </option>
    
            <option value="BBA" {{ old('course') == 'BBA' ? 'selected' : '' }}>
                BBA
            </option>
    
            <option value="B.Tech" {{ old('course') == 'B.Tech' ? 'selected' : '' }}>
                B.Tech
            </option>
        </select>
    
        @error('course')
            <small class="text-danger">{{ $message }}</small>
        @enderror
    </div>

    <button type="submit" class="btn btn-primary">
        Save
    </button>

    <a href="{{ route('students.index') }}" class="btn btn-secondary">
        Back
    </a>
</form>

@endsection