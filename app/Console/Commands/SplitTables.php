<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class SplitTables extends Command
{
  protected $signature = 'split:tables 
                          {model : The name of the model}
                          {roles* : The roles to generate strategies for}';

  protected $description = 'Create a domain context and strategies for a model';

  protected $basePath = 'resources/js/Lib/domains';
  protected $interfacesPath = 'resources/js/types/domains';

  public function handle()
  {
    $model = $this->argument('model');
    $roles = $this->argument('roles');

    // Create domain directory
    $domainPath = $this->createDomainDirectory($model);

    // Generate context
    $this->generateContext($model, $roles, $domainPath);

    // Generate strategies
    foreach ($roles as $role) {
      $this->generateStrategy($model, $role, $domainPath);
    }

    $this->info('Domain context and strategies generated successfully!');
  }

  protected function createDomainDirectory($model)
  {
    $domainPath = base_path($this->basePath . '/' . Str::ucfirst($model));
    $strategiesPath = $domainPath . '/strategies';

    if (!is_dir($domainPath)) {
      mkdir($domainPath, 0755, true);
    }

    if (!is_dir($strategiesPath)) {
      mkdir($strategiesPath, 0755, true);
    }

    return $domainPath;
  }

  protected function generateContext($model, $roles, $domainPath)
  {
    $modelName = Str::studly($model);
    $contextPath = $domainPath . '/context.ts';

    $stub = $this->getContextStub();

    $content = str_replace(
      [
        '{{ strategy_imports }}',
        '{{ model }}',
        '{{ strategy_cases }}'
      ],
      [
        $this->generateStrategyImports($modelName, $roles),
        $modelName,
        $this->generateStrategyCases($modelName, $roles)
      ],
      $stub
    );

    if (!file_exists($contextPath)) {
      file_put_contents($contextPath, $content);
      $this->info("Generated context at: $contextPath");
    } else {
      $this->warn("Context already exists at: $contextPath");
    }
  }

  protected function generateStrategy($model, $role, $domainPath)
  {
    $modelName = Str::studly($model);
    $roleName = Str::studly($role);
    $routeModel = Str::kebab($model);
    $strategyPath = $domainPath . '/strategies/' . Str::camel($role) . $modelName . 'TableStrategy.ts';

    $stub = $this->getStrategyStub();

    $content = str_replace(
      [
        '{{ model }}',
        '{{ role }}',
        '{{ route }}'
      ],
      [
        $modelName,
        $roleName,
        $routeModel
      ],
      $stub
    );

    if (!file_exists($strategyPath)) {
      file_put_contents($strategyPath, $content);
      $this->info("Generated strategy at: $strategyPath");
    } else {
      $this->warn("Strategy already exists at: $strategyPath");
    }
  }

  

  protected function generateStrategyImports($model, $roles): string
  {
    $imports = [];
    foreach ($roles as $role) {
      $roleName = Str::studly($role);
      $imports[] = "import { {$roleName}{$model}TableStrategy } from './strategies/" . Str::camel($role) . "{$model}TableStrategy';";
    }
    return implode("\n", $imports);
  }

  protected function generateStrategyCases($model, $roles): string
  {
    $cases = [];
    foreach ($roles as $role) {
      $roleName = Str::studly($role);
      $cases[] = <<<TS
      case '$role':
        return new {$roleName}{$model}TableStrategy();
TS;
    }
    return implode("\n", $cases);
  }

  protected function getContextStub(): string
  {
    return file_get_contents(base_path('/stubs/context.stub'));
  }

  protected function getStrategyStub(): string
  {
    return file_get_contents(base_path('/stubs/strategy.stub'));
  }
}
