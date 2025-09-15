<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccountSetting extends Model
{
    protected $fillable = [
        'id',
        'vendor_expense_code',
        'transporter_expense_code',
        'custom_clearance_expense_code',
        'freight_expense_code',
        'income_code',
        'fiscal_date_from',
        'fiscal_date_to',
    ];

    public function getFiscalDateFromAttribute()
    {
        return \Carbon\Carbon::parse($this->attributes['fiscal_date_from'])->format('d-m-Y');
    }

    public function getFiscalDateToAttribute()
    {
        return \Carbon\Carbon::parse($this->attributes['fiscal_date_to'])->format('d-m-Y');
    }

    protected $casts = [
        'fiscal_date_from' => 'date',
        'fiscal_date_to' => 'date',
    ];
}
