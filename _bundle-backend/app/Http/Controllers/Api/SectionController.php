<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SectionResource;
use App\Models\Section;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

class SectionController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $sections = Section::with(['program', 'adviser'])
            ->withCount('students')
            ->when($request->query('program_id'), fn ($q, $id) => $q->where('program_id', $id))
            ->orderBy('year_level')
            ->orderBy('code')
            ->get();

        return SectionResource::collection($sections);
    }

    public function show(Section $section): SectionResource
    {
        $section->load(['program', 'adviser'])->loadCount('students');

        return new SectionResource($section);
    }

    public function store(Request $request): JsonResponse
    {
        $section = Section::create($this->validated($request));

        return (new SectionResource($section->loadCount('students')))
            ->response()->setStatusCode(201);
    }

    public function update(Request $request, Section $section): SectionResource
    {
        $section->update($this->validated($request, $section));

        return new SectionResource($section->loadCount('students'));
    }

    public function destroy(Section $section): JsonResponse
    {
        // Deleting a section cascades to its students, so block it while any
        // are still filed there and make the caller move them first.
        if ($section->students()->exists()) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors'  => ['section' => ['Move its students to another section first.']],
            ], 422);
        }

        $section->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request, ?Section $section = null): array
    {
        return $request->validate([
            'program_id' => ['required', 'exists:programs,id'],
            'code'       => [
                'required', 'string', 'max:20',
                Rule::unique('sections')
                    ->where('program_id', $request->program_id)
                    ->ignore($section?->id),
            ],
            'year_level' => ['required', Rule::in(['1st Year', '2nd Year', '3rd Year', '4th Year'])],
            'capacity'   => ['required', 'integer', 'min:1', 'max:200'],
            'adviser_id' => ['nullable', 'exists:users,id'],
        ]);
    }
}
