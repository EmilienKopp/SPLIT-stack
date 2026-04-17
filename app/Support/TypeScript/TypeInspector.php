<?php

namespace App\Support\TypeScript;

use App\Contracts\TypeScriptConvertible;
use PHPStan\PhpDocParser\Ast\Type\ArrayTypeNode;
use PHPStan\PhpDocParser\Ast\Type\GenericTypeNode;
use PHPStan\PhpDocParser\Ast\Type\IdentifierTypeNode;
use PHPStan\PhpDocParser\Ast\Type\NullableTypeNode;
use PHPStan\PhpDocParser\Ast\Type\UnionTypeNode;
use PHPStan\PhpDocParser\Lexer\Lexer;
use PHPStan\PhpDocParser\Parser\ConstExprParser;
use PHPStan\PhpDocParser\Parser\PhpDocParser;
use PHPStan\PhpDocParser\Parser\TokenIterator;
use PHPStan\PhpDocParser\Parser\TypeParser;
use PHPStan\PhpDocParser\ParserConfig;
use ReflectionClass;
use ReflectionNamedType;
use ReflectionUnionType;

class TypeInspector
{
    protected static array $phpToTs = [
        'string'    => 'string',
        'int'       => 'number',
        'integer'   => 'number',
        'float'     => 'number',
        'double'    => 'number',
        'bool'      => 'boolean',
        'boolean'   => 'boolean',
        'true'      => 'true',
        'false'     => 'false',
        'null'      => 'null',
        'mixed'     => 'any',
        'void'      => 'void',
        'never'     => 'never',
        'array'     => 'any[]',
        'object'    => 'Record<string, any>',
        'iterable'  => 'any[]',
    ];

    protected static array $dateClasses = [
        'Carbon', 'CarbonImmutable', 'DateTime', 'DateTimeImmutable', 'DateTimeInterface',
    ];

    protected static array $collectionClasses = [
        'Collection', 'Traversable', 'EloquentCollection',
    ];

    protected static ?PhpDocParser $docParser = null;

    protected static ?Lexer $lexer = null;

    /**
     * Inspect a class using 3-tier strategy: Reflection → PHPDoc → TypeScriptConvertible.
     * Returns null if no typed properties could be determined.
     *
     * @return array<string, string>|null
     */
    public function inspect(string $className): ?array
    {
        if (! class_exists($className)) {
            return null;
        }

        $ref = new ReflectionClass($className);

        if ($ref->isAbstract() || $ref->isInterface()) {
            return null;
        }

        return $this->inspectViaReflection($ref)
            ?? $this->inspectViaPhpDoc($ref)
            ?? $this->inspectViaConvertible($className);
    }

    // -------------------------------------------------------------------------
    // Strategy 1 — Reflection
    // -------------------------------------------------------------------------

    /** @return array<string, string>|null */
    protected function inspectViaReflection(ReflectionClass $ref): ?array
    {
        $constructor = $ref->getConstructor();
        $properties = [];

        if ($constructor) {
            foreach ($constructor->getParameters() as $param) {
                if (! $param->isPromoted()) {
                    continue;
                }

                $type = $param->getType();
                if ($type === null) {
                    continue;
                }

                [$tsType, $nullable] = $this->mapReflectionType($type);
                $optional = $param->isOptional() || $param->isDefaultValueAvailable();
                $key = ($optional || $nullable) ? $param->getName().'?' : $param->getName();
                $properties[$key] = $tsType;
            }

            if (! empty($properties)) {
                return $properties;
            }
        }

        foreach ($ref->getProperties(\ReflectionProperty::IS_PUBLIC) as $prop) {
            if ($prop->isStatic()) {
                continue;
            }

            $type = $prop->getType();
            if ($type === null) {
                continue;
            }

            [$tsType, $nullable] = $this->mapReflectionType($type);
            $key = $nullable ? $prop->getName().'?' : $prop->getName();
            $properties[$key] = $tsType;
        }

        return ! empty($properties) ? $properties : null;
    }

    /** @return array{string, bool} [tsType, isNullable] */
    protected function mapReflectionType(\ReflectionType $type): array
    {
        if ($type instanceof ReflectionNamedType) {
            $nullable = $type->allowsNull() && $type->getName() !== 'null';
            $tsType = $this->mapPhpTypeName($type->getName());

            return [$nullable ? $tsType.' | null' : $tsType, $nullable];
        }

        if ($type instanceof ReflectionUnionType) {
            $parts = [];
            $nullable = false;

            foreach ($type->getTypes() as $t) {
                if ($t instanceof ReflectionNamedType && $t->getName() === 'null') {
                    $nullable = true;
                    continue;
                }
                $parts[] = $this->mapPhpTypeName($t->getName());
            }

            if ($nullable) {
                $parts[] = 'null';
            }

            return [implode(' | ', array_unique($parts)), $nullable];
        }

        return ['any', false];
    }

    protected function mapPhpTypeName(string $name): string
    {
        if (isset(self::$phpToTs[$name])) {
            return self::$phpToTs[$name];
        }

        $basename = class_basename($name);

        foreach (self::$dateClasses as $dateClass) {
            if ($basename === $dateClass) {
                return 'string';
            }
        }

        foreach (self::$collectionClasses as $colClass) {
            if ($basename === $colClass) {
                return 'any[]';
            }
        }

        return $basename;
    }

    // -------------------------------------------------------------------------
    // Strategy 2 — PHPDoc
    // -------------------------------------------------------------------------

    /** @return array<string, string>|null */
    protected function inspectViaPhpDoc(ReflectionClass $ref): ?array
    {
        $doc = $ref->getDocComment();
        if ($doc) {
            $properties = $this->parsePropertyTags($doc);
            if (! empty($properties)) {
                return $properties;
            }
        }

        $constructor = $ref->getConstructor();
        if ($constructor) {
            $doc = $constructor->getDocComment();
            if ($doc) {
                $properties = $this->parseParamTags($doc);
                if (! empty($properties)) {
                    return $properties;
                }
            }
        }

        return null;
    }

    /** @return array<string, string> */
    protected function parsePropertyTags(string $doc): array
    {
        $tokens = new TokenIterator($this->getLexer()->tokenize($doc));
        $phpDocNode = $this->getDocParser()->parse($tokens);

        $tags = array_merge(
            $phpDocNode->getPropertyTagValues(),
            $phpDocNode->getPropertyReadTagValues(),
        );

        $properties = [];
        foreach ($tags as $tag) {
            $nullable = $tag->type instanceof NullableTypeNode;
            $key = ltrim($tag->propertyName, '$').($nullable ? '?' : '');
            $properties[$key] = $this->mapPhpDocType($tag->type);
        }

        return $properties;
    }

    /** @return array<string, string> */
    protected function parseParamTags(string $doc): array
    {
        $tokens = new TokenIterator($this->getLexer()->tokenize($doc));
        $phpDocNode = $this->getDocParser()->parse($tokens);

        $properties = [];
        foreach ($phpDocNode->getParamTagValues() as $tag) {
            $nullable = $tag->type instanceof NullableTypeNode;
            $key = ltrim($tag->parameterName, '$').($nullable ? '?' : '');
            $properties[$key] = $this->mapPhpDocType($tag->type);
        }

        return $properties;
    }

    protected function mapPhpDocType(mixed $typeNode): string
    {
        if ($typeNode instanceof NullableTypeNode) {
            return $this->mapPhpDocType($typeNode->type).' | null';
        }

        if ($typeNode instanceof UnionTypeNode) {
            $parts = array_map(fn ($t) => $this->mapPhpDocType($t), $typeNode->types);

            return implode(' | ', array_unique($parts));
        }

        if ($typeNode instanceof ArrayTypeNode) {
            return $this->mapPhpDocType($typeNode->type).'[]';
        }

        if ($typeNode instanceof GenericTypeNode) {
            $name = $typeNode->type->name;
            $args = $typeNode->genericTypes;

            if (in_array($name, self::$collectionClasses)) {
                // Collection<T> or Collection<K, T> — take value type (last arg)
                return $this->mapPhpDocType(end($args)).'[]';
            }

            if ($name === 'array') {
                if (count($args) === 1) {
                    return $this->mapPhpDocType($args[0]).'[]';
                }
                if (count($args) === 2) {
                    return 'Record<'.$this->mapPhpDocType($args[0]).', '.$this->mapPhpDocType($args[1]).'>';
                }
            }

            return $this->mapPhpTypeName($name);
        }

        if ($typeNode instanceof IdentifierTypeNode) {
            return $this->mapPhpTypeName($typeNode->name);
        }

        return 'any';
    }

    // -------------------------------------------------------------------------
    // Strategy 3 — TypeScriptConvertible
    // -------------------------------------------------------------------------

    /** @return array<string, string>|null */
    protected function inspectViaConvertible(string $className): ?array
    {
        if (in_array(TypeScriptConvertible::class, class_implements($className) ?: [])) {
            return $className::getTypeScriptDefinition();
        }

        return null;
    }

    // -------------------------------------------------------------------------
    // PHPDoc parser helpers (lazy-init, mirroring Wayfinder pattern)
    // -------------------------------------------------------------------------

    protected function getDocParser(): PhpDocParser
    {
        if (self::$docParser === null) {
            $config = new ParserConfig(usedAttributes: []);
            $constExpr = new ConstExprParser($config);
            $typeParser = new TypeParser($config, $constExpr);
            self::$docParser = new PhpDocParser($config, $typeParser, $constExpr);
        }

        return self::$docParser;
    }

    protected function getLexer(): Lexer
    {
        if (self::$lexer === null) {
            self::$lexer = new Lexer(new ParserConfig(usedAttributes: []));
        }

        return self::$lexer;
    }
}
