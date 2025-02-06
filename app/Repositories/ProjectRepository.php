<?php

namespace App\Repositories;

use App\Models\Project;
use App\Services\WithCache;
use App\Traits\CacheableRepo;

class ProjectRepository {

  use CacheableRepo;

  #[WithCache('projects.all', 30)]
  public static function index() {
    sleep(4);
    return Project::all();
  }

  public static function find($id) {
    return Project::find($id);
  }

}