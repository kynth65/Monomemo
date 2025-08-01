<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Termwind\Components\Dd;
use App\Models\Memories;
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
        $memories = Memories::all();

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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $imageData = null;
        if ($request->hasFile('image')) {
            $imageData = $this->cloudinaryService->uploadImage($request->file('image'));
        }

        Memories::create([
            'memory_title' => $request->memory_title,
            'memory_description' => $request->memory_description,
            'memory_month' => $request->memory_month,
            'image_url' => $imageData['url'] ?? null,
            'image_public_id' => $imageData['public_id'] ?? null,
        ]);

        return redirect()->route('memories.index')->with('message', 'Memory created successfully!');
    }
}
