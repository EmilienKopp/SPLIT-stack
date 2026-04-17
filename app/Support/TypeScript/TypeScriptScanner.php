<?php

namespace App\Support\TypeScript;

use App\Contracts\TypeScriptConvertible;
use Illuminate\Support\Facades\File;
use ReflectionClass;

class TypeScriptScanner
{
    public function __construct(
        protected TypeInspector $inspector,
    ) {}

    /**
     * Scan the given app-relative directories for TypeScript-exportable classes.
     *
     * @param  array<string>  $directories  Paths relative to app_path()
     * @param  array<string>  $include      Glob-style class name patterns
     * @param  array<string>  $exclude      Glob-style class name patterns
     * @param  bool           $optIn        When true, only TypeScriptConvertible implementors are included.
     *                                      When false, all concrete classes are introspected.
     * @return array<string, array<string, string>>
     */
    public function scan(array $directories, array $include = ['*'], array $exclude = [], bool $optIn = true): array
    {
        $interfaces = [];

        foreach ($directories as $dir) {
            $path = app_path($dir);
            if (! File::exists($path)) {
                continue;
            }

            foreach (File::allFiles($path) as $file) {
                if ($file->getExtension() !== 'php') {
                    continue;
                }

                $className = $this->resolveClassName($file->getPathname());
                if (! $className || ! class_exists($className)) {
                    continue;
                }

                $ref = new ReflectionClass($className);
                if ($ref->isAbstract() || $ref->isInterface()) {
                    continue;
                }

                $baseName = class_basename($className);

                if (! $this->shouldInclude($baseName, $include, $exclude)) {
                    continue;
                }

                if ($optIn && ! in_array(TypeScriptConvertible::class, class_implements($className) ?: [])) {
                    continue;
                }

                try {
                    $definition = $this->inspector->inspect($className);
                    if ($definition !== null) {
                        $interfaces[$baseName] = $definition;
                    }
                } catch (\Throwable) {
                    // Skip classes that cannot be introspected
                }
            }
        }

        return $interfaces;
    }

    public function resolveClassName(string $filePath): ?string
    {
        $content = File::get($filePath);

        if (! preg_match('/namespace\s+([^;]+);/', $content, $ns)) {
            return null;
        }
        if (! preg_match('/class\s+(\w+)/', $content, $class)) {
            return null;
        }

        return $ns[1].'\\'.$class[1];
    }

    protected function shouldInclude(string $className, array $include, array $exclude): bool
    {
        foreach ($exclude as $pattern) {
            if ($this->matchesPattern($className, $pattern)) {
                return false;
            }
        }

        foreach ($include as $pattern) {
            if ($pattern === '*' || $this->matchesPattern($className, $pattern)) {
                return true;
            }
        }

        return false;
    }

    protected function matchesPattern(string $className, string $pattern): bool
    {
        $regex = '/^'.str_replace('\*', '.*', preg_quote($pattern, '/')).'$/';

        return preg_match($regex, $className) === 1;
    }
}
