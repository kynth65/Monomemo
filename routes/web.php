<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MemoriesController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('/memories', [MemoriesController::class, 'index'])->name('memories.index');
    Route::get('/memories/create', [MemoriesController::class, 'create'])->name('memories.create');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
