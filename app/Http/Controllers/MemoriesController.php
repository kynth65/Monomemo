<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Termwind\Components\Dd;

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
        dd($request);
    }
}
