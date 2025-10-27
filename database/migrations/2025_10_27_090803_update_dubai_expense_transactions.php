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
            $table->json('extra_charges_expenses')->nullable()->after('containers');
            $table->decimal('total_amount_after_extra_charges', 20, 2)->nullable()->after('extra_charges_expenses');
            $table->json('bl_expenses')->nullable()->after('total_amount_after_extra_charges');
            $table->json('ton_expenses')->nullable()->after('bl_expenses');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dubai_expense_transactions', function (Blueprint $table) {
            $table->dropColumn(['extra_charges_expenses', 'total_amount_after_extra_charges', 'bl_expenses', 'ton_expenses']);
        });
    }
};
