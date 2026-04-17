<?php

namespace App\Attributes;

use Attribute;

#[Attribute(Attribute::TARGET_METHOD)]
class ExportRelationship
{
    public function __construct(
        public string $relatedModel,
        public ?string $type = null,
    ) {}

    public function isCollection(): bool
    {
        if ($this->type === null) {
            return false;
        }

        return in_array($this->type, ['hasMany', 'belongsToMany', 'hasManyThrough', 'morphMany']);
    }
}
