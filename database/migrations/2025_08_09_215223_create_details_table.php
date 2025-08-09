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
        Schema::create('details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('control_id')->constrained('controls')->onDelete('cascade');
            $table->foreignId('subsidary_id')->constrained('subsidaries')->onDelete('cascade');
            $table->string('code');
            $table->string('account_code');
            $table->string('title');
            $table->enum('payment_method', ['cash', 'bank']);
            $table->text('other_details')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('details');
    }
};
