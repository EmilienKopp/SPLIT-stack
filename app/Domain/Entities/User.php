<?php


namespace App\Domain\Entities;

use App\Contracts\TypeScriptConvertible;

final class User implements TypeScriptConvertible
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
    ) {
    }

    public static function getTypeScriptDefinition(): ?array
    {
        return [
            'id' => 'number',
            'name' => 'string',
            'email' => 'string',
        ];
    }
}