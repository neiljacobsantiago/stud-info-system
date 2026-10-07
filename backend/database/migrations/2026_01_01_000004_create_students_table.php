<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// student_no is stored rather than derived at render time: array positions
// shift after a delete, a stored registrar number does not.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('program_id')->constrained()->cascadeOnDelete();
            $table->foreignId('section_id')->constrained()->cascadeOnDelete();
            $table->string('student_no', 20)->nullable()->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('hometown');
            $table->year('enrollment_year');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->text('bio')->nullable();
            $table->timestamps();

            $table->index(['last_name', 'first_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
