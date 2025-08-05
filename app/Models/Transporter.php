<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transporter extends Model
{
    protected $fillable = ['name', 'email', 'contact_person', 'address', 'tel_no', 'mobile_no'];

    public function stock_in(): HasMany
    {
        return $this->hasMany(StockIn::class, 'transporter_id', 'id');
    }
}
