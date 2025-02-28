<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use App\Models\MatchingGame;
use App\Models\WordPair;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('word_pairs', function (Blueprint $table) {
            $table->id();
            $table->string('source_word');
            $table->string('target_word');
            $table->string('source_language');
            $table->string('target_language');
            $table->timestamps();
        });

        Schema::create('matching_games', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->foreignIdFor(User::class);
            $table->timestamps();
        });

        Schema::create('matching_game_results', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(MatchingGame::class);
            $table->foreignIdFor(User::class);
            $table->integer('score');
            $table->timestamps();
        });

        Schema::create('matching_game_word_pairs', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(MatchingGame::class);
            $table->foreignIdFor(WordPair::class);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('word_pairs', function (Blueprint $table) {
            $table->dropIfExists();
        });
        Schema::table('matching_games', function (Blueprint $table) {
            $table->dropIfExists();
        });
        Schema::table('matching_game_results', function (Blueprint $table) {
            $table->dropIfExists();
        });
        Schema::table('matching_game_word_pairs', function (Blueprint $table) {
            $table->dropIfExists();
        });
    }
};
