<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

// The database is snake_case; the React components written in Project 1 read
// camelCase (student.firstName, student.yearLevel, ...). This resource is the
// translation layer, which is why StudentCard and StudentModal barely change.
class StudentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'studentNo'      => $this->student_no,
            'firstName'      => $this->first_name,
            'lastName'       => $this->last_name,
            'hometown'       => $this->hometown,
            'enrollmentYear' => $this->enrollment_year,
            'status'         => $this->status,
            'bio'            => $this->bio,

            // Flattened from the relationships so the cards keep their old shape.
            'course'    => $this->whenLoaded('program', fn () => $this->program->code),
            'section'   => $this->whenLoaded('section', fn () => $this->section->code),
            'yearLevel' => $this->whenLoaded('section', fn () => $this->section->year_level),
            'adviser'   => $this->whenLoaded('section', fn () => $this->section->adviser?->name),

            // Raw keys, needed by the edit form's select inputs.
            'programId' => $this->program_id,
            'sectionId' => $this->section_id,

            // Set by withExists('favorites as is_favorite') for the signed-in user.
            'isFavorite' => (bool) ($this->is_favorite ?? false),

            'createdAt' => $this->created_at?->toDateString(),
        ];
    }
}
