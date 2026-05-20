<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;

Route::get('/', function () {
    return redirect()->route('students.index');
});

// Trash routes
Route::get('/students-trash', [StudentController::class, 'trash'])
    ->name('students.trash');

Route::post('/students/{id}/restore', [StudentController::class, 'restore'])
    ->name('students.restore');

Route::delete('/students/{id}/force-delete', [StudentController::class, 'forceDelete'])
    ->name('students.forceDelete');

// Student CRUD routes
Route::resource('students', StudentController::class);