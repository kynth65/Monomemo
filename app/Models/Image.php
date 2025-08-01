<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Image extends Model
{
    protected $fillable = [
        'memory_id',
        'image_url',
        'image_public_id',
        'order',
    ];

    public function memory(): BelongsTo
    {
        return $this->belongsTo(Memories::class, 'memory_id');
    }
}
