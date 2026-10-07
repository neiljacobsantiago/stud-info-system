<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    // Order matters: programs and users are referenced by sections and
    // students, so they have to exist first.
    public function run(): void
    {
        $this->call([
            ProgramSeeder::class,
            UserSeeder::class,
            StudentSeeder::class,
            FavoriteSeeder::class,
        ]);
    }
}
