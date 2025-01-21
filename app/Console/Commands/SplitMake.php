<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Laravel\Prompts\Prompt;

class SplitMake extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'split:make';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate Svelte of TS files';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // options: [component, page, layout]
        $type = $this->choice('What type of file do you want to generate?', ['component', 'page', 'layout', 'util', 'domain']);

        switch ($type) {
            case 'component':
                $name = $this->ask('What is the name of the component?');
                $this->generateComponent($name);
                break;
            case 'page':
                $name = $this->ask('What is the name of the page?');
                $this->generatePage($name);
                break;
            case 'layout':
                $name = $this->ask('What is the name of the layout?');
                $this->generateLayout($name);
                break;
            case 'util':
                $name = $this->ask('What is the name of the util?');
                $this->generateUtil($name);
                break;
            case 'domain':
                $name = $this->ask('What is the name of the domain?');
                $this->generateDomain($name);
                break;
        }
    }

    public function generateComponent($name)
    {
        $this->generateFile('component', $name);
    }

    public function resolveExtension($type)
    {
        switch ($type) {
            case 'component':
                return 'svelte';
            case 'page':
                return 'svelte';
            case 'layout':
                return 'svelte';
            case 'util':
                return 'ts';
            case 'domain':
                return 'ts';
            default:
                return 'svelte';
        }
    }

    public function generatePage($name)
    {
        $this->generateFile('page', $name);
    }

    public function generateLayout($name)
    {
        $this->generateFile('layout', $name);
    }

    public function generateUtil($name)
    {
        $this->generateFile('util', $name);
    }

    public function generateDomain($name)
    {
        $dir = 'Lib/domains/'.$name;
        $this->generateFile('domain', 'index', $dir);
    }

    public function generateFile($type, $path, $dir = null)
    {
        $extension = $this->resolveExtension($type);
        $dir ??= Str::ucfirst($type) . 's';
        $exploded = collect(explode('/', $path));
        $userInputDirectories = $exploded->take(-1);
        $filename = $exploded->last();
        $path = $userInputDirectories->implode('/');
        $dirPath = "js/{$dir}/{$path}";
        if(!File::exists(resource_path($dirPath))) {
            File::makeDirectory(resource_path($dirPath), 0755, true);
        }
        $finalPath = resource_path("{$dirPath}/{$filename}.{$extension}");
        File::put($finalPath, '');

        $this->info("File created at:");
        $this->line($finalPath);
    }
}
