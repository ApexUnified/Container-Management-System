<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class StockOut extends Model
{
    protected $fillable = [
        'bl_date',
        'bl_no',
        'account_id',
        'currency_id',
        'exchange_rate',
        'containers',
        'port_name',
    ];

    protected $appends = ['containers_collection'];

    protected $with = ['currency'];

    public function getContainersCollectionAttribute()
    {
        $container_ids = collect(json_decode($this->attributes['containers'], true))->pluck('container_id')->toArray();

        return StockIn::with('product')->whereIn('id', $container_ids)->get();
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class, 'currency_id', 'id');
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Detail::class, 'account_id', 'id');
    }

    public function invoice(): HasOne
    {
        return $this->hasOne(StockOutInvoice::class, 'stock_out_id', 'id');
    }

    protected $casts = [
        'bl_date' => 'date:Y-m-d',
        'containers' => 'array',
    ];
}
