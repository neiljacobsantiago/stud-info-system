<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Per-user saved records. The unique key is what stops the same student being
// filed twice by one user, and it is enforced by the database, not the UI.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'student_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};
