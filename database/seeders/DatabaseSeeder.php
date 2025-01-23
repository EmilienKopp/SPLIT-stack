<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Organization;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            OrganizationSeeder::class,
            ProjectSeeder::class,
            ProjectUserSeeder::class,
            RoleSeeder::class,
        ]);

        // Assign the first user (id 1) to the first organization (id 1) for demo purposes
        $user = User::find(1);
        $organization = Organization::find(1);
        $user->organizations()->attach($organization);
    }
}
