@extends('layouts.app')

@section('content')

<div class="d-flex justify-content-between align-items-center mb-3">
    <h1 class="h3">Student List</h1>

    {{-- <a href="{{ route('students.create') }}" class="btn btn-primary">
        Add Student
    </a> --}}
</div>

<form
    id="filterForm"
    action="{{ route('students.index') }}"
    method="GET"
    class="mb-3"
>
    <div class="row g-2">
        <div class="col-md-5">
            <input
    type="text"
    id="searchInput"
    name="search"
    class="form-control"
    placeholder="Search by name, email, phone, or course"
    value="{{ request('search') }}"
>
        </div>

        <div class="col-md-3">
            <select id="courseFilter" name="course" class="form-select">
                <option value="">All Courses</option>

                <option value="MCA" {{ request('course') == 'MCA' ? 'selected' : '' }}>MCA</option>
                <option value="BCA" {{ request('course') == 'BCA' ? 'selected' : '' }}>BCA</option>
                <option value="MBA" {{ request('course') == 'MBA' ? 'selected' : '' }}>MBA</option>
                <option value="BBA" {{ request('course') == 'BBA' ? 'selected' : '' }}>BBA</option>
                <option value="B.Tech" {{ request('course') == 'B.Tech' ? 'selected' : '' }}>B.Tech</option>
            </select>
        </div>

        <div class="col-md-2">
            <button type="submit" class="btn btn-success w-100">
                Filter
            </button>
        </div>

        <div class="col-md-2">
            <a href="{{ route('students.index') }}" class="btn btn-secondary w-100">
                Clear
            </a>
        </div>
    </div>
</form>

@if(session('success'))
    <div id="successAlert" class="alert alert-success alert-dismissible fade show">
        {{ session('success') }}

        <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
        ></button>
    </div>
@endif

<div id="ajaxMessage"></div>

<table class="table table-bordered table-striped table-hover">
    <thead class="table-primary">
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Course</th>
            <th width="260">Action</th>
        </tr>
    </thead>

    <tbody>
        @forelse($students as $student)
        <tr id="studentRow{{ $student->id }}">
                <td>{{ $student->id }}</td>
                <td>{{ $student->name }}</td>
                <td>{{ $student->email }}</td>
                <td>{{ $student->phone }}</td>
                <td>{{ $student->course }}</td>
                <td>
                    <a href="{{ route('students.show', $student->id) }}" class="btn btn-sm btn-info">
                        View
                    </a>

                    <a href="{{ route('students.edit', $student->id) }}" class="btn btn-sm btn-warning">
                        Edit
                    </a>

                    <button
                        type="button"
                        class="btn btn-sm btn-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteModal{{ $student->id }}"
                    >
                        Delete
                    </button>

                    <!-- Delete Modal -->
                    <div class="modal fade" id="deleteModal{{ $student->id }}" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">

                                <div class="modal-header">
                                    <h5 class="modal-title">Confirm Delete</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>

                                <div class="modal-body">
                                    Are you sure you want to delete
                                    <strong>{{ $student->name }}</strong>?
                                </div>

                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                        Cancel
                                    </button>

                                    <form action="{{ route('students.destroy', $student->id) }}" method="POST">
                                        <button
    type="button"
    class="btn btn-danger ajax-delete-btn"
    data-id="{{ $student->id }}"
    data-url="{{ route('students.destroy', $student->id) }}"
    data-modal-id="deleteModal{{ $student->id }}"
>
    Yes, Delete
</button>
                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        @empty
            <tr>
                <td colspan="6" class="text-center">
                    No students found.
                </td>
            </tr>
        @endforelse
    </tbody>
</table>

<div class="mt-3">
    {{ $students->appends(request()->query())->links() }}
</div>

@endsection