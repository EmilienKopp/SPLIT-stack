<?php

namespace Database\Seeders;

use App\Enums\ProjectRole;
use App\Utils\Formatters;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = \App\Models\Project::all();

        $projects->each(function ($project) {
            $projectOrganization = $project->organization;
            $orgUsers = $projectOrganization->users;

            $selectedUsers = $orgUsers->random(rand(3, $orgUsers->count()));

            $pivotData = $selectedUsers->map(function ($user) {
                $roles = collect(ProjectRole::values())->random(rand(1, 3))->toArray();
                
                return [
                    'user_id' => $user->id,
                    'roles' => $user->id == 1 ? [ProjectRole::DEV] : $roles,
                ];
            });
            
            $project->users()->attach($pivotData->toArray());

        });
    }
}
