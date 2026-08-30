<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('account_deletions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('state', 32)->index();
            $table->timestamp('requested_at');
            $table->timestamp('recovery_deadline')->index();
            $table->string('email', 255);
            $table->unsignedInteger('purge_attempts')->default(0);
            $table->text('last_error')->nullable();
            $table->timestamp('next_retry_at')->nullable()->index();
            $table->timestamps();
            $table->unique('user_id');
            $table->index(['state', 'recovery_deadline']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('account_deletions');
    }
};
