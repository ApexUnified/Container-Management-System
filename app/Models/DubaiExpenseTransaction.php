<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class DubaiExpenseTransaction extends Model
{
    protected $fillable = [
        'bl_no',
        'containers_count',
        'bl_date',
        'weight_in_tons',
        'containers',
        'total_amount',
        'mofa_amount',
        'applied_mofa',
        'applied_vat',
        'extra_charges_expenses',
        'total_amount_after_extra_charges',
        'bl_expenses',
        'ton_expenses',

    ];

    protected $appends = ['bl_date', 'containers'];

    public function getBlDateAttribute()
    {
        return Carbon::parse($this->attributes['bl_date'])->format('d-m-Y');
    }

    protected $casts = [
        'containers' => 'array',
        'extra_charges_expenses' => 'array',
        'bl_expenses' => 'array',
        'ton_expenses' => 'array',
    ];
}
