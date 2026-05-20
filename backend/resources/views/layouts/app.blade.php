<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Student Management System</title>

    {{-- Bootstrap CSS --}}
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="bg-light">

    {{-- Navbar --}}
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">

            <a class="navbar-brand" href="{{ route('students.index') }}">
                Student Management
            </a>

            <div class="d-flex gap-2">
                <a href="{{ route('students.index') }}" class="btn btn-light btn-sm">
                    Home
                </a>

                <a href="{{ route('students.index') }}" class="btn btn-light btn-sm">
                    Students
                </a>

                <a href="{{ route('students.create') }}" class="btn btn-warning btn-sm">
                    Add Student
                </a>

                <a href="{{ route('students.trash') }}" class="btn btn-danger btn-sm">
                    Trash
                </a>
            </div>

        </div>
    </nav>

    {{-- Main Content --}}
    <div class="container mt-4">
        <div class="card shadow-sm">
            <div class="card-body">
                @yield('content')
            </div>
        </div>
    </div>

    {{-- Bootstrap JS --}}
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    {{-- Auto hide success alert --}}
    <script>
        function closeSuccessAlertAfterDelay() {
            setTimeout(function () {
                const alertBox = document.getElementById('successAlert');

                if (alertBox) {
                    bootstrap.Alert.getOrCreateInstance(alertBox).close();
                }
            }, 3000);
        }

        closeSuccessAlertAfterDelay();
    </script>

    {{-- Live search and course filter --}}
    <script>
        const filterForm = document.getElementById('filterForm');
        const searchInput = document.getElementById('searchInput');
        const courseFilter = document.getElementById('courseFilter');

        let typingTimer;

        if (filterForm && searchInput) {
            searchInput.addEventListener('keyup', function () {
                clearTimeout(typingTimer);

                typingTimer = setTimeout(function () {
                    filterForm.submit();
                }, 700);
            });
        }

        if (filterForm && courseFilter) {
            courseFilter.addEventListener('change', function () {
                filterForm.submit();
            });
        }
    </script>

    {{-- Reusable AJAX message --}}
    <script>
        function showAjaxMessage(message, type = 'success') {
            const ajaxMessage = document.getElementById('ajaxMessage');

            if (ajaxMessage) {
                ajaxMessage.innerHTML = `
                    <div id="successAlert" class="alert alert-${type} alert-dismissible fade show">
                        ${message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                `;

                closeSuccessAlertAfterDelay();
            }
        }

        function getCsrfToken() {
            return document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute('content');
        }
    </script>

    {{-- AJAX delete from students page --}}
    <script>
        document.addEventListener('click', async function (event) {
            if (!event.target.classList.contains('ajax-delete-btn')) {
                return;
            }

            const button = event.target;
            const studentId = button.dataset.id;
            const deleteUrl = button.dataset.url;
            const modalId = button.dataset.modalId;

            try {
                const response = await fetch(deleteUrl, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': getCsrfToken(),
                        'Accept': 'application/json',
                    },
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Delete failed');
                }

                const modalElement = document.getElementById(modalId);
                const modalInstance = bootstrap.Modal.getInstance(modalElement);

                if (modalInstance) {
                    modalInstance.hide();
                }

                const row = document.getElementById('studentRow' + studentId);

                if (row) {
                    row.remove();
                }

                showAjaxMessage(result.message);

            } catch (error) {
                showAjaxMessage(error.message, 'danger');
            }
        });
    </script>

    {{-- AJAX restore from trash page --}}
    <script>
        document.addEventListener('click', async function (event) {
            if (!event.target.classList.contains('ajax-restore-btn')) {
                return;
            }

            const button = event.target;
            const studentId = button.dataset.id;
            const restoreUrl = button.dataset.url;

            try {
                const response = await fetch(restoreUrl, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': getCsrfToken(),
                        'Accept': 'application/json',
                    },
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Restore failed');
                }

                const row = document.getElementById('trashRow' + studentId);

                if (row) {
                    row.remove();
                }

                showAjaxMessage(result.message);

            } catch (error) {
                showAjaxMessage(error.message, 'danger');
            }
        });
    </script>

    {{-- AJAX force delete from trash page --}}
    <script>
        document.addEventListener('click', async function (event) {
            if (!event.target.classList.contains('ajax-force-delete-btn')) {
                return;
            }

            const button = event.target;
            const studentId = button.dataset.id;
            const deleteUrl = button.dataset.url;
            const modalId = button.dataset.modalId;

            try {
                const response = await fetch(deleteUrl, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': getCsrfToken(),
                        'Accept': 'application/json',
                    },
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Permanent delete failed');
                }

                const modalElement = document.getElementById(modalId);
                const modalInstance = bootstrap.Modal.getInstance(modalElement);

                if (modalInstance) {
                    modalInstance.hide();
                }

                const row = document.getElementById('trashRow' + studentId);

                if (row) {
                    row.remove();
                }

                showAjaxMessage(result.message);

            } catch (error) {
                showAjaxMessage(error.message, 'danger');
            }
        });
    </script>

</body>
</html>