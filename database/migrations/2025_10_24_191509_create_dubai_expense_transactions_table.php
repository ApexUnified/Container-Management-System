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
        Schema::create('dubai_expense_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('bl_no');
            $table->integer('containers_count');
            $table->timestamp('bl_date');
            $table->decimal('weight_in_tons', 20, 2);
            $table->decimal('total_amount', 20, 2)->default(0);
            $table->decimal('mofa_amount', 20, 2)->default(0);
            $table->decimal('applied_mofa', 20, 2)->default(0);
            $table->decimal('applied_vat', 20, 2)->default(0);
            $table->json('containers');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dubai_expense_transactions');
    }
};
