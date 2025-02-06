<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Repositories\ProjectRepository;
use Illuminate\Support\Facades\Log;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = ProjectRepository::cached('index');

        return Inertia::render('Project/Index', [
            'projects' => $projects,
        ]);
    }
}
