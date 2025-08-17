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

            $table->foreignId('vendor_id')
                ->nullable()
                ->after('port_location')
                ->constrained('details')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->foreignId('freight_forwarder_id')
                ->nullable()
                ->after('custom_clearance_rate')
                ->constrained('details')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->renameColumn('shipping_line_rate', 'freight_forwarder_rate');

            $table->foreignId('transporter_id')
                ->nullable()
                ->after('product_total_amount')
                ->constrained('details')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            $table->foreignId('custom_clearance_id')
                ->nullable()
                ->after('transporter_rate')
                ->constrained('details')
                ->nullOnDelete()
                ->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stock_ins', function (Blueprint $table) {
            $table->dropForeign(['freight_forwarder_id', 'transporter_id', 'custom_clearance_id', 'vendor_id']);
            $table->dropColumn(['freight_forwarder_id', 'transporter_id', 'custom_clearance_id', 'vendor_id']);
        });
    }
};
