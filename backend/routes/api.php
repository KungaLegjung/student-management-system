<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StudentApiController;
use App\Http\Controllers\Api\TeacherAuthController;

Route::post('/teacher/login', [TeacherAuthController::class, 'login']);
Route::get('/students-trash', [StudentApiController::class, 'trash']);
Route::post('/students/{id}/restore', [StudentApiController::class, 'restore']);
Route::delete('/students/{id}/force-delete', [StudentApiController::class, 'forceDelete']);
Route::apiResource('students', StudentApiController::class);
