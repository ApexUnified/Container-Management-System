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
        Schema::create('stock_ins', function (Blueprint $table) {
            $table->id();
            $table->timestamp('entry_date');
            $table->string('container_no')->unique();
            $table->string('vehicle_no')->nullable();

            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete()->cascadeOnUpdate();
            $table->decimal('product_weight', 20, 2);
            $table->foreignId('product_unit_id')->nullable()->constrained('units')->nullOnDelete()->cascadeOnUpdate();
            $table->decimal('product_weight_in_man', 20, 2);
            $table->integer('product_no_of_bundles');
            $table->decimal('product_rate', 20, 2);
            $table->decimal('product_total_amount', 20, 2);

            $table->decimal('transporter_rate', 20, 2)->nullable();

            $table->decimal('custom_clearance_rate', 20, 2)->nullable();

            $table->decimal('shipping_line_rate', 20, 2);
            $table->decimal('fc_amount', 20, 2);
            $table->decimal('exchange_rate', 20, 2);
            $table->foreignId('currency_id')->nullable()->constrained('currencies')->nullOnDelete()->cascadeOnUpdate();

            $table->boolean('all_in_one')->default(false);

            $table->decimal('total_amount', 20, 2);
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_ins');
    }
};
