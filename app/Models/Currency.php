<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Currency extends Model
{
    protected $fillable = ['name'];

    public function stock_in(): HasMany
    {
        return $this->hasMany(StockIn::class, 'currency_id', 'id');
    }
}
