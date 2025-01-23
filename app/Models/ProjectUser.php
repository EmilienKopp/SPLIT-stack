<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ProjectUser extends Pivot
{
    /** @use HasFactory<\Database\Factories\ProjectUserFactory> */
    use HasFactory;

    // protected function roles(): Attribute
    // {
    //     return Attribute::make(
    //         get: function ($value) {
    //             return json_decode($value);
    //         },
    //     );
    // }
    protected function casts()
    {
        return [
            'roles' => 'array',
        ];
    }
}
