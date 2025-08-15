<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReceiptVoucher extends Model
{
    protected $fillable = [
        'receipt_date',
        'receipt_no',
        'received_from',
        'received_details',
        'received_by',
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
            $bank_name = Detail::find($bank_id)->title;

            return [
                'bank_name' => $bank_name,
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
        static::created(function ($receipt_voucher) {
            $nextId = $receipt_voucher ? $receipt_voucher->id : 1;
            $receipt_no = 'R'.str_pad($nextId, 4, '0', STR_PAD_LEFT).'/'.date('Y');

            $receipt_voucher->receipt_no = $receipt_no;
            $receipt_voucher->save();
        });
    }

    protected $casts = [
        'bank_details' => 'array',
        'cash_details' => 'array',
        'receipt_date' => 'date:Y-m-d',
    ];
}
