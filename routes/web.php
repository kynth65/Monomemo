<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MemoriesController;
use App\Http\Controllers\ArchiveController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/our-journey', function () {
    return Inertia::render('OurJourney');
})->name('our.journey');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $memories = \App\Models\Memories::with('images')
            ->where('user_id', \Illuminate\Support\Facades\Auth::id())
            ->get();

        $allImages = $memories->flatMap(function ($memory) {
            return $memory->images;
        });

        $shuffledImages = $allImages->shuffle()->values();

        return Inertia::render('dashboard', [
            'images' => $shuffledImages,
        ]);
    })->name('dashboard');

    // Memories routes
    Route::get('/memories', [MemoriesController::class, 'index'])->name('memories.index');
    Route::post('/memories', [MemoriesController::class, 'store'])->name('memories.store');
    Route::get('/memories/create', [MemoriesController::class, 'create'])->name('memories.create');
    Route::get('/memories/{memory}/edit', [MemoriesController::class, 'edit'])->name('memories.edit');
    Route::put('/memories/{memory}', [MemoriesController::class, 'update'])->name('memories.update');
    Route::delete('/memories/{memory}', [MemoriesController::class, 'destroy'])->name('memories.destroy'); // This now archives
    Route::post('/memories/{memory}/archive', [MemoriesController::class, 'archive'])->name('memories.archive');
    Route::post('/memories/check-availability', [MemoriesController::class, 'checkAvailability'])->name('memories.check-availability');

    // Archive routes
    Route::get('/archive', [ArchiveController::class, 'index'])->name('archive.index');
    Route::delete('/archive/{memory}', [ArchiveController::class, 'destroy'])->name('archive.destroy'); // Permanent delete
    Route::post('/archive/{memory}/restore', [ArchiveController::class, 'restore'])->name('archive.restore');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
