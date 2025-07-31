<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    protected $fillable = ['name', 'email', 'contact_person', 'address', 'tel_no', 'mobile_no'];

    protected $appends = ['added_at'];

    protected static function booted()
    {
        static::creating(function ($vendor) {
            do {
                $vendor->uuid = 'Ven-'.(string) mt_rand(1000000000, 9999999999);
            } while (self::where('uuid', $vendor->uuid)->exists());
        });
    }

    public function getAddedAtAttribute()
    {
        return $this->created_at->format('Y-m-d');
    }
}
