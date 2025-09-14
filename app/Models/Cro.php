<?php

namespace App\Models;

use Carbon\Carbon;
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

    public function getDateAttribute()
    {
        return $this->attributes['date'] ? Carbon::parse($this->attributes['date'])->format('d-m-Y') : null;
    }

    protected $casts = [
        'date' => 'date',
    ];
}
