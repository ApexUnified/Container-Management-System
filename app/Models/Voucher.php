<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Voucher extends Model
{
    protected $fillable = [
        'payment_date',
        'payment_no',
        'paid_to',
        'payment_details',
        'payment_by',
        'bank_details',
        'cash_details',
        'detail_id',
        'currency_id',
        'amount',
        'exchange_rate',
        'total_amount',
    ];

    protected $appends = ['formated_bank_details', 'formated_cash_details'];

    public function account_detail(): BelongsTo
    {
        return $this->belongsTo(Detail::class, 'detail_id', 'id');
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class, 'currency_id', 'id');
    }

    public function getFormatedBankDetailsAttribute()
    {
        $bank_id = $this->bank_details['bank_id'] ?? null;
        if (! empty($bank_id)) {
            $bank = Detail::find($bank_id);

            return [
                'bank_name' => $bank->title,
                'bank_code' => $bank->code,
                'bank_account_code' => $bank->account_code,
                'cheque_no' => $this->bank_details['cheque_no'],
                'cheque_date' => $this->bank_details['cheque_date'],
            ];
        }

        return null;
    }

    public function getFormatedCashDetailsAttribute()
    {
        $chequebookId = $this->cash_details['chequebook_id'] ?? null;

        if (! empty($chequebookId)) {
            $chequebook_name = Detail::find($chequebookId)->title;

            return [
                'chequebook_name' => $chequebook_name,
            ];
        }

        return null;
    }

    public static function booted()
    {
        static::created(function ($voucher) {
            $nextId = $voucher ? $voucher->id : 1;
            $payment_no = 'P'.str_pad($nextId, 4, '0', STR_PAD_LEFT).'/'.date('Y');

            $voucher->payment_no = $payment_no;
            $voucher->save();
        });
    }

    public function getPaymentDateAttribute()
    {
        return Carbon::parse($this->attributes['payment_date'])->format('d-m-Y');
    }

    protected $casts = [
        'bank_details' => 'array',
        'cash_details' => 'array',
        'payment_date' => 'date',
    ];
}
