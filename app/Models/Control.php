<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Control extends Model
{
    protected $fillable = ['name'];

    protected $appends = ['added_at'];

    public function getAddedAtAttribute()
    {
        return $this->created_at->format('Y-m-d');
    }

    public function subsidaries(): HasMany
    {
        return $this->hasMany(Subsidary::class, 'control_id', 'id');
    }

    public function details(): HasMany
    {
        return $this->hasMany(Detail::class, 'control_id', 'id');
    }
}
