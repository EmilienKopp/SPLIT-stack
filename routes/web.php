<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\MatchingGameController;
use App\Models\Project;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $projects = Project::all();
    return Inertia::render('Dashboard', compact('projects'));
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/test-broadcast', function () {
    $project = \App\Models\Project::first();
    event(new \App\Events\TranslucidCreated($project));
    return 'Broadcast attempted';
});

Route::get('/test-reverb-connection', function () {
    $host = env('REVERB_HOST', '127.0.0.1');
    $port = env('REVERB_PORT', 8080);
    $socket = @fsockopen($host, $port, $errno, $errstr, 5);
    if (!$socket) {
        return "Failed to connect to Reverb: $errstr ($errno)";
    }
    fclose($socket);
    return "Successfully connected to Reverb at $host:$port";
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('organization', OrganizationController::class);
    Route::resource('project', ProjectController::class);

    Route::group(['prefix' => 'project/{project}'], function () {
        Route::post('metadata', [ProjectController::class, 'addMedata'])->name('project.metadata');
    });

    Route::group(['prefix' => 'game'], function () {
        Route::get('matching', [MatchingGameController::class, 'index'])->name('game.index');
        Route::get('matching/create', [MatchingGameController::class, 'create'])->name('game.create');
        Route::get('matching/{game}', [MatchingGameController::class, 'play'])->name('game.play');
        Route::post('matching', [MatchingGameController::class, 'store'])->name('game.store');
        Route::delete('matching/{game}', [MatchingGameController::class, 'destroy'])->name('game.destroy');
        Route::patch('matching/{game}', [MatchingGameController::class, 'update'])->name('game.update');
        Route::post('matching/{game}/results', [MatchingGameController::class, 'setScore'])->name('game.setScore');
    });
});

require __DIR__ . '/auth.php';
