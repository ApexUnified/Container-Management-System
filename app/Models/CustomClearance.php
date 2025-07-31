<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomClearance extends Model
{
    protected $fillable = ['name', 'email', 'contact_person', 'address', 'tel_no', 'mobile_no'];

    protected $appends = ['added_at'];

    protected static function booted()
    {
        static::creating(function ($custom_clearance) {
            do {
                $custom_clearance->uuid = 'CC-'.(string) mt_rand(1000000000, 9999999999);
            } while (self::where('uuid', $custom_clearance->uuid)->exists());
        });
    }

    public function getAddedAtAttribute()
    {
        return $this->created_at->format('Y-m-d');
    }
}
