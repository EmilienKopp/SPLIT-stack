<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Repositories\ProjectRepository;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = ProjectRepository::cache('index');

        return Inertia::render('Project/Index', [
            'projects' => $projects,
        ]);
    }

    public function show($id)
    {
        $project = ProjectRepository::find($id);

        return Inertia::render('Project/Show', [
            'project' => $project,
        ]);
    }

    public function addMedata(Project $project, Request $request)
    {
        $project->setMetadata($request->all());
        $project->save();

        return back();
    }
}
