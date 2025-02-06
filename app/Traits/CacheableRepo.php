<?php

namespace App\Traits;

use App\Services\RepoCache;


trait CacheableRepo {
  public static function cached($method, ...$args) {
    return RepoCache::cache(static::class, $method, $args);
  }

  public static function fresh($method, ...$args) {
    return RepoCache::fresh(static::class, $method, $args);
  }
}