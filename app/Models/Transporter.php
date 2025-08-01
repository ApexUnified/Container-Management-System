<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transporter extends Model
{
    protected $fillable = ['name', 'email', 'contact_person', 'address', 'tel_no', 'mobile_no'];

    public function getAddedAtAttribute()
    {
        return $this->created_at->format('Y-m-d');
    }
}
