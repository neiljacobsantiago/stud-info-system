<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Replaces the "section" + "yearLevel" strings. Capacity is what makes the
// "Open slots" stat on the Home page a real relational computation instead of
// a count of placeholder rows.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->constrained()->cascadeOnDelete();
            $table->foreignId('adviser_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('code', 20);             // BSIT 1-1
            $table->string('year_level', 20);       // 1st Year
            $table->unsignedSmallInteger('capacity')->default(40);
            $table->timestamps();

            $table->unique(['program_id', 'code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
};
