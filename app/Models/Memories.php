<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Memories extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'memory_title',
        'memory_description',
        'memory_month',
        'memory_year',
        'archived_at'
    ];

    protected $casts = [
        'archived_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(Image::class, 'memory_id');
    }

    // Check if memory exists for specific month/year (excluding archived ones)
    public static function existsForMonthYear($userId, $month, $year)
    {
        return self::where('user_id', $userId)
            ->where('memory_month', $month)
            ->where('memory_year', $year)
            ->whereNull('archived_at') // Only check non-archived memories
            ->exists();
    }

    // Scope for active (non-archived) memories
    public function scopeActive($query)
    {
        return $query->whereNull('archived_at');
    }

    // Scope for archived memories
    public function scopeArchived($query)
    {
        return $query->whereNotNull('archived_at');
    }

    // Archive the memory
    public function archive()
    {
        $this->update(['archived_at' => now()]);
    }

    // Restore from archive
    public function restore()
    {
        $this->update(['archived_at' => null]);
    }

    // Check if memory is archived
    public function isArchived()
    {
        return !is_null($this->archived_at);
    }
}
