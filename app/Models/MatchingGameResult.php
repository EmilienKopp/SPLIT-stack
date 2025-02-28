<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchingGameResult extends Model
{
    protected $guarded = [];
    public function game()
    {
        return $this->belongsTo(MatchingGame::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
