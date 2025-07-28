<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MemoriesController extends Controller
{
    public function index()
    {
        return Inertia::render('Memories/Index', []);
    }
}
