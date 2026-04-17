<?php

namespace App\Contracts;

interface TypeScriptConvertible
{
    /**
     * Return a map of property names to TypeScript type strings.
     *
     * @return array<string, string>|null
     */
    public static function getTypeScriptDefinition(): ?array;
}
