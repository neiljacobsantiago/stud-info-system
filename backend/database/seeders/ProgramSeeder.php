<?php

namespace Database\Seeders;

use App\Models\Program;
use Illuminate\Database\Seeder;

class ProgramSeeder extends Seeder
{
    public function run(): void
    {
        // BSCS has no students yet on purpose: it gives the program select in
        // the student form a second option, and proves the section dropdown
        // really is filtered by the chosen program.
        $programs = [
            ['code' => 'BSIT', 'name' => 'Bachelor of Science in Information Technology'],
            ['code' => 'BSCS', 'name' => 'Bachelor of Science in Computer Science'],
        ];

        foreach ($programs as $program) {
            Program::firstOrCreate(['code' => $program['code']], $program);
        }
    }
}
