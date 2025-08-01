<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Memories extends Model
{
    protected $fillable = [
        'memory_title',
        'memory_description',
        'memory_month',
    ];

    public function images(): HasMany
    {
        return $this->hasMany(Image::class, 'memory_id')->orderBy('order');
    }
}
