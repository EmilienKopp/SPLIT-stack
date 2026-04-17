<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Source groups
    |--------------------------------------------------------------------------
    | Each key maps to a source type scanned for TypeScriptConvertible classes.
    | 'directories' are relative to app_path().
    | 'include'/'exclude' accept glob-style class name patterns.
    */
    'sources' => [
        'entities' => [
            'directories' => ['Domain/Entities'],
            'include'     => ['*'],
            'exclude'     => ['Base*'],
            'opt_in'      => false,  // introspect all concrete classes automatically
        ],
        'value_objects' => [
            'directories' => ['Domain/ValueObjects'],
            'include'     => ['*'],
            'exclude'     => [],
            'opt_in'      => false,  // introspect all concrete classes automatically
        ],
        'resources' => [
            'directories' => ['Http/Resources', 'DTOs'],
            'include'     => ['*'],
            'exclude'     => [],
            'opt_in'      => true,   // only classes implementing TypeScriptConvertible
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Output paths
    |--------------------------------------------------------------------------
    | Keys match the source group keys above, plus 'barrel' for the index file.
    */
    'output' => [
        'entities'      => resource_path('js/types/entities.ts'),
        'value_objects' => resource_path('js/types/value-objects.ts'),
        'resources'     => resource_path('js/types/resources.ts'),
        'barrel'        => resource_path('js/types/index.ts'),
    ],

    'mapping' => [
    'integer' => 'number',
    'string' => 'string',
    'character varying' => 'string',
    'boolean' => 'boolean',
    'date' => 'Date',
    'timestamp without time zone' => 'Date | string',
    'datetime' => 'Date',
    'timestamp' => 'Date',
    'json' => 'any',
    'object' => 'any',
    'array' => 'Array<any>',
    'decimal' => 'number',
    'float' => 'number',
    'double' => 'number',
    'real' => 'number',
    'numeric' => 'number',
    'int' => 'number',
    'tinyint' => 'number',
    'smallint' => 'number',
    'mediumint' => 'number',
    'bigint' => 'number',
    'char' => 'string',
    'varchar' => 'string',
    'text' => 'string',
    'mediumtext' => 'string',
    'longtext' => 'string',
    'enum' => 'string',
    'set' => 'string',
    'binary' => 'string',
    'varbinary' => 'string',
    'blob' => 'string',
    'tinyblob' => 'string',
    'mediumblob' => 'string',
    'longblob' => 'string',
    'time' => 'Date',
    'year' => 'Date',
    'geometry' => 'string',
    'point' => 'string',
    'linestring' => 'string',
    'polygon' => 'string',
    'multipoint' => 'string',
    'multilinestring' => 'string',
    'multipolygon' => 'string',
    'geometrycollection' => 'string',
    'jsonb' => 'any',
    'uuid' => 'string',
    'ipaddress' => 'string',
    'macaddress' => 'string',
    'cidr' => 'string',
    'inet' => 'string',
    'bit' => 'string',
    'bit varying' => 'string',
    'interval' => 'string',
    'xml' => 'string',
    'tsquery' => 'string',
    'tsvector' => 'string',
    'macaddr' => 'string',
    'money' => 'number',
  ]
];
