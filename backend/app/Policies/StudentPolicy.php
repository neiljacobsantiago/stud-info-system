<?php

namespace App\Policies;

use App\Models\Student;
use App\Models\User;

// Who may do what to a student record.
//   admin   - everything
//   staff   - may edit students in sections they advise
//   student - read only
class StudentPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Student $student): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'staff'], true);
    }

    public function update(User $user, Student $student): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->isStaff()
            && $student->section?->adviser_id === $user->id;
    }

    public function delete(User $user, Student $student): bool
    {
        // Deletion stays with the registrar, even for a section's own adviser.
        return $user->isAdmin();
    }
}
