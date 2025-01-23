<?php

namespace Database\Factories;

use App\Enums\ProjectStatus;
use App\Enums\ProjectType;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => Str::ucfirst($this->faker->word()),
            'description' => $this->faker->paragraph,
            'organization_id' => Organization::inRandomOrder()->first()->id,
            'type' => ProjectType::random(),
            'status' => ProjectStatus::random(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
