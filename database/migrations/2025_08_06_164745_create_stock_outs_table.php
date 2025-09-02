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
        Schema::create('stock_outs', function (Blueprint $table) {
            $table->id();
            $table->timestamp('bl_date');
            $table->string('bl_no')->unique();
            $table->foreignId('currency_id')->nullable()->constrained('currencies')->nullOnDelete()->cascadeOnUpdate();
            $table->decimal('exchange_rate', 20, 4);
            $table->json('containers');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_outs');
    }
};
