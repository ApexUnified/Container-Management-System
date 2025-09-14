<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockIn extends Model
{
    protected $fillable = [
        'entry_date',
        'container_no',
        'vehicle_no',
        'cro_id',
        'container_size',
        'port_location',
        'vendor_id',
        'product_id',
        'product_weight',
        'product_unit_id',
        'product_weight_in_man',
        'product_no_of_bundles',
        'product_rate',
        'product_total_amount',
        'transporter_id',
        'transporter_rate',
        'custom_clearance_id',
        'custom_clearance_rate',
        'freight_forwarder_id',
        'freight_forwarder_rate',
        'fc_amount',
        'exchange_rate',
        'currency_id',
        'all_in_one',
        'total_amount',
        'note',
    ];

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Detail::class, 'vendor_id', 'id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'product_unit_id', 'id');
    }

    public function transporter(): BelongsTo
    {
        return $this->belongsTo(Detail::class, 'transporter_id', 'id');
    }

    public function custom_clearance(): BelongsTo
    {
        return $this->belongsTo(Detail::class, 'custom_clearance_id', 'id');
    }

    public function freight_forwarder(): BelongsTo
    {
        return $this->belongsTo(Detail::class, 'freight_forwarder_id', 'id');
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class, 'currency_id', 'id');
    }

    public function cro(): BelongsTo
    {
        return $this->belongsTo(Cro::class, 'cro_id', 'id');
    }

    public function getEntryDateAttribute()
    {
        return Carbon::parse($this->attributes['entry_date'])->format('d-m-Y');
    }

    protected $casts = [
        'entry_date' => 'date',
    ];
}
