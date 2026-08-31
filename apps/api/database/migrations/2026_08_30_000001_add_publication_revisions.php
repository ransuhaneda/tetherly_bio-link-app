<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('profiles', function (Blueprint $table): void {
            $table->unsignedInteger('draft_revision')->default(1)->after('username');
        });

        Schema::table('publication_snapshots', function (Blueprint $table): void {
            $table->unsignedInteger('source_revision')->nullable()->after('version');
        });

        DB::table('publication_snapshots')->update(['source_revision' => DB::raw('version')]);
    }

    public function down(): void
    {
        Schema::table('publication_snapshots', function (Blueprint $table): void {
            $table->dropColumn('source_revision');
        });
        Schema::table('profiles', function (Blueprint $table): void {
            $table->dropColumn('draft_revision');
        });
    }
};
