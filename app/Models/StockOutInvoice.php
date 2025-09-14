<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockOutInvoice extends Model
{
    protected $fillable = [
        'stock_out_id',
        'invoice_no',
        'invoice_date',
        'port_name',
        'customer_name',
        'customer_address',
        'payment_term',
        'hs_code',
        'items',
        'totals',
    ];

    public function stockOut(): BelongsTo
    {
        return $this->belongsTo(StockOut::class, 'stock_out_id', 'id');
    }

    protected $casts = [
        'invoice_date' => 'date',
        'items' => 'array',
        'totals' => 'array',
    ];
}
