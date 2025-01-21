<?php

namespace App\Traits;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

trait SeedsFromSql
{

  /**
   * Runs a SQL file in order to seed the table.
   * @warning The SQL file must be named after the table name (plural) 
   * and must be located in the database/seeders/SQL directory.
   * This assumes the Laravel naming conventions for table, models and seeder classes are being followed.
   * @return void
   */
  public function fromSQL(string $tableName = null): void
  {
    $className = class_basename(get_called_class());
    $modelName = Str::snake(str_replace('Seeder', '', $className));
    $tableName ??= Str::plural($modelName);


    $basePath = database_path("/seeders/SQL");
    $sqlPath = "{$basePath}/{$tableName}.sql";

    if (!file_exists($sqlPath)) {
      $this->command->error('SQL file not found at: ' . $sqlPath);
      return;
    }

    try {
      $sql = file_get_contents($sqlPath);
      DB::unprepared($sql);

      $this->command->info('SQL file seeded successfully.');
    } catch (\Exception $e) {
      $this->command->error('Error seeding SQL file: ' . $e->getMessage());
      Log::error('Error seeding SQL file: ' . $e->getMessage());
    }
  }
}
