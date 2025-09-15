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
        Schema::create('account_settings', function (Blueprint $table) {
            $table->id();
            $table->string('vendor_expense_code')->nullable();
            $table->string('transporter_expense_code')->nullable();
            $table->string('custom_clearance_expense_code')->nullable();
            $table->string('freight_expense_code')->nullable();
            $table->string('income_code')->nullable();

            $table->timestamp('fiscal_date_from');
            $table->timestamp('fiscal_date_to');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_settings');
    }
};
