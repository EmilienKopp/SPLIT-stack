<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use App\Events\TranslucidCreated;
use App\Events\TranslucidUpdated;
use App\Events\TranslucidDeleted;

trait Translucid
{
    use Notifiable;

    protected static function bootTranslucid()
    {
        self::created(function (Model $model) {
            event(new TranslucidCreated($model));
        });

        self::updated(function (Model $model) {
            event(new TranslucidUpdated($model));
        });

        self::deleted(function (Model $model) {
            event(new TranslucidDeleted($model));
        });
    }
}
