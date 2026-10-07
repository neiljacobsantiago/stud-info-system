<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Models\Favorite;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

// Powers the Favorites page. Everything here is scoped to the signed-in user,
// which is what makes authentication load-bearing rather than decorative.
class FavoriteController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $students = $request->user()
            ->favoritedStudents()
            ->with(['program', 'section.adviser'])
            ->orderBy('last_name')
            ->get()
            ->each(fn (Student $student) => $student->setAttribute('is_favorite', true));

        return StudentResource::collection($students);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
        ]);

        // firstOrCreate keeps a double-click idempotent instead of hitting the
        // unique index and throwing a 500.
        Favorite::firstOrCreate([
            'user_id'    => $request->user()->id,
            'student_id' => $data['student_id'],
        ]);

        return response()->json(['message' => 'Record filed.'], 201);
    }

    public function destroy(Request $request, Student $student): JsonResponse
    {
        Favorite::where('user_id', $request->user()->id)
            ->where('student_id', $student->id)
            ->delete();

        return response()->json(null, 204);
    }
}
