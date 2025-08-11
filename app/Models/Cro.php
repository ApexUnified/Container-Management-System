<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cro extends Model
{
    protected $fillable = [
        'containers_count',
        'cro_no',
        'date',
    ];

    public function containers(): HasMany
    {
        return $this->hasMany(StockIn::class, 'cro_id', 'id');
    }

    protected $casts = [
        'date' => 'date:Y-m-d',
    ];
}
