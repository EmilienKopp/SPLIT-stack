<?php

namespace App\Utils;

class Attr {
  public static function all($class, $method, $attributesClass) {
    $reflection = new \ReflectionClass($class);
    $method = $reflection->getMethod($method);
    return $method->getAttributes($attributesClass);
  }

  public static function get($attributes, $key) {
    if(
      !method_exists($attributes[0], 'newInstance') 
      || !property_exists($attributes[0]->newInstance(), $key)
    ) {
      throw new \Exception("Attribute $key not found");
    }
    return $attributes[0]->newInstance()->$key;
  }
}