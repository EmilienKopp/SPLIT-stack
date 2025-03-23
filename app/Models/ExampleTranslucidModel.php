<?php

namespace App\Models;

use App\Traits\Translucid;
use Illuminate\Database\Eloquent\Model;

class ExampleTranslucidModel extends Model
{
    // Use the Translucid trait to automatically broadcast events
    use Translucid;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
    ];
}
