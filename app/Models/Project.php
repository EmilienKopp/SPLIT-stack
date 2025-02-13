<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;
use Splitstack\Metamon\Traits\HandlesMetadata;

class Project extends Model
{
    /** @use HasFactory<\Database\Factories\ProjectFactory> */
    use HasFactory, Searchable, SoftDeletes, HandlesMetadata;

    protected $guarded = [];

    protected function casts() 
    {
        return [
            'metadata' => 'array',
        ];
    }

    public function users()
    {
        return $this->belongsToMany(User::class)
            ->using(ProjectUser::class)
            ->withPivot('roles');
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }
}
