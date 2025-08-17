<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Detail extends Model
{
    protected $fillable = [
        'control_id',
        'subsidary_id',
        'code',
        'account_code',
        'title',
        'bank_cash',
        'other_details',
        'address',
        'ntn_no',
        'strn_no',
        'email',
        'mobile_no',
        'cnic_no',
        'opening_balance',
    ];

    public function control(): BelongsTo
    {
        return $this->belongsTo(Control::class, 'control_id', 'id');
    }

    public function subsidary(): BelongsTo
    {
        return $this->belongsTo(Subsidary::class, 'subsidary_id', 'id');
    }

    public function stock_vendor(): HasMany
    {
        return $this->hasMany(StockIn::class, 'vendor_id', 'id');
    }

    public function stock_custom_clearance(): HasMany
    {
        return $this->hasMany(StockIn::class, 'custom_clearance_id', 'id');
    }

    public function stock_freight_forwarder(): HasMany
    {
        return $this->hasMany(StockIn::class, 'shipping_line_id', 'id');
    }

    public function stock_transporter(): HasMany
    {
        return $this->hasMany(StockIn::class, 'transporter_id', 'id');
    }
}
