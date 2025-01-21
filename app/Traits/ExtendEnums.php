<?php

namespace App\Traits;

use Illuminate\Support\Arr;

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

  /**
   * Get the enum keys.
   *
   * @return array
   */
  public static function keys(): array
  {
    return array_keys(self::cases());
  }

  /**
   * Get the enum key-value pairs. (Alias of `cases()`)
   *
   * @return array
   */
  public static function entries(): array
  {
    return self::cases();
  }

  public static function random(): string
  {
    return Arr::random(self::values());
  }
}
