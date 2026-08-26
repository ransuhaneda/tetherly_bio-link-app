<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\UsernameController;
use App\Http\Controllers\Api\V1\ProfileController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/usernames/{username}/availability', [UsernameController::class, 'availability'])
        ->where('username', '[A-Za-z0-9_-]+');

    Route::middleware('web')->prefix('auth')->group(function (): void {
        Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
        Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
        Route::middleware('auth:sanctum')->group(function (): void {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
        });
    });
    Route::middleware(['web','auth:sanctum'])->group(function (): void {
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::patch('/profile', [ProfileController::class, 'update']);
        Route::post('/profile/avatar', [ProfileController::class, 'avatar']);
        Route::put('/profile/avatar', [ProfileController::class, 'avatar']);
        Route::delete('/profile/avatar', [ProfileController::class, 'deleteAvatar']);
    });
});
