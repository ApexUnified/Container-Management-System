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
            $table->enum('port_location', ['KICT', 'KDGL'])->nullable()->change();
            $table->decimal('freight_forwarder_rate', 20, 2)->nullable()->change();
            $table->decimal('fc_amount', 20, 2)->nullable()->change();
            $table->decimal('exchange_rate', 20, 2)->nullable()->change();
            $table->string('container_size')->nullable()->after('cro_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stock_ins', function (Blueprint $table) {
            $table->enum('port_location', ['KICT', 'KTGL'])->nullable()->change();
            $table->decimal('freight_forwarder_rate', 20, 2)->nullable(false)->change();
            $table->decimal('fc_amount', 20, 2)->nullable(false)->change();
            $table->decimal('exchange_rate', 20, 2)->nullable(false)->change();
            $table->dropColumn('container_size');
        });
    }
};
