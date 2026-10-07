<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'programId'    => $this->program_id,
            'code'         => $this->code,
            'yearLevel'    => $this->year_level,
            'capacity'     => $this->capacity,
            'studentCount' => $this->students_count ?? null,
            'openSlots'    => $this->openSlots(),
            'adviser'      => $this->whenLoaded('adviser', fn () => $this->adviser?->name),
            'program'      => $this->whenLoaded('program', fn () => $this->program->code),
        ];
    }
}
