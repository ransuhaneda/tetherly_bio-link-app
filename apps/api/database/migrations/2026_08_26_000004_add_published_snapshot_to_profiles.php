<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('profiles', function (Blueprint $table): void {
            $table->foreignId('published_snapshot_id')->nullable()->after('published_at')->nullOnDelete()->constrained('publication_snapshots');
        });
    }

    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table): void {
            $table->dropForeign(['published_snapshot_id']);
            $table->dropColumn('published_snapshot_id');
        });
    }
};
