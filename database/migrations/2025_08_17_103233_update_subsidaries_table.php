<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('subsidaries', function (Blueprint $table) {
            $table->enum('account_category', ['V', 'T', 'C', 'F', 'R'])->nullable()->after('account_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subsidaries', function (Blueprint $table) {
            $table->dropColumn('account_category');
        });
    }
};
