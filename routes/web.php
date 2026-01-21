<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TrainingController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

//Route::get('/', function () {
//    return Inertia::render('Welcome', [
//        'canLogin' => Route::has('login'),
//        'canRegister' => Route::has('register'),
//        'laravelVersion' => Application::VERSION,
//        'phpVersion' => PHP_VERSION,
//    ]);
//});
// Disable registration routes
Route::get('register', function () {
    return redirect()->route('login');
})->name('register');

Route::post('register', function () {
    return redirect()->route('login');
});
Route::get('/', function () {
    return redirect()->route('login');
});

//Route::get('/dashboard', function () {
//    return Inertia::render('Dashboard');
//})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::patch('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin routes
    Route::name('admin.')->group(function () {
        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Users
        Route::resource('users', UserController::class)->except(['show']);

        // Employees
        Route::resource('employees', EmployeeController::class);
        Route::post('/employees/{employee}/assign-training', [EmployeeController::class, 'assignTraining'])
            ->name('employees.assign-training');
        Route::delete('/employees/{employee}/remove-training/{training}', [EmployeeController::class, 'removeTraining'])
            ->name('employees.remove-training');

        // Trainings
        Route::resource('trainings', TrainingController::class);
        Route::post('/trainings/{training}/assign-employees', [TrainingController::class, 'assignEmployees'])
            ->name('trainings.assign-employees');
        Route::put('/trainings/{training}/update-status/{employee}', [TrainingController::class, 'updateEmployeeStatus'])
            ->name('trainings.update-status');
        Route::delete('/trainings/{training}/remove-employee/{employee}', [TrainingController::class, 'removeEmployee'])
            ->name('trainings.remove-employee');

        // Reports Routes
        Route::prefix('reports')->name('reports.')->group(function () {
            Route::get('/', [ReportController::class, 'index'])->name('index');
            Route::get('/employee/{employee}', [ReportController::class, 'show'])->name('show');
            Route::get('/export/list', [ReportController::class, 'exportList'])->name('export-list');
            Route::get('/export/employee/{employee}', [ReportController::class, 'exportEmployee'])->name('export-employee');
        });
    });
});





require __DIR__.'/auth.php';
