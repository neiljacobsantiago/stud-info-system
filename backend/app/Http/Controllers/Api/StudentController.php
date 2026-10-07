<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Models\Section;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    // Each method authorizes itself against StudentPolicy. Laravel 11/12
    // dropped Controller::middleware(), so authorizeResource() in the
    // constructor is no longer available.

    // GET /api/registrar/students
    // Search, filter, sort and paging all happen here rather than in the
    // browser, so React only ever holds one page of records.
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Student::class);

        $userId = $request->user()?->id;

        $students = Student::query()
            ->with(['program', 'section.adviser'])
            ->when($userId, fn ($q) => $q->withExists([
                'favorites as is_favorite' => fn ($sub) => $sub->where('user_id', $userId),
            ]))
            ->search($request->query('q'))
            ->yearLevel($request->query('year_level'))
            ->status($request->query('status'))
            ->sorted($request->query('sort'))
            ->paginate(8)
            ->withQueryString();

        return StudentResource::collection($students);
    }

    // GET /api/registrar/students/{student}
    public function show(Request $request, Student $student): StudentResource
    {
        $this->authorize('view', $student);

        $student->load(['program', 'section.adviser']);

        return new StudentResource($student);
    }

    // POST /api/registrar/students
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Student::class);

        $data = $this->validated($request);

        if ($message = $this->sectionCapacityError($data['section_id'])) {
            return $this->capacityResponse($message);
        }

        $student = Student::create($data);
        $student->refresh()->load(['program', 'section.adviser']);

        return (new StudentResource($student))->response()->setStatusCode(201);
    }

    // PUT/PATCH /api/registrar/students/{student}
    public function update(Request $request, Student $student): StudentResource
    {
        $this->authorize('update', $student);

        $data = $this->validated($request, $student);

        // Only re-check capacity when the student is actually moving section.
        if ((int) $data['section_id'] !== $student->section_id) {
            if ($message = $this->sectionCapacityError($data['section_id'])) {
                abort(response()->json([
                    'message' => 'The given data was invalid.',
                    'errors'  => ['section_id' => [$message]],
                ], 422));
            }
        }

        $student->update($data);
        $student->load(['program', 'section.adviser']);

        return new StudentResource($student);
    }

    // DELETE /api/registrar/students/{student}
    public function destroy(Student $student): JsonResponse
    {
        $this->authorize('delete', $student);

        $student->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request, ?Student $student = null): array
    {
        return $request->validate([
            'first_name'      => ['required', 'string', 'max:255'],
            'last_name'       => ['required', 'string', 'max:255'],
            'program_id'      => ['required', 'exists:programs,id'],
            'section_id'      => [
                'required',
                // The section must belong to the chosen program: without this
                // you could file a BSIT student into a BSCS section.
                Rule::exists('sections', 'id')->where('program_id', $request->program_id),
            ],
            'hometown'        => ['required', 'string', 'max:255'],
            'enrollment_year' => ['required', 'integer', 'min:2000', 'max:'.(date('Y') + 1)],
            'status'          => ['required', Rule::in(['active', 'inactive'])],
            'bio'             => ['nullable', 'string', 'max:500'],
        ], [
            'section_id.exists' => 'That section does not belong to the selected program.',
        ]);
    }

    private function sectionCapacityError(int|string $sectionId): ?string
    {
        $section = Section::withCount('students')->find($sectionId);

        if ($section && $section->isFull()) {
            return "Section {$section->code} is already at its capacity of {$section->capacity}.";
        }

        return null;
    }

    private function capacityResponse(string $message): JsonResponse
    {
        return response()->json([
            'message' => 'The given data was invalid.',
            'errors'  => ['section_id' => [$message]],
        ], 422);
    }
}