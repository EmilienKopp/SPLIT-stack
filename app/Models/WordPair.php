<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WordPair extends Model
{
    /** @use HasFactory<\Database\Factories\WordMatchFactory> */
    use HasFactory;

    protected $fillable = [
        'source_word',
        'target_word',
        'source_language',
        'target_language',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function matchingGames()
    {
        return $this->belongsToMany(MatchingGame::class, 'matching_game_word_pairs');
    }

}
