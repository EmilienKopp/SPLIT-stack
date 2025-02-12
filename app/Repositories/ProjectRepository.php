<?php

namespace App\Repositories;

use App\Models\Project;
use Splitstack\Stashable\Traits\Stashable;
use Splitstack\Stashable\Attributes\WithCache;


class ProjectRepository {

  use Stashable;

  #[WithCache(key: 'projects.all', ttl: 10)]
  public static function index() {
    sleep(4);
    return Project::all();
  }

  public static function find($id) {
    return Project::find($id);
  }

}