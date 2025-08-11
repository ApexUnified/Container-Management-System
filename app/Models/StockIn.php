<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockIn extends Model
{
    protected $fillable = [
        'entry_date',
        'container_no',
        'vehicle_no',
        'cro_id',
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
        'shipping_line_id',
        'shipping_line_rate',
        'fc_amount',
        'exchange_rate',
        'currency_id',
        'all_in_one',
        'total_amount',
        'note',
    ];

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class, 'vendor_id', 'id');
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
        return $this->belongsTo(Transporter::class, 'transporter_id', 'id');
    }

    public function custom_clearance(): BelongsTo
    {
        return $this->belongsTo(CustomClearance::class, 'custom_clearance_id', 'id');
    }

    public function shipping_line(): BelongsTo
    {
        return $this->belongsTo(ShippingLine::class, 'shipping_line_id', 'id');
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class, 'currency_id', 'id');
    }

    public function cro(): BelongsTo
    {
        return $this->belongsTo(Cro::class, 'cro_id', 'id');
    }

    protected $casts = [
        'entry_date' => 'date:Y-m-d',
    ];
}
