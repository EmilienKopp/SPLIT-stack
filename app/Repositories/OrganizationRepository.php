<?php 

namespace App\Repositories;

use App\Traits\CacheableRepo;
use App\Services\WithCache;
use App\Models\Organization;

const DEFAULT_TTL = 60;

class OrganizationRepository {
  use CacheableRepo;

  #[WithCache('Organization.all', DEFAULT_TTL)]
  public static function index() {
    return Organization::all();
  }

  #[WithCache('Organization.{id}', DEFAULT_TTL)]
  public static function find($id) {
    return Organization::find($id);
  }
}