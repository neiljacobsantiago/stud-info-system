<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'program_id', 'section_id', 'first_name', 'last_name',
        'hometown', 'enrollment_year', 'status', 'bio',
    ];

    protected $casts = ['enrollment_year' => 'integer'];

    // student_no needs the auto-increment id, so it is stamped right after
    // insert. updateQuietly avoids firing the saved events a second time.
    protected static function booted(): void
    {
        static::created(function (Student $student) {
            if (! $student->student_no) {
                $student->updateQuietly([
                    'student_no' => $student->buildStudentNo(),
                ]);
            }
        });
    }

    // "ID1" + last two digits of the enrollment year + zero-padded sequence,
    // e.g. enrolled 2026, record 3 -> ID126-0003
    public function buildStudentNo(): string
    {
        $yy = substr((string) $this->enrollment_year, -2);

        return 'ID1'.$yy.'-'.str_pad((string) $this->id, 4, '0', STR_PAD_LEFT);
    }

    public function fullName(): string
    {
        return trim($this->first_name.' '.$this->last_name);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    // --- Query scopes: these are what the Browse page's controls drive ---

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (! $term) {
            return $query;
        }

        return $query->where(function (Builder $sub) use ($term) {
            $sub->where('first_name', 'like', "%{$term}%")
                ->orWhere('last_name', 'like', "%{$term}%")
                ->orWhere('hometown', 'like', "%{$term}%")
                ->orWhere('student_no', 'like', "%{$term}%");
        });
    }

    public function scopeYearLevel(Builder $query, ?string $yearLevel): Builder
    {
        if (! $yearLevel || $yearLevel === 'all') {
            return $query;
        }

        // Pulls the filter through the relationship instead of duplicating
        // year_level onto the students table.
        return $query->whereRelation('section', 'year_level', $yearLevel);
    }

    public function scopeStatus(Builder $query, ?string $status): Builder
    {
        if (! $status || $status === 'all') {
            return $query;
        }

        return $query->where('status', $status);
    }

    public function scopeSorted(Builder $query, ?string $sort): Builder
    {
        return match ($sort) {
            'name-desc'      => $query->orderBy('last_name', 'desc')->orderBy('first_name', 'desc'),
            'student-id-asc' => $query->orderBy('student_no', 'asc'),
            default          => $query->orderBy('last_name')->orderBy('first_name'),
        };
    }
}
