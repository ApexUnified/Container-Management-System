<?php

namespace App\Models;

use Carbon\Carbon;
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

    public function getBlDateAttribute()
    {
        return $this->attributes['bl_date'] ? Carbon::parse($this->attributes['bl_date'])->format('d-m-Y') : null;
    }

    protected $casts = [
        'bl_date' => 'date',
        'containers' => 'array',
    ];
}
