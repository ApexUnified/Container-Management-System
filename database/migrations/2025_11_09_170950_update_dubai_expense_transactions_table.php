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
        Schema::table('dubai_expense_transactions', function (Blueprint $table) {

            if (Schema::hasColumn('dubai_expense_transactions', 'bl_expenses') && Schema::hasColumn('dubai_expense_transactions', 'ton_expenses')) {
                $table->dropColumn('bl_expenses');
                $table->dropColumn('ton_expenses');
            }
            $table->json('all_expenses')->nullable()->after('containers');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dubai_expense_transactions', function (Blueprint $table) {
            $table->dropColumn('expenses');
        });
    }
};
