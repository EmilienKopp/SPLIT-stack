<?php 

namespace App\Repositories;

use App\Traits\CacheableRepo;
use App\Services\WithCache;
use App\Models\__NAME__;

const DEFAULT_TTL = "__DEFAULT_TTL__";


class __NAME__Repository {
  use CacheableRepo;

  #[WithCache('__NAME__.all', DEFAULT_TTL)]
  public static function index() {
    return __NAME__::all();
  }

  #[WithCache('__NAME__.{id}', DEFAULT_TTL)]
  public static function find($id) {
    return __NAME__::find($id);
  }
}