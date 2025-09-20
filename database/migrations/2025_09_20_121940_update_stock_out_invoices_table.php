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
        Schema::table('stock_out_invoices', function (Blueprint $table) {
            $table->string('income_code')->after('customer_address')->nullable();
            $table->string('account_code')->after('customer_address')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stock_out_invoices', function (Blueprint $table) {
            $table->dropColumn(['income_code', 'account_code']);
        });
    }
};
