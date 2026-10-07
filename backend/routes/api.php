<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\SectionController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\StudentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API routes
|--------------------------------------------------------------------------
| Grouped by feature, prefixed and named, with every route pointing at a
| controller method. No application logic lives in this file.
*/

// --- Public ---
Route::post('/register', [AuthController::class, 'register'])->name('auth.register');
Route::post('/login', [AuthController::class, 'login'])->name('auth.login');

// --- Signed in ---
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me'])->name('auth.me');
    Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');

    Route::get('/stats', StatsController::class)->name('stats');

    // Reference data used by the Browse filters and the student form selects.
    Route::prefix('academics')->name('academics.')->group(function () {
        Route::apiResource('programs', ProgramController::class)->only(['index', 'show']);

        Route::apiResource('sections', SectionController::class)->only(['index', 'show']);

        // Writing to sections is a registrar job.
        Route::middleware('role:admin')->group(function () {
            Route::apiResource('sections', SectionController::class)
                ->only(['store', 'update', 'destroy']);
        });
    });

    // Student records. index/show are open to any signed-in user; write access
    // is decided per record by StudentPolicy via authorizeResource().
    Route::prefix('registrar')->name('registrar.')->group(function () {
        Route::apiResource('students', StudentController::class);
    });

    // The signed-in user's own filed records.
    Route::prefix('account')->name('account.')->group(function () {
        Route::get('favorites', [FavoriteController::class, 'index'])->name('favorites.index');
        Route::post('favorites', [FavoriteController::class, 'store'])->name('favorites.store');
        Route::delete('favorites/{student}', [FavoriteController::class, 'destroy'])
            ->name('favorites.destroy');
    });
});
