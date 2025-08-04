<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Memories;
use App\Services\CloudinaryService;
use Illuminate\Support\Facades\Auth;

class ArchiveController extends Controller
{
    private $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }

    public function index()
    {
        $archivedMemories = Memories::with('images')
            ->archived()
            ->where('user_id', Auth::id())
            ->orderBy('archived_at', 'desc')
            ->get();

        return Inertia::render('Memories/Archive', [
            'archivedMemories' => $archivedMemories
        ]);
    }

    // Permanently delete memory from archive
    public function destroy(Memories $memory)
    {
        // Ensure user can only delete their own archived memories
        if ($memory->user_id !== Auth::id() || !$memory->isArchived()) {
            abort(403);
        }

        // Delete images from Cloudinary
        foreach ($memory->images as $image) {
            $this->cloudinaryService->deleteImage($image->image_public_id);
        }

        // Permanently delete the memory
        $memory->delete();

        return redirect()->route('archive.index')->with('message', 'Album permanently deleted from archive!');
    }

    // Restore memory from archive
    public function restore(Memories $memory)
    {
        // Ensure user can only restore their own archived memories
        if ($memory->user_id !== Auth::id() || !$memory->isArchived()) {
            abort(403);
        }

        // Check if the month/year combination is now available (in case they created a new one)
        $exists = Memories::existsForMonthYear(
            Auth::id(),
            $memory->memory_month,
            $memory->memory_year
        );

        if ($exists) {
            return redirect()->route('archive.index')->with(
                'error',
                "Cannot restore: You already have an active album for {$memory->memory_month} {$memory->memory_year}."
            );
        }

        $memory->restore();

        return redirect()->route('archive.index')->with(
            'message',
            "Album restored successfully! You can now find it in your active memories."
        );
    }
}
