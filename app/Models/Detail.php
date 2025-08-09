<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Detail extends Model
{
    protected $fillable = [
        'control_id',
        'subsidary_id',
        'code',
        'account_code',
        'title',
        'payment_method',
        'other_details',
    ];

    protected $appends = [
        'added_at',
    ];

    public function getAddedAtAttribute()
    {
        return $this->created_at->format('Y-m-d');
    }

    public function control(): BelongsTo
    {
        return $this->belongsTo(Control::class, 'control_id', 'id');
    }

    public function subsidary(): BelongsTo
    {
        return $this->belongsTo(Subsidary::class, 'subsidary_id', 'id');
    }
}
