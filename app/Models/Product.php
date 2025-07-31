<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $fillable = ['name', 'unit_id'];

    protected $appends = ['added_at'];

    protected static function booted()
    {
        static::creating(function ($unit) {
            do {
                $unit->uuid = 'PRO-'.(string) mt_rand(1000000000, 9999999999);
            } while (self::where('uuid', $unit->uuid)->exists());
        });
    }

    public function getAddedAtAttribute()
    {
        return $this->created_at->format('Y-m-d');
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'unit_id', 'id');
    }
}
