<?php

namespace App\Repositories;

use App\Models\Project;
use App\Services\WithCache;
use App\Traits\CacheableRepo;

class ProjectRepository {

  use CacheableRepo;

  #[WithCache('projects.all', 60)]
  public static function index() {
    sleep(2);
    return Project::all();
  }

  #[WithCache('projects.{id}', 60)]
  public static function find($id) {
    return Project::find($id);
  }

}