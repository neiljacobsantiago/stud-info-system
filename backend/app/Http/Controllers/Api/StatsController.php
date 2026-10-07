<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Models\Section;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// Backs the Home dashboard. The counts are computed in SQL rather than by
// loading every record into React and counting there.
class StatsController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $sections = Section::withCount('students')->get();

        // Open slots = declared capacity minus students actually filed.
        $openSlots = $sections->sum(fn (Section $section) => $section->openSlots());

        $recent = Student::with(['program', 'section.adviser'])
            ->where('status', 'active')
            ->latest('id')
            ->take(4)
            ->get();

        return response()->json([
            'totalStudents' => Student::count(),
            'activeCount'   => Student::where('status', 'active')->count(),
            'sectionCount'  => $sections->count(),
            'openSlots'     => $openSlots,
            'recent'        => StudentResource::collection($recent),
        ]);
    }
}
