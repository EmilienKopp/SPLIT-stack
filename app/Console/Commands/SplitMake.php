<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class SplitMake extends Command
{
    protected $signature = 'split:make
                            {name? : Entity name (StudlyCase). Triggers backend domain scaffolding.}
                            {--model : Create an Eloquent model}
                            {--migration : Create a database migration}
                            {--repository : Create a repository interface and implementation}
                            {--actions : Create Create, Update, and Delete actions}
                            {--queries : Create Index and Show queries}
                            {--all : Create all backend artifacts}';

    protected $description = 'Generate domain entities, backend scaffolding, or frontend files';

    public function handle(): void
    {
        $name = $this->argument('name');

        if ($name) {
            $this->handleBackend(Str::studly($name));
        } else {
            $this->handleFrontend();
        }
    }

    // ─── Backend ────────────────────────────────────────────────────────────────

    private function handleBackend(string $name): void
    {
        $this->generateEntity($name);

        $all = $this->option('all');

        if ($all || $this->option('model') || $this->confirm("Create an Eloquent model for {$name}?")) {
            $this->generateModel($name);
        }

        if ($all || $this->option('migration') || $this->confirm("Create a migration for {$name}?")) {
            $this->generateMigration($name);
        }

        if ($all || $this->option('repository') || $this->confirm("Create a repository interface and implementation for {$name}?")) {
            $this->generateRepositoryInterface($name);
            $this->generateRepository($name);
        }

        if ($all || $this->option('actions') || $this->confirm("Create CRUD actions (Create, Update, Delete) for {$name}?")) {
            $this->generateAction($name, 'create');
            $this->generateAction($name, 'update');
            $this->generateAction($name, 'delete');
        }

        if ($all || $this->option('queries') || $this->confirm("Create CRUD queries (Index, Show) for {$name}?")) {
            $this->generateQuery($name, 'index');
            $this->generateQuery($name, 'show');
        }
    }

    private function generateEntity(string $name): void
    {
        $path = app_path("Domain/Entities/{$name}.php");

        if (File::exists($path)) {
            $this->warn("Entity already exists: {$path}");
            return;
        }

        File::ensureDirectoryExists(dirname($path));
        File::put($path, $this->renderStub('entity', ['class' => $name]));
        $this->info("Entity created: {$path}");
    }

    private function generateModel(string $name): void
    {
        Artisan::call('make:model', ['name' => $name], $this->output);
    }

    private function generateMigration(string $name): void
    {
        $table = Str::snake(Str::plural($name));
        Artisan::call('make:migration', ['name' => "create_{$table}_table", '--create' => $table], $this->output);
    }

    private function generateRepositoryInterface(string $name): void
    {
        $path = app_path("Contracts/Repositories/{$name}RepositoryInterface.php");

        if (File::exists($path)) {
            $this->warn("Repository interface already exists: {$path}");
            return;
        }

        File::ensureDirectoryExists(dirname($path));
        File::put($path, $this->renderStub('repository-interface', ['class' => $name]));
        $this->info("Repository interface created: {$path}");
    }

    private function generateRepository(string $name): void
    {
        $path = app_path("Repositories/{$name}Repository.php");

        if (File::exists($path)) {
            $this->warn("Repository already exists: {$path}");
            return;
        }

        File::ensureDirectoryExists(dirname($path));
        File::put($path, $this->renderStub('repository', ['class' => $name]));
        $this->info("Repository created: {$path}");
    }

    private function generateAction(string $name, string $type): void
    {
        $classMap = [
            'create' => "Create{$name}",
            'update' => "Update{$name}",
            'delete' => "Delete{$name}",
        ];

        $className = $classMap[$type];
        $path = app_path("UseCases/{$name}/{$className}.php");

        if (File::exists($path)) {
            $this->warn("Use case already exists: {$path}");
            return;
        }

        File::ensureDirectoryExists(dirname($path));
        File::put($path, $this->renderStub("action-{$type}", ['class' => $name]));
        $this->info("Use case created: {$path}");
    }

    private function generateQuery(string $name, string $type): void
    {
        $plural = Str::plural($name);
        $classMap = [
            'index' => "List{$plural}",
            'show'  => "Get{$name}",
        ];

        $className = $classMap[$type];
        $path = app_path("UseCases/{$name}/{$className}.php");

        if (File::exists($path)) {
            $this->warn("Use case already exists: {$path}");
            return;
        }

        File::ensureDirectoryExists(dirname($path));
        File::put($path, $this->renderStub("query-{$type}", ['class' => $name, 'classes' => $plural]));
        $this->info("Use case created: {$path}");
    }

    // ─── Frontend ───────────────────────────────────────────────────────────────

    private function handleFrontend(): void
    {
        $type = $this->choice(
            'What do you want to generate?',
            ['entity (backend domain)', 'component', 'page', 'layout', 'util', 'domain context (TypeScript)'],
        );

        if (str_starts_with($type, 'entity')) {
            $name = $this->ask('Entity name?');
            $this->handleBackend(Str::studly($name));
            return;
        }

        if (str_starts_with($type, 'domain context')) {
            $this->handleDomainContext();
            return;
        }

        $name = $this->ask("Name of the {$type}?");

        match ($type) {
            'component' => $this->generateFrontendFile($name, 'components', 'svelte'),
            'page'      => $this->generateFrontendFile($name, 'pages', 'svelte'),
            'layout'    => $this->generateFrontendFile($name, 'layouts', 'svelte'),
            'util'      => $this->generateFrontendFile($name, 'lib/utils', 'ts'),
        };
    }

    private function generateFrontendFile(string $name, string $dir, string $ext): void
    {
        $parts = collect(explode('/', $name));
        $filename = $parts->last();
        $subdir = $parts->count() > 1 ? $parts->slice(0, -1)->implode('/') . '/' : '';

        $fullDir = resource_path("js/{$dir}/{$subdir}");
        File::ensureDirectoryExists($fullDir);

        $path = "{$fullDir}{$filename}.{$ext}";
        File::put($path, '');
        $this->info("Created: {$path}");
    }

    // ─── Domain context (TypeScript strategies) ─────────────────────────────────

    private function handleDomainContext(): void
    {
        $model  = Str::studly($this->ask('Model name?'));
        $rolesInput = $this->ask('Roles to generate strategies for (comma-separated)?');
        $roles  = array_map('trim', explode(',', $rolesInput));

        $domainPath     = resource_path("js/lib/domain/{$model}");
        $strategiesPath = "{$domainPath}/strategies";

        File::ensureDirectoryExists($strategiesPath);

        $this->generateDomainContext($model, $roles, $domainPath);

        foreach ($roles as $role) {
            $this->generateDomainStrategy($model, $role, $domainPath);
        }

        $this->info('Domain context and strategies generated successfully.');
    }

    private function generateDomainContext(string $model, array $roles, string $domainPath): void
    {
        $path = "{$domainPath}/context.ts";

        if (File::exists($path)) {
            $this->warn("Context already exists: {$path}");
            return;
        }

        $imports = collect($roles)->map(function (string $role) use ($model) {
            $roleName = Str::studly($role);
            return "import { {$roleName}{$model}TableStrategy } from './strategies/" . Str::camel($role) . "{$model}TableStrategy';";
        })->implode("\n");

        $cases = collect($roles)->map(function (string $role) use ($model) {
            $roleName = Str::studly($role);
            return "      case '{$role}':\n        return new {$roleName}{$model}TableStrategy();";
        })->implode("\n");

        $stub = File::get(base_path('stubs/context.stub'));
        $content = str_replace(
            ['{{ strategy_imports }}', '{{ model }}', '{{ strategy_cases }}'],
            [$imports, $model, $cases],
            $stub
        );

        File::put($path, $content);
        $this->info("Context created: {$path}");
    }

    private function generateDomainStrategy(string $model, string $role, string $domainPath): void
    {
        $roleName = Str::studly($role);
        $path = "{$domainPath}/strategies/" . Str::camel($role) . "{$model}TableStrategy.ts";

        if (File::exists($path)) {
            $this->warn("Strategy already exists: {$path}");
            return;
        }

        $stub = File::get(base_path('stubs/strategy.stub'));
        $content = str_replace(
            ['{{ model }}', '{{ role }}', '{{ route }}'],
            [$model, $roleName, Str::kebab($model)],
            $stub
        );

        File::put($path, $content);
        $this->info("Strategy created: {$path}");
    }

    // ─── Helpers ────────────────────────────────────────────────────────────────

    private function renderStub(string $stub, array $replacements): string
    {
        $content = File::get(base_path("stubs/{$stub}.stub"));

        foreach ($replacements as $key => $value) {
            $content = str_replace("{{ {$key} }}", $value, $content);
        }

        return $content;
    }
}
