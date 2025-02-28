<?php

namespace App\Http\Controllers;

use App\Models\MatchingGame;
use App\Models\WordPair;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MatchingGameController extends Controller
{
    public function index()
    {
        $games = MatchingGame::with(['user','results'])->get();
        return Inertia::render('Game/Index', compact('games'));
    }

    public function create()
    {
        return Inertia::render('Game/Create');
    }

    public function play(MatchingGame $game)
    {
        $game->load('wordPairs');
        return Inertia::render('Game/Play', [
            'game' => $game,
        ]);
    }

    public function store(Request $request) 
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'word_pairs' => 'required|array',
            'word_pairs.*.source_word' => 'required|string|max:255',
            'word_pairs.*.target_word' => 'required|string|max:255',
            'word_pairs.*.source_language' => 'required|string|max:255',
            'word_pairs.*.target_language' => 'required|string|max:255',
        ]);


        $pairs = $validated['word_pairs'];

        $game = MatchingGame::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? "",
            'user_id' => auth()->id(),
        ]);
        
        foreach ($pairs as $pair) {
            $createdPair = WordPair::create($pair);
            $game->wordPairs()->attach($createdPair);
        }

        
        return redirect()->route('game.play', ['game' => $game]);
    }

    public function update(Request $request, MatchingGame $game)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'word_pairs' => 'required|array',
            'word_pairs.*.source_word' => 'required|string|max:255',
            'word_pairs.*.target_word' => 'required|string|max:255',
            'word_pairs.*.source_language' => 'required|string|max:255',
            'word_pairs.*.target_language' => 'required|string|max:255',
        ]);

        $pairs = $validated['word_pairs'];

        $game->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? "",
        ]);
        
        $game->wordPairs()->detach();

        foreach ($pairs as $pair) {
            $createdPair = WordPair::create($pair);
            $game->wordPairs()->attach($createdPair);
        }

        
        return redirect()->route('game.play', ['game' => $validated]);
    }

    public function setScore(Request $request, MatchingGame $game)
    {
        $validated = $request->validate([
            'score' => 'required|integer',
            'time' => 'required|decimal:3',
        ]);

        $game->results()->create([
            'user_id' => auth()->id(),
            'score' => $validated['score'],
            'time' => $validated['time'],
        ]);

        return redirect()->route('game.index');
    }
    
    public function destroy(MatchingGame $game)
    {
        $game->delete();
        return redirect()->route('game.index');
    }
}
