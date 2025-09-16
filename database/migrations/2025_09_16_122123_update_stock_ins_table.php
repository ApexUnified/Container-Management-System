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
        Schema::table('stock_ins', function (Blueprint $table) {
            $table->string('vendor_expense_code')->nullable()->after('vendor_id');
            $table->string('freight_forwarder_expense_code')->nullable()->after('freight_forwarder_id');
            $table->string('transporter_expense_code')->nullable()->after('transporter_id');
            $table->string('custom_clearance_expense_code')->nullable()->after('custom_clearance_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stock_ins', function (Blueprint $table) {
            $table->dropColumn('vendor_expense_code');
            $table->dropColumn('freight_forwarder_expense_code');
            $table->dropColumn('transporter_expense_code');
            $table->dropColumn('custom_clearance_expense_code');
        });
    }
};
