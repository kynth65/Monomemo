<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Memories;
use App\Models\Image;
use App\Services\CloudinaryService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

class MemoriesController extends Controller
{
    private $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }

    public function index()
    {
        $memories = Memories::with('images')
            ->active() // Only get non-archived memories
            ->where('user_id', Auth::id())
            ->orderBy('memory_year', 'desc')
            ->orderBy('memory_month', 'desc')
            ->get();

        return Inertia::render('Memories/index', compact('memories'));
    }

    public function create()
    {
        // Get current year and available months for current year
        $currentYear = date('Y');
        $currentMonth = date('F');

        // Get existing active memories for current user to determine which months are taken
        $existingMemories = Memories::active()
            ->where('user_id', Auth::id())
            ->select('memory_month', 'memory_year')
            ->get()
            ->groupBy('memory_year');

        return Inertia::render('Memories/Create', [
            'currentYear' => $currentYear,
            'currentMonth' => $currentMonth,
            'existingMemories' => $existingMemories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'memory_title' => 'required|string|max:255',
            'memory_description' => 'required|string',
            'memory_month' => 'required|string|max:255',
            'memory_year' => 'required|integer|min:2020|max:' . (date('Y') + 1),
            'images' => 'required|array|min:5|max:10',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240',
        ]);

        // Check if active memory already exists for this month/year
        $existingMemory = Memories::existsForMonthYear(
            Auth::id(),
            $request->memory_month,
            $request->memory_year
        );

        if ($existingMemory) {
            throw ValidationException::withMessages([
                'memory_month' => "You already have an active memory album for {$request->memory_month} {$request->memory_year}. Please delete the existing album first or choose a different month/year.",
            ]);
        }

        // Create the memory
        $memory = Memories::create([
            'user_id' => Auth::id(),
            'memory_title' => $request->memory_title,
            'memory_description' => $request->memory_description,
            'memory_month' => $request->memory_month,
            'memory_year' => $request->memory_year,
        ]);

        // Upload each image to Cloudinary and save to database
        foreach ($request->file('images') as $index => $imageFile) {
            $imageData = $this->cloudinaryService->uploadImage($imageFile);

            Image::create([
                'memory_id' => $memory->id,
                'image_url' => $imageData['url'],
                'image_public_id' => $imageData['public_id'],
                'order' => $index + 1,
            ]);
        }

        return redirect()->route('memories.index')->with('message', 'Album created successfully for ' . $request->memory_month . ' ' . $request->memory_year . '!');
    }

    public function edit(Memories $memory)
    {
        // Ensure user can only edit their own active memories
        if ($memory->user_id !== Auth::id() || $memory->isArchived()) {
            abort(403);
        }

        return Inertia::render('Memories/Edit', [
            'memory' => $memory->load('images'),
        ]);
    }

    public function update(Request $request, Memories $memory)
    {
        // Ensure user can only update their own active memories
        if ($memory->user_id !== Auth::id() || $memory->isArchived()) {
            abort(403);
        }

        $request->validate([
            'memory_title' => 'required|string|max:255',
            'memory_description' => 'required|string',
            'deleted_image_ids' => 'sometimes|string', // JSON string
        ]);

        DB::transaction(function () use ($request, $memory) {
            // Update basic memory info (captions)
            $memory->update([
                'memory_title' => $request->memory_title,
                'memory_description' => $request->memory_description,
            ]);

            // Handle deleted images
            if ($request->has('deleted_image_ids') && $request->deleted_image_ids) {
                $deletedIds = json_decode($request->deleted_image_ids, true);
                if (is_array($deletedIds) && !empty($deletedIds)) {
                    $imagesToDelete = Image::where('memory_id', $memory->id)
                        ->whereIn('id', $deletedIds)
                        ->get();

                    foreach ($imagesToDelete as $image) {
                        // Delete from Cloudinary
                        $this->cloudinaryService->deleteImage($image->image_public_id);
                        // Delete from database
                        $image->delete();
                    }
                }
            }

            // Validate final image count
            $finalImageCount = Image::where('memory_id', $memory->id)->count();
            if ($finalImageCount < 5 || $finalImageCount > 10) {
                throw ValidationException::withMessages([
                    'images' => 'Album must have between 5-10 images.',
                ]);
            }
        });

        return redirect()->route('memories.index')->with('message', 'Album updated successfully!');
    }

    // Archive memory (soft delete)
    public function archive(Memories $memory)
    {
        // Ensure user can only archive their own active memories
        if ($memory->user_id !== Auth::id() || $memory->isArchived()) {
            abort(403);
        }

        $memory->archive();

        return redirect()->route('memories.index')->with('message', 'Album moved to archive successfully!');
    }

    // Keep destroy for backward compatibility or other uses
    public function destroy(Memories $memory)
    {
        return $this->archive($memory);
    }

    // Check if month/year combination is available (only for active memories)
    public function checkAvailability(Request $request)
    {
        $request->validate([
            'month' => 'required|string',
            'year' => 'required|integer',
        ]);

        $exists = Memories::existsForMonthYear(
            Auth::id(),
            $request->month,
            $request->year
        );

        return response()->json(['available' => !$exists]);
    }
}
