<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Control extends Model
{
    protected $fillable = ['name', 'nature_of_account'];

    public function subsidaries(): HasMany
    {
        return $this->hasMany(Subsidary::class, 'control_id', 'id');
    }

    public function details(): HasMany
    {
        return $this->hasMany(Detail::class, 'control_id', 'id');
    }
}
