<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('publication_snapshots', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('profile_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('version');
            $table->string('username', 30);
            $table->string('display_name', 80);
            $table->string('bio', 280)->nullable();
            $table->string('avatar_path', 2048)->nullable();
            $table->string('theme', 32);
            $table->json('links');
            $table->timestamp('published_at');
            $table->timestamps();
            $table->unique(['profile_id', 'version']);
            $table->index(['username', 'published_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('publication_snapshots');
    }
};
