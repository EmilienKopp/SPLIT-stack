<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Organization;
use App\Models\User;
use App\Models\OrganizationUser;

class OrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::transaction(function () {
            $organizations = Organization::factory(10)->create();

            $users = User::factory(50)->create();

            $organizations->each(function ($organization) use ($users) {
                $selectedUsers = $users->random(rand(3, 10));

                $pivotData = $selectedUsers->map(function ($user) {
                    return [
                        'user_id' => $user->id,
                        'elevated' => rand(0, 10) < 2, // 20% chance of being elevated
                        'created_at' => now(),
                        'updated_at' => now()
                    ];
                });

                $organization->users()->attach($pivotData);
            });

            $usersWithoutOrg = User::doesntHave('organizations')->get();
            $usersWithoutOrg->each(function ($user) use ($organizations) {
                $randomOrg = $organizations->random();
                OrganizationUser::create([
                    'organization_id' => $randomOrg->id,
                    'user_id' => $user->id,
                    'elevated' => false,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            });
        });
    }
}
