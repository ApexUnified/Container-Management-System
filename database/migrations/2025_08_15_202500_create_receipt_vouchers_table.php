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
        Schema::create('receipt_vouchers', function (Blueprint $table) {
            $table->id();
            $table->timestamp('receipt_date');
            $table->string('receipt_no')->nullable();
            $table->string('received_from')->nullable();
            $table->text('received_details')->nullable();
            $table->enum('received_by', ['cash', 'bank']);
            $table->json('bank_details')->nullable();
            $table->json('cash_details')->nullable();
            $table->foreignId('detail_id')->nullable()->constrained('details')->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('currency_id')->nullable()->constrained('currencies')->cascadeOnUpdate()->nullOnDelete();
            $table->decimal('amount', 20, 2);
            $table->decimal('exchange_rate', 20, 4);
            $table->decimal('total_amount', 20, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('receipt_vouchers');
    }
};
