<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Section extends Model
{
    use HasFactory;

    protected $fillable = ['program_id', 'adviser_id', 'code', 'year_level', 'capacity'];

    protected $casts = ['capacity' => 'integer'];

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function adviser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'adviser_id');
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    // Seats left in this section. Uses the loaded students_count when the
    // caller already ran withCount(), so listings do not fire a query per row.
    public function openSlots(): int
    {
        $taken = $this->students_count ?? $this->students()->count();

        return max(0, $this->capacity - $taken);
    }

    public function isFull(): bool
    {
        return $this->openSlots() === 0;
    }
}
