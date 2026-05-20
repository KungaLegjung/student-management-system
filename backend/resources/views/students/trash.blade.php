@extends('layouts.app')

@section('content')

<h1 class="h3 mb-3">Deleted Students</h1>

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
    <thead class="table-danger">
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Course</th>
            <th>Deleted At</th>
            <th width="260">Action</th>
        </tr>
    </thead>

    <tbody>
        @forelse($students as $student)
            <tr id="trashRow{{ $student->id }}">
                <td>{{ $student->id }}</td>
                <td>{{ $student->name }}</td>
                <td>{{ $student->email }}</td>
                <td>{{ $student->phone }}</td>
                <td>{{ $student->course }}</td>
                <td>
                    {{ $student->deleted_at ? $student->deleted_at->format('d M Y, h:i A') : '-' }}
                </td>
                <td>
                    <button
                        type="button"
                        class="btn btn-sm btn-success ajax-restore-btn"
                        data-id="{{ $student->id }}"
                        data-url="{{ route('students.restore', $student->id) }}"
                    >
                        Restore
                    </button>

                    <button
                        type="button"
                        class="btn btn-sm btn-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#forceDeleteModal{{ $student->id }}"
                    >
                        Delete Forever
                    </button>

                    <!-- Force Delete Modal -->
                    <div class="modal fade" id="forceDeleteModal{{ $student->id }}" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">

                                <div class="modal-header">
                                    <h5 class="modal-title">Confirm Permanent Delete</h5>

                                    <button
                                        type="button"
                                        class="btn-close"
                                        data-bs-dismiss="modal"
                                    ></button>
                                </div>

                                <div class="modal-body">
                                    This will permanently delete
                                    <strong>{{ $student->name }}</strong>.
                                    <br>
                                    You cannot restore this student after this action.
                                </div>

                                <div class="modal-footer">
                                    <button
                                        type="button"
                                        class="btn btn-secondary"
                                        data-bs-dismiss="modal"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        class="btn btn-danger ajax-force-delete-btn"
                                        data-id="{{ $student->id }}"
                                        data-url="{{ route('students.forceDelete', $student->id) }}"
                                        data-modal-id="forceDeleteModal{{ $student->id }}"
                                    >
                                        Yes, Delete Forever
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        @empty
            <tr>
                <td colspan="7" class="text-center">
                    Trash is empty.
                </td>
            </tr>
        @endforelse
    </tbody>
</table>

<div class="mt-3">
    {{ $students->links() }}
</div>

<a href="{{ route('students.index') }}" class="btn btn-secondary">
    Back to Students
</a>

@endsection