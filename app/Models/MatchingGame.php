<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchingGame extends Model
{
    protected $fillable = [
        'name',
        'description',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function wordPairs()
    {
        return $this->belongsToMany(WordPair::class, 'matching_game_word_pairs');
    }

    public function results()
    {
        return $this->hasMany(MatchingGameResult::class);
    }

    public function scopeRandom()
    {
        return $this->wordPairs()->query()->inRandomOrder();
    }
}
