<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Demo accounts. Password for all of them: password
        $users = [
            ['name' => 'Registrar Admin',  'email' => 'admin@clsu.edu.ph',    'role' => 'admin'],
            ['name' => 'Prof. Dela Cruz',  'email' => 'delacruz@clsu.edu.ph', 'role' => 'staff'],
            ['name' => 'Prof. Bautista',   'email' => 'bautista@clsu.edu.ph', 'role' => 'staff'],
            ['name' => 'Prof. Villanueva', 'email' => 'villanueva@clsu.edu.ph', 'role' => 'staff'],
            ['name' => 'Student Viewer',   'email' => 'student@clsu.edu.ph',  'role' => 'student'],
        ];

        foreach ($users as $user) {
            User::firstOrCreate(
                ['email' => $user['email']],
                $user + ['password' => 'password']
            );
        }
    }
}
