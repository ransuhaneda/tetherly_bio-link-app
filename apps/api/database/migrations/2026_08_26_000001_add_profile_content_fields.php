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
            $table->string('display_name', 80)->nullable()->after('username');
            $table->string('bio', 280)->nullable()->after('display_name');
            $table->string('avatar_path', 2048)->nullable()->after('bio');
            $table->string('theme', 32)->default('editorial-bento')->after('avatar_path');
            $table->string('publication_state', 16)->default('draft')->index()->after('theme');
            $table->timestamp('published_at')->nullable()->after('publication_state');
        });

        DB::table('profiles')->update(['username' => DB::raw('LOWER(TRIM(username))')]);
    }

    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table): void {
            $table->dropIndex(['publication_state']);
            $table->dropColumn(['display_name', 'bio', 'avatar_path', 'theme', 'publication_state', 'published_at']);
        });
    }
};
