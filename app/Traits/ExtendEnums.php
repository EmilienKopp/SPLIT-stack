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
}
