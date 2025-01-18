<?php

namespace App\Traits;

use Illuminate\Support\Arr;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

trait HasMetadata
{
  protected $metadataColumn = 'metadata';

  /**
   * Boot the trait, ensuring that metadata is an empty array on saving.
   */
  protected static function bootHasMetadata()
  {
    static::saving(function (Model $model) {
      $metadataColumn = $model->getMetadataColumn();
      if (!is_array($model->{$metadataColumn})) {
        $model->{$metadataColumn} = [];
      }
    });
  }

  /**
   * Shorthand accessor for getMetadata and setMetadata.
   * If $value is null, get the value.
   * If $value is not null, set the value.
   * 
   * @param string $key
   * @param mixed|null $value
   * @return mixed
   */
  public function metadata(string $key, $value = null)
  {
    if (is_null($value)) {
      return $this->getMetadata($key);
    } else {
      return $this->setMetadata($key, $value);
    }
  }

  /**
   * Get the metadata column name.
   *
   * @return string
   */
  public function getMetadataColumn(): string
  {
    return $this->metadataColumn;
  }

  /**
   * Get a value from the metadata.
   *
   * @param string|null $key
   * @param mixed|null $default
   * @return mixed
   */
  public function getMetadata(string $key = null, $default = null)
  {
    $metadata = $this->{$this->getMetadataColumn()};
    return $key ? Arr::get($metadata, $key, $default) : $metadata;
  }

  /**
   * Remove a key from the metadata.
   *
   * @param string $key
   * @return $this
   */
  public function forgetMetadata(string $key): self
  {
    $metadata = $this->{$this->getMetadataColumn()};
    Arr::forget($metadata, $key);
    $this->{$this->getMetadataColumn()} = $metadata;

    return $this;
  }

  /**
   * Scope a query to filter by metadata key/value.
   *
   * @param Builder $query
   * @param string $key
   * @param mixed $value
   * @return Builder
   */
  public function scopeWhereMetadata(Builder $query, string $key, $value): Builder
  {
    return $query->where("{$this->getMetadataColumn()}->{$key}", $value);
  }

  /**
   * Check if a metadata key exists.
   *
   * @param string $key
   * @return bool
   */
  public function hasMetadata(string $key): bool
  {
    $metadata = $this->{$this->getMetadataColumn()};
    return Arr::has($metadata, $key);
  }

  /**
   * Set a value in the metadata with role-based key restrictions.
   * Uses dot notation for nested keys.
   *
   * @param string|array $key
   * @param mixed|null $value
   * @param string|null $role
   * @return $this
   *
   * @throws \Exception
   */
  public function setMetadata($key, $value = null, string $role = null): self
  {
    $allowedKeys = $this->getAllowedMetadataKeys($role);

    if (!Arr::has($allowedKeys, $key)) {
      throw new \Exception("Key '{$key}' is not allowed for role '{$role}'");
    }

    return $this->addMetadata($key, $value);
  }

  /**
   * Add a value to metadata without restrictions.
   *
   * @param string|array $key
   * @param mixed|null $value
   * @return $this
   */
  protected function addMetadata($key, $value = null): self
  {
    $metadata = $this->{$this->getMetadataColumn()};
    if (is_array($key)) {
      $metadata = array_merge($metadata, $key);
    } else {
      Arr::set($metadata, $key, $value);
    }
    $this->{$this->getMetadataColumn()} = $metadata;

    return $this;
  }

  /**
   * Get allowed metadata keys for a specific role.
   *
   * @param string|null $role
   * @return array
   */
  public function getAllowedMetadataKeys(?string $role): array
  {
    $role = $role ?? 'default';
    $rolesConfig = config('metadata.roles', []);

    return $rolesConfig[$role] ?? [];
  }
}
