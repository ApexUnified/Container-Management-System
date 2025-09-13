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
        Schema::create('stock_out_invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_out_id')->constrained('stock_outs')->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('invoice_no');
            $table->date('invoice_date');
            $table->string('port_name');
            $table->string('customer_name');
            $table->string('customer_address')->nullable();
            $table->string('payment_term');
            $table->string('hs_code');
            $table->json('items');
            $table->json('totals');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_out_invoices');
    }
};
