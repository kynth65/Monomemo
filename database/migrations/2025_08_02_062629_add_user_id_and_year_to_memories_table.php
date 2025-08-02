<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('memories', function (Blueprint $table) {
            // Add user_id column after id
            $table->foreignId('user_id')->after('id')->constrained()->onDelete('cascade');

            // Add memory_year column after memory_month
            $table->integer('memory_year')->after('memory_month');

            // Add unique constraint to ensure one memory per user per month per year
            $table->unique(['user_id', 'memory_month', 'memory_year'], 'unique_user_month_year');
        });
    }

    public function down()
    {
        Schema::table('memories', function (Blueprint $table) {
            $table->dropUnique('unique_user_month_year');
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'memory_year']);
        });
    }
};
