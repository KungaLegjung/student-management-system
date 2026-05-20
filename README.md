# Student Management System

A full-stack **Student Management System** built using **Laravel API backend**, **Next.js frontend**, and **PostgreSQL database**.

This project allows users to create, view, update, delete, restore, search, filter, sort, paginate, and export student records.

---

## 1. Project Overview

This project has two main parts:

```txt
student-management-system
├── backend    -> Laravel API backend
└── frontend   -> Next.js frontend
```

The **Laravel backend** handles API routes, database operations, validation, and soft delete.

The **Next.js frontend** displays the user interface and connects to Laravel API using `fetch()`.

---

## 2. Technologies Used

### Backend

- Laravel
- PHP
- PostgreSQL
- Eloquent ORM
- Laravel Migrations
- API Routes
- Soft Deletes

### Frontend

- Next.js
- React
- TypeScript
- CSS
- Fetch API

### Database

- PostgreSQL

---

## 3. Main Features

### Student Management

- Add new student
- View student details
- Edit student information
- Delete student using soft delete
- Restore deleted student
- Permanently delete student

### Search and Filter

Users can search by:

- Name
- Email
- Phone
- Course

Users can filter by course:

- MCA
- BCA
- MBA
- BBA
- B.Tech

### Sorting

Students can be sorted by:

- ID
- Student name
- Course
- Created date
- Deleted date

### Pagination

Student records are shown page by page.

Available options:

- 5 students per page
- 10 students per page
- 20 students per page

### Export

Student records can be exported as CSV files.

- Export active students
- Export trash students
- Export filtered students

---

## 4. Folder Structure

```txt
student-management-system
├── backend
│   ├── app
│   │   ├── Http
│   │   │   └── Controllers
│   │   │       └── Api
│   │   │           └── StudentController.php
│   │   └── Models
│   │       └── Student.php
│   ├── database
│   │   └── migrations
│   ├── routes
│   │   └── api.php
│   └── .env
│
└── frontend
    ├── app
    │   ├── api.js
    │   ├── page.tsx
    │   └── student.css
    └── package.json
```

---

## 5. Backend Setup

Go to the backend folder:

```bash
cd backend
```

Install PHP dependencies:

```bash
composer install
```

Create `.env` file:

```bash
cp .env.example .env
```

Generate Laravel app key:

```bash
php artisan key:generate
```

---

## 6. PostgreSQL Database Setup

Open PostgreSQL:

```bash
psql postgres
```

Create database:

```sql
CREATE DATABASE student_management_system;
```

Exit PostgreSQL:

```sql
\q
```

Update the backend `.env` file:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=student_management_system
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

Run migrations:

```bash
php artisan migrate
```

---

## 7. Run Laravel Backend

Inside the backend folder:

```bash
php artisan serve
```

Backend will run at:

```txt
http://127.0.0.1:8000
```

API base URL:

```txt
http://127.0.0.1:8000/api
```

---

## 8. Frontend Setup

Go to the frontend folder:

```bash
cd frontend
```

Install Node dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev -- --webpack
```

Frontend will run at:

```txt
http://localhost:3000
```

---

## 9. API Connection

The frontend connects to the Laravel API using this base URL:

```js
const API_BASE_URL = 'http://127.0.0.1:8000/api';
```

This code is inside:

```txt
frontend/app/api.js
```

---

## 10. API Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | Get active students |
| POST | `/api/students` | Create student |
| GET | `/api/students/{id}` | View single student |
| PUT | `/api/students/{id}` | Update student |
| DELETE | `/api/students/{id}` | Soft delete student |
| GET | `/api/students-trash` | Get deleted students |
| PATCH | `/api/students/{id}/restore` | Restore deleted student |
| DELETE | `/api/students/{id}/force-delete` | Permanently delete student |

---

## 11. Laravel Student Model

The `Student` model uses Laravel soft delete.

```php
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'course',
    ];
}
```

---

## 12. Student Table Columns

| Column | Description |
|---|---|
| id | Student ID |
| name | Student name |
| email | Student email |
| phone | Student phone number |
| course | Student course |
| created_at | Record created time |
| updated_at | Record updated time |
| deleted_at | Soft delete time |

---

## 13. Soft Delete Explanation

Soft delete means the record is not removed permanently from the database.

When a student is deleted:

```txt
deleted_at column gets date and time
```

The student disappears from the active list and appears in trash.

The student can be restored later.

Permanent delete removes the record completely from the database.

---

## 14. Useful Commands

Clear Laravel cache:

```bash
php artisan optimize:clear
php artisan view:clear
```

Run migration fresh:

```bash
php artisan migrate:fresh
```

Check Laravel routes:

```bash
php artisan route:list
```

Run frontend:

```bash
npm run dev -- --webpack
```

---

## 15. How Frontend and Backend Connect

The frontend sends HTTP requests to Laravel API.

Example:

```js
fetch('http://127.0.0.1:8000/api/students')
```

Laravel receives the request in `routes/api.php`.

Then Laravel calls `StudentController`.

The controller talks to the `Student` model.

The model talks to the PostgreSQL database.

Flow:

```txt
Next.js Frontend
      ↓
Fetch API
      ↓
Laravel API Route
      ↓
StudentController
      ↓
Student Model
      ↓
PostgreSQL Database
```

---

## 16. Project Learning Outcome

From this project, we learned:

- How to create Laravel API routes
- How to connect Laravel with PostgreSQL
- How to use migrations
- How to use Eloquent model
- How to use soft delete
- How to connect Next.js frontend with Laravel backend
- How to use React state
- How to create modals
- How to search and filter data
- How to sort table data
- How to paginate data
- How to export data as CSV

---

## 17. Future Enhancements

Possible future improvements:

- Login and authentication
- Role-based access
- Backend pagination
- Backend search and filter
- Image upload for student profile
- Dashboard charts
- Export to PDF
- Import students from CSV
- Deployment
