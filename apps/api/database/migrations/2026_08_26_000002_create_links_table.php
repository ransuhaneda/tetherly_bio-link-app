<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('links', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('profile_id')->constrained()->cascadeOnDelete();
            $table->string('label', 80);
            $table->string('url', 2048);
            $table->string('icon', 64)->nullable();
            $table->string('category', 40)->nullable();
            $table->unsignedInteger('position');
            $table->boolean('enabled')->default(true);
            $table->timestamps();
            $table->unique(['profile_id', 'position']);
            $table->index(['profile_id', 'enabled', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('links');
    }
};
