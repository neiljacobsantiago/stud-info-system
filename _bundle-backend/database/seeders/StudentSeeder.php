<?php

namespace Database\Seeders;

use App\Models\Program;
use App\Models\Section;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

// Reads the original Project 1 dataset and splits it across the normalized
// tables, so all 35 records survive the move to MySQL.
//
// Copy the file first:
//   cp <project-1>/public/students.json backend/database/data/students.json
class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('data/students.json');

        if (! File::exists($path)) {
            $this->command->error("Missing {$path} - copy students.json from the Project 1 app first.");

            return;
        }

        $records = json_decode(File::get($path), true)['students'] ?? [];

        if ($records === []) {
            $this->command->warn('students.json contained no records.');

            return;
        }

        $advisers = User::where('role', 'staff')->pluck('id')->all();
        $adviserCount = count($advisers);
        $sectionIndex = 0;

        foreach ($records as $record) {
            // The JSON used a "blank" category for placeholder rows. A
            // relational database represents an empty seat as the absence of a
            // row, so those are skipped and capacity covers the same idea.
            if (($record['category'] ?? 'active') === 'blank') {
                continue;
            }

            $program = Program::firstOrCreate(
                ['code' => $record['course'] ?? 'BSIT'],
                ['name' => 'Bachelor of Science in Information Technology']
            );

            $section = Section::firstOrCreate(
                [
                    'program_id' => $program->id,
                    'code'       => $record['section'],
                ],
                [
                    'year_level' => $record['yearLevel'],
                    'capacity'   => 40,
                    // Advisers are handed out round-robin as sections appear.
                    'adviser_id' => $adviserCount
                        ? $advisers[$sectionIndex++ % $adviserCount]
                        : null,
                ]
            );

            Student::create([
                'program_id'      => $program->id,
                'section_id'      => $section->id,
                'first_name'      => $record['firstName'],
                'last_name'       => $record['lastName'],
                'hometown'        => $record['hometown'],
                'enrollment_year' => $record['enrollmentYear'],
                'status'          => 'active',
                'bio'             => $record['bio'] ?? null,
            ]);
            // student_no is stamped by the Student model's created() hook.
        }

        $this->command->info('Seeded '.Student::count().' students across '.Section::count().' sections.');
    }
}
