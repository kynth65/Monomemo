<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Memories;
use App\Models\Image;
use App\Services\CloudinaryService;

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
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Memories/Index', compact('memories'));
    }

    public function create()
    {
        return Inertia::render('Memories/Create', []);
    }

    public function store(Request $request)
    {
        $request->validate([
            'memory_title' => 'required|string|max:255',
            'memory_description' => 'required|string',
            'memory_month' => 'required|string|max:255',
            'images' => 'required|array|min:5|max:10', // Require 5-10 images
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240',
        ]);

        // Create the memory first
        $memory = Memories::create([
            'memory_title' => $request->memory_title,
            'memory_description' => $request->memory_description,
            'memory_month' => $request->memory_month,
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

        return redirect()->route('memories.index')->with('message', 'Album created successfully with ' . count($request->file('images')) . ' images!');
    }
}
