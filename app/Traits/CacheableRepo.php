<?php

namespace App\Traits;

use App\Services\Cacher;
use App\Services\WithCache;
use Illuminate\Support\Facades\Cache;
use Attribute, ReflectionClass;


trait CacheableRepo {
  public static function cached($method, ...$args) {
    return Cacher::cache(static::class, $method, $args);
  }

  public static function fresh($method, ...$args) {
    return Cacher::fresh(static::class, $method, $args);
  }
}