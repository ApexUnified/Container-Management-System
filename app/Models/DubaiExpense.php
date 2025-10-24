<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DubaiExpense extends Model
{
    protected $fillable = [
        'name',
        'type',
        'amount',
    ];
}
