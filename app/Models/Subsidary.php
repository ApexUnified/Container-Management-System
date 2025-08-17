<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subsidary extends Model
{
    protected $fillable = ['control_id', 'name', 'code', 'account_code', 'account_category'];

    public function control(): BelongsTo
    {
        return $this->belongsTo(Control::class, 'control_id', 'id');
    }

    public function details(): HasMany
    {
        return $this->hasMany(Detail::class, 'subsidary_id', 'id');
    }
}
