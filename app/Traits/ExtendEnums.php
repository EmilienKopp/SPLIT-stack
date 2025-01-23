<?php

namespace App\Traits;

use Illuminate\Support\Arr;
use Illuminate\Support\Str;

trait ExtendEnums
{
  /**
   * Get the enum values.
   *
   * @return array
   */
  public static function values(): array
  {
    return array_column(self::cases(), 'value');
  }

  public static function collect(): \Illuminate\Support\Collection
  {
    return collect(array_column(self::cases(), 'value'));
  }

  public static function implode(string $glue = ','): string
  {
    return implode($glue, self::values());
  }

  public static function toSelectOptions(): \Illuminate\Support\Collection
  {
    return self::collect()->map( function ($obj) {
      $readable = self::toReadable($obj);
      return [
        'value' => $obj,
        'label' => $readable,
        'name' => $readable,
      ];
    });
  }

  /**
   * Get the enum keys.
   *
   * @return array
   */
  public static function keys(): array
  {
    return array_keys(self::cases());
  }

  public static function readable(): array
  {
    return array_map(function ($key) {
      return self::toReadable($key);
    }, self::keys());
  }
  
  public static function random(): string
  {
    return Arr::random(self::values());
  }

  private static function toReadable($key): string
  {
    return Str::title(Str::replace('_', ' ', $key));
  }
}
