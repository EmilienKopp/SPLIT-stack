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

    public function create()
    {
        return Inertia::render('Project/Create');
    }

    public function store() 
    {
        Project::create(request()->all());

        // return redirect()->back();
    }

    public function addMedata(Project $project, Request $request)
    {
        $project->setMetadata($request->all());
        $project->save();

        return back();
    }

    public function edit(Project $project)
    {
        return Inertia::render('Project/Edit', [
            'project' => $project,
        ]);
    }

    public function update(Project $project)
    {
        $project->update(request()->all());

        // return redirect()->back();
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return redirect()->back();
    }
}
