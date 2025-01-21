<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

trait Aliasable
{
  protected array $scopesCache = [];
  protected int $cacheTTL = 300; // 5 minutes

  /**
   * Get the alias for the current model instance
   */
  public function alias(?array $scopes = null): string
  {
    return Cache::remember(
      $this->buildCacheKey($scopes),
      now()->addSeconds($this->cacheTTL),
      fn() => $this->resolveAlias($scopes)
    ) ?? $this->{$this->getAliasableField()};
  }

  /**
   * Set an alias for the current model instance
   */
  public function setAlias(string $alias, ?array $scopes = null): void
  {
    $existingAlias = $this->findExistingAlias($scopes);

    if ($existingAlias) {
      $existingAlias->update(['alias' => $alias]);
    } else {
      $this->createNewAlias($alias, $scopes);
    }

    $this->clearAliasCache($scopes);
  }

  /**
   * Define the aliases relationship
   */
  public function aliases()
  {
    return $this->hasMany($this->getAliasModelClass(), $this->getAliasForeignKey());
  }

  /**
   * Get the table name for aliases
   */
  protected function getAliasTable(): string
  {
    return $this->aliasTable ?? $this->getTable() . '_aliases';
  }

  /**
   * Get the foreign key for alias relationships
   */
  protected function getAliasForeignKey(): string
  {
    return Str::singular($this->getTable()) . '_id';
  }

  /**
   * Get the field that stores the main aliasable value
   */
  protected function getAliasableField(): string
  {
    return $this->aliasable ?? 'name';
  }

  /**
   * Resolve the alias model class
   */
  protected function getAliasModelClass(): string
  {
    $relatedModel = Str::studly(Str::singular($this->getTable()));
    $modelClass = "App\\Models\\{$relatedModel}Alias";

    if (!class_exists($modelClass)) {
      throw new \Exception("Alias model does not exist: {$modelClass}");
    }

    return $modelClass;
  }

  /**
   * Build a cache key for the alias
   */
  protected function buildCacheKey(?array $scopes = null): string
  {
    $scopes = $this->normalizeScopes($scopes);
    $baseKey = sprintf(
      '%s.%s.%d',
      $this->getAliasTable(),
      $this->getAliasForeignKey(),
      $this->id
    );

    return collect($scopes)
      ->map(fn($value, $key) => "{$key}.{$value}")
      ->prepend($baseKey)
      ->join('.');
  }

  /**
   * Resolve the alias value
   */
  protected function resolveAlias(?array $scopes = null): ?string
  {
    return DB::table($this->getAliasTable())
      ->where($this->getAliasForeignKey(), $this->id)
      ->where($this->buildScopesQuery($scopes))
      ->value('alias');
  }

  /**
   * Find an existing alias record
   */
  protected function findExistingAlias(?array $scopes = null): ?Model
  {
    $aliasModel = $this->resolveAliasModel();
    $query = $aliasModel::query()
      ->where($this->getAliasForeignKey(), $this->id);

    foreach ($this->normalizeScopes($scopes) as $column => $value) {
      $query->where($column, $value);
    }

    return $query->first();
  }

  /**
   * Create a new alias record
   */
  protected function createNewAlias(string $alias, ?array $scopes = null): void
  {
    $aliasModel = $this->resolveAliasModel();
    $data = array_merge(
      [$this->getAliasForeignKey() => $this->id, 'alias' => $alias],
      $this->normalizeScopes($scopes)
    );

    $aliasModel::create($data);
  }

  /**
   * Build the scopes part of the query
   */
  protected function buildScopesQuery(?array $scopes = null): callable
  {
    return function ($query) use ($scopes) {
      foreach ($this->normalizeScopes($scopes) as $column => $value) {
        if (isset($value)) {
          $query->where($column, $value);
        }
      }
    };
  }

  /**
   * Normalize the scopes array
   */
  protected function normalizeScopes(?array $scopes = null): array
  {
    return $scopes ?? [
      'user_id' => Auth::id(),
    ];
  }

  /**
   * Clear the alias cache
   */
  protected function clearAliasCache(?array $scopes = null): void
  {
    Cache::forget($this->buildCacheKey($scopes));
  }

  /**
   * Get an instance of the alias model
   */
  protected function resolveAliasModel(): string
  {
    return $this->getAliasModelClass();
  }
}
