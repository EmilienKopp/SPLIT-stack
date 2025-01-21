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

    protected $basePath = 'resources/js/Lib/domain';

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

        $imports = $this->generateContextImports($model, $roles);
        
        $strategySwitch = $this->generateStrategySwitch($roles, $model);

        $template = <<<TS
$imports

export class {$modelName}TableContext implements TableContext<$modelName> {
  strategy: TableStrategy<$modelName>;

  constructor(role: string) {
    this.strategy = this.getStrategyForRole(role);
  }

  getStrategyForRole(role: string): TableStrategy<$modelName> {
    switch (role) {
$strategySwitch
      default:
        return new {$roles[0]}{$modelName}TableStrategy();
    }
  }
}
TS;

        file_put_contents($contextPath, $template);
        $this->info("Generated context at: $contextPath");
    }

    protected function generateStrategy($model, $role, $domainPath)
    {
        $modelName = Str::studly($model);
        $roleName = Str::studly($role);
        $routeModel = Str::kebab($model);
        $strategyPath = $domainPath . '/strategies/' . Str::camel($role) . Str::studly($model) . 'Strategy.ts';

        $template = <<<TS
import { TableAction, TableStrategy } from "\$types/components/Table";
import { $modelName } from "\$models";
import { date } from "\$lib/utils/formatting";

export class {$roleName}{$modelName}TableStrategy implements TableStrategy<$modelName> {
  getHeaders() {
    return [
      { label: "Name", key: "name" },
      { label: "Created At", key: "created_at", formatter: date },
      { label: "Updated At", key: "updated_at", formatter: date },
    ];
  }

  getActions(): TableAction<$modelName>[] {
    return [
      { 
        label: 'View', 
        href: (row: $modelName) => route('$routeModel.show', row.id)
      },
      { 
        label: 'Edit', 
        href: (row: $modelName) => route('$routeModel.edit', row.id)
      }
    ];
  }
}
TS;

        file_put_contents($strategyPath, $template);
        $this->info("Generated strategy at: $strategyPath");
    }

    protected function generateContextImports($model, $roles)
    {
        $modelName = Str::studly($model);
        $imports = [];

        // Add strategy imports
        foreach ($roles as $role) {
            $roleName = Str::studly($role);
            $strategyName = "{$roleName}{$modelName}TableStrategy";
            $imports[] = "import { $strategyName } from './strategies/" . Str::camel($role) . Str::studly($model) . "Strategy';";
        }

        // Add other necessary imports
        $imports[] = "import { $modelName } from '\$models';";
        $imports[] = "import { TableContext } from '../common/context';";
        $imports[] = "import { TableStrategy } from '\$types/components/Table';";

        return implode("\n", $imports);
    }

    protected function generateStrategySwitch($roles, $model)
    {
        $modelName = Str::studly($model);
        $cases = [];

        foreach ($roles as $role) {
            $roleName = Str::studly($role);
            $cases[] = <<<TS
      case '$role':
        return new {$roleName}{$modelName}TableStrategy();
TS;
        }

        return implode("\n", $cases);
    }
}