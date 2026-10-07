<?php

namespace Database\Seeders;

use App\Models\Favorite;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;

// Gives the demo student account a couple of filed records, so the Favorites
// page is not empty the first time it is opened in the video.
class FavoriteSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'student@clsu.edu.ph')->first();

        if (! $user) {
            return;
        }

        Student::take(3)->get()->each(function (Student $student) use ($user) {
            Favorite::firstOrCreate([
                'user_id'    => $user->id,
                'student_id' => $student->id,
            ]);
        });
    }
}
