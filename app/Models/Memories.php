<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Memories extends Model
{
    protected $fillable = [
        'user_id',
        'memory_title',
        'memory_description',
        'memory_month',
        'memory_year',
    ];

    protected $casts = [
        'memory_year' => 'integer',
    ];

    public function images(): HasMany
    {
        return $this->hasMany(Image::class, 'memory_id')->orderBy('order');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Helper method to check if a memory exists for a specific month/year
    public static function existsForMonthYear($userId, $month, $year)
    {
        return self::where('user_id', $userId)
            ->where('memory_month', $month)
            ->where('memory_year', $year)
            ->exists();
    }

    // Helper method to get existing memory for a specific month/year
    public static function getForMonthYear($userId, $month, $year)
    {
        return self::where('user_id', $userId)
            ->where('memory_month', $month)
            ->where('memory_year', $year)
            ->first();
    }
}
