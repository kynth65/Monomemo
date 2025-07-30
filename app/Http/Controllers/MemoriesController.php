<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Termwind\Components\Dd;
use App\Models\Memories;

class MemoriesController extends Controller
{
    public function index()
    {
        return Inertia::render('Memories/Index', []);
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
        ]);

        Memories::create($request->all());

        return redirect()->route('memories.index');
    }
}
