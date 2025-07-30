<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Memories extends Model
{
    protected $fillable = [
        'memory_title',
        'memory_description',
        'memory_month',
    ];
}
