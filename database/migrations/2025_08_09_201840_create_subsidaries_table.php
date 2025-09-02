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
        Schema::create('subsidaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('control_id')->constrained('controls')->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('name');
            $table->string('code');
            $table->string('account_code');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subsidaries');
    }
};
