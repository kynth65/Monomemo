<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('memories', function (Blueprint $table) {
            $table->dropColumn(['image_url', 'image_public_id']);
        });
    }

    public function down(): void
    {
        Schema::table('memories', function (Blueprint $table) {
            $table->string('image_url')->nullable();
            $table->string('image_public_id')->nullable();
        });
    }
};
