<?php

namespace App\Http\Controllers;

use App\Models\AccountSetting;
use App\Models\Detail;
use App\Models\ReceiptVoucher;
use App\Models\StockIn;
use App\Models\StockOutInvoice;
use App\Models\Voucher;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountLedgerController extends Controller
{
    public function index(Request $request)
    {
        $details = Detail::orderBy('code', 'asc')->get()->map(function ($detail) {
            return [
                'id' => $detail->account_code,
                'name' => $detail->title.' - '.$detail->account_code,
            ];
        });

        $account_setting = AccountSetting::select(['fiscal_date_from', 'fiscal_date_to'])->first();

        return Inertia::render('Reports/AccountLedgers/index', compact('details', 'account_setting'));
    }

    public function generateReport(Request $request)
    {

        $request->validate([
            'from_date' => ['required', 'date:d-m-Y'],
            'to_date' => ['required', 'date:d-m-Y', 'after_or_equal:from_date'],
            'from_account_code' => ['required'],
            'to_account_code' => ['required', 'after_or_equal:from_account_code'],
        ], [
            'to_date.after_or_equal' => 'To date must be greater than or equal to From date',
        ]);

        try {
            $fromCode = $request->from_account_code ? str_replace('-', '', $request->from_account_code) : null;
            $toCode = $request->to_account_code ? str_replace('-', '', $request->to_account_code) : null;

            if ($fromCode && $toCode && $fromCode > $toCode) {
                return response()->json(['status' => false, 'message' => 'From account code must be less than or equal to To account code']);
            }

            $containers_data = StockIn::whereBetween('entry_date', [Carbon::parse($request->from_date)->format('Y-m-d'), Carbon::parse($request->to_date)->format('Y-m-d')])
                ->when($fromCode && $toCode, function ($query) use ($fromCode, $toCode) {
                    $query->where(function ($sub) use ($fromCode, $toCode) {
                        // if codes are same → exact match, else → range
                        $filter = function ($q) use ($fromCode, $toCode) {
                            if ($fromCode === $toCode) {
                                $q->where('code', $fromCode);
                            } else {
                                $q->whereBetween('code', [$fromCode, $toCode]);
                            }
                        };

                        $sub->whereHas('vendor', $filter)
                            ->orWhereHas('transporter', $filter)
                            ->orWhereHas('freight_forwarder', $filter)
                            ->orWhereHas('custom_clearance', $filter);
                    });
                })
                ->orderBy('entry_date', 'asc')
                ->with(['product', 'unit', 'vendor', 'transporter', 'freight_forwarder', 'custom_clearance'])
                ->get();
            // dd($containers_data->toArray());

            $containers_transformed = $containers_data->flatMap(function ($container) use ($fromCode, $toCode) {
                $checkRange = fn ($code) => $fromCode === $toCode ? $code === $fromCode : ($code >= $fromCode && $code <= $toCode);

                $entries = [];

                $vendor_expense_code = str_replace('-', '', $container->vendor_expense_code);
                $transporter_expense_code = str_replace('-', '', $container->transporter_expense_code);
                $custom_clearance_expense_code = str_replace('-', '', $container->custom_clearance_expense_code);
                $freight_forwarder_expense_code = str_replace('-', '', $container->freight_forwarder_expense_code);

                if ($checkRange($container->vendor->code ?? null)) {
                    $vendor_code_matched = $container->vendor->account_code == $container->vendor_expense_code;

                    $entries[] = [
                        'id' => $container->id,
                        'account_code' => $container->vendor->account_code,
                        'account_title' => $container->vendor->title,
                        'opening_balance' => $container->vendor->opening_balance,
                        'entry_date' => $container->entry_date,
                        'narration' => 'CONTNO: '.$container->container_no.', '.$container->product->name.', '.
                                       $container->product_weight.' '.$container->unit->name.', '.
                                       'MANN: '.$container->product_weight_in_man.', '.
                                       $container->product_no_of_bundles.' BUNDLES',
                        'credit' => $container->product_total_amount,
                        'debit' => $vendor_code_matched ? $container->product_total_amount : null,
                    ];
                }

                if ($checkRange($vendor_expense_code)) {
                    $detail = Detail::where('account_code', $container->vendor_expense_code)->first();

                    $entries[] = [
                        'id' => $container->id,
                        'account_code' => $container->vendor_expense_code,
                        'account_title' => $detail->title ?? 'Vendor Expense',
                        'opening_balance' => $detail->opening_balance ?? 0,
                        'entry_date' => $container->entry_date,
                        'narration' => 'CONTNO: '.$container->container_no.', '.$container->product->name.', '.
                                       $container->product_weight.' '.$container->unit->name.', '.
                                       'MANN: '.$container->product_weight_in_man.', '.
                                       $container->product_no_of_bundles.' BUNDLES',
                        'credit' => null,
                        'debit' => $container->product_total_amount,
                    ];
                }

                if ($checkRange($container->transporter->code ?? null)) {
                    $transporter_code_matched = $container->transporter->account_code == $container->transporter_expense_code;

                    $entries[] = [
                        'id' => $container->id,
                        'account_code' => $container->transporter->account_code,
                        'account_title' => $container->transporter->title,
                        'opening_balance' => $container->transporter->opening_balance,
                        'entry_date' => $container->entry_date,
                        'narration' => 'CONTNO: '.$container->container_no.', '.$container->product->name.', '.
                                       $container->product_weight.' '.$container->unit->name.', '.
                                       'MANN: '.$container->product_weight_in_man.', '.
                                       $container->product_no_of_bundles.' BUNDLES',
                        'credit' => $container->transporter_rate,
                        'debit' => $transporter_code_matched ? $container->transporter_rate : null,
                    ];
                }

                if ($checkRange($transporter_expense_code)) {
                    $detail = Detail::where('account_code', $container->transporter_expense_code)->first();

                    $entries[] = [
                        'id' => $container->id,
                        'account_code' => $container->transporter_expense_code,
                        'account_title' => $detail->title ?? 'Transporter Expense',
                        'opening_balance' => $detail->opening_balance ?? 0,
                        'entry_date' => $container->entry_date,
                        'narration' => 'CONTNO: '.$container->container_no.', '.$container->product->name.', '.
                                       $container->product_weight.' '.$container->unit->name.', '.
                                       'MANN: '.$container->product_weight_in_man.', '.
                                       $container->product_no_of_bundles.' BUNDLES',
                        'credit' => null,
                        'debit' => $container->transporter_rate,
                    ];
                }

                if ($checkRange($container->freight_forwarder->code ?? null)) {
                    $freight_forwarder_code_matched = $container->freight_forwarder->account_code == $container->freight_forwarder_expense_code;

                    $entries[] = [
                        'id' => $container->id,
                        'account_code' => $container->freight_forwarder->account_code,
                        'account_title' => $container->freight_forwarder->title,
                        'entry_date' => $container->entry_date,
                        'opening_balance' => $container->freight_forwarder->opening_balance,
                        'narration' => 'CONTNO: '.$container->container_no.', '.$container->product->name.', '.
                                       $container->product_weight.' '.$container->unit->name.', '.
                                       'MANN: '.$container->product_weight_in_man.', '.
                                       $container->product_no_of_bundles.' BUNDLES',
                        'credit' => $container->freight_forwarder_rate,
                        'debit' => $freight_forwarder_code_matched ? $container->freight_forwarder_rate : null,
                    ];
                }

                if ($checkRange($freight_forwarder_expense_code)) {
                    $detail = Detail::where('account_code', $container->freight_forwarder_expense_code)->first();

                    $entries[] = [
                        'id' => $container->id,
                        'account_code' => $container->freight_forwarder_expense_code,
                        'account_title' => $detail->title ?? 'Freight Forwarder Expense',
                        'opening_balance' => $detail->opening_balance ?? 0,
                        'entry_date' => $container->entry_date,
                        'narration' => 'CONTNO: '.$container->container_no.', '.$container->product->name.', '.
                                       $container->product_weight.' '.$container->unit->name.', '.
                                       'MANN: '.$container->product_weight_in_man.', '.
                                       $container->product_no_of_bundles.' BUNDLES',
                        'credit' => null,
                        'debit' => $container->freight_forwarder_rate,
                    ];
                }

                if ($checkRange($container->custom_clearance->code ?? null)) {
                    $custom_clearance_code_matched = $container->custom_clearance->account_code == $container->custom_clearance_expense_code;

                    $entries[] = [
                        'id' => $container->id,
                        'account_code' => $container->custom_clearance->account_code,
                        'account_title' => $container->custom_clearance->title,
                        'entry_date' => $container->entry_date,
                        'opening_balance' => $container->custom_clearance->opening_balance,
                        'narration' => 'CONTNO: '.$container->container_no.', '.$container->product->name.', '.
                                       $container->product_weight.' '.$container->unit->name.', '.
                                       'MANN: '.$container->product_weight_in_man.', '.
                                       $container->product_no_of_bundles.' BUNDLES',
                        'credit' => $container->custom_clearance_rate,
                        'debit' => $custom_clearance_code_matched ? $container->custom_clearance_rate : null,
                    ];
                }

                if ($checkRange($custom_clearance_expense_code)) {
                    $detail = Detail::where('account_code', $container->custom_clearance_expense_code)->first();

                    $entries[] = [
                        'id' => $container->id,
                        'account_code' => $container->custom_clearance_expense_code,
                        'account_title' => $detail->title ?? 'Custom Clearance Expense',
                        'opening_balance' => $detail->opening_balance ?? 0,
                        'entry_date' => $container->entry_date,
                        'narration' => 'CONTNO: '.$container->container_no.', '.$container->product->name.', '.
                                       $container->product_weight.' '.$container->unit->name.', '.
                                       'MANN: '.$container->product_weight_in_man.', '.
                                       $container->product_no_of_bundles.' BUNDLES',
                        'credit' => null,
                        'debit' => $container->custom_clearance_rate,
                    ];
                }

                return $entries; // flatMap will flatten this array automatically
            });

            $payment_vouchers = Voucher::whereBetween('payment_date', [Carbon::parse($request->from_date)->format('Y-m-d'), Carbon::parse($request->to_date)->format('Y-m-d')])
                ->where(function ($query) use ($fromCode, $toCode) {
                    $query->whereHas('account_detail', function ($q) use ($fromCode, $toCode) {
                        $q->whereBetween('code', [$fromCode, $toCode]);
                    })
                        ->orWhereRaw("
            EXISTS (
                SELECT 1
                FROM details
                WHERE details.id = CAST(JSON_UNQUOTE(JSON_EXTRACT(vouchers.bank_details, '$.bank_id')) AS UNSIGNED)
                AND details.code BETWEEN ? AND ?
            )
            ", [$fromCode, $toCode]);
                })
                ->orderBy('payment_date', 'asc')
                ->get();

            $payment_vouchers_transformed = $payment_vouchers->flatMap(function ($voucher) use ($fromCode, $toCode) {
                $entries = [];

                // Check account_detail
                if ($voucher->account_detail && $voucher->account_detail->code >= $fromCode && $voucher->account_detail->code <= $toCode) {
                    $entries[] = collect([
                        'id' => $voucher->payment_no,
                        'account_code' => $voucher->account_detail->account_code,
                        'account_title' => $voucher->account_detail->title,
                        'entry_date' => $voucher->payment_date,
                        'narration' => $voucher->payment_details,
                        'debit' => $voucher->total_amount,
                        'credit' => null,
                    ]);
                }

                // Check bank_id (could match another account)
                $bank_id = $voucher->bank_details['bank_id'] ?? null;
                if ($bank_id) {
                    $bank = Detail::find($bank_id);
                    if ($bank && $bank->code >= $fromCode && $bank->code <= $toCode) {
                        $entries[] = collect([
                            'id' => $voucher->payment_no,
                            'account_code' => $bank->account_code,
                            'account_title' => $bank->title,
                            'entry_date' => $voucher->payment_date,
                            'narration' => $voucher->payment_details,
                            'debit' => null,
                            'credit' => $voucher->total_amount,
                        ]);
                    }
                }

                return $entries; // flatMap ensures all entries are included
            });

            $receipt_vouchers = ReceiptVoucher::whereBetween('receipt_date', [Carbon::parse($request->from_date)->format('Y-m-d'), Carbon::parse($request->to_date)->format('Y-m-d')])
                ->where(function ($query) use ($fromCode, $toCode) {
                    $query->whereHas('account_detail', function ($q) use ($fromCode, $toCode) {
                        $q->whereBetween('code', [$fromCode, $toCode]);
                    })
                        ->orWhereRaw("
            EXISTS (
                SELECT 1
                FROM details
                WHERE details.id = CAST(JSON_UNQUOTE(JSON_EXTRACT(receipt_vouchers.bank_details, '$.bank_id')) AS UNSIGNED)
                AND details.code BETWEEN ? AND ?
            )
            ", [$fromCode, $toCode]);
                })
                ->orderBy('receipt_date', 'asc')
                ->get();

            $receipt_vouchers_transformed = $receipt_vouchers->flatMap(function ($voucher) use ($fromCode, $toCode) {
                $entries = [];

                // Check account_detail
                if ($voucher->account_detail && $voucher->account_detail->code >= $fromCode && $voucher->account_detail->code <= $toCode) {
                    $entries[] = collect([
                        'id' => $voucher->receipt_no,
                        'account_code' => $voucher->account_detail->account_code,
                        'account_title' => $voucher->account_detail->title,
                        'entry_date' => $voucher->receipt_date,
                        'narration' => $voucher->received_details,
                        'debit' => null,
                        'credit' => $voucher->total_amount,
                    ]);
                }

                // Check bank_id (could match another account)
                $bank_id = $voucher->bank_details['bank_id'] ?? null;
                if ($bank_id) {
                    $bank = Detail::find($bank_id);
                    if ($bank && $bank->code >= $fromCode && $bank->code <= $toCode) {
                        $entries[] = collect([
                            'id' => $voucher->receipt_no,
                            'account_code' => $bank->account_code,
                            'account_title' => $bank->title,
                            'entry_date' => $voucher->receipt_date,
                            'narration' => $voucher->received_details,
                            'debit' => $voucher->total_amount,
                            'credit' => null,
                        ]);
                    }
                }

                return $entries; // flatMap ensures all entries are included
            });

            // Working Without Receipt
            // $merged_data = $containers_transformed->isEmpty()
            // ? $payment_vouchers_transformed
            // : ($payment_vouchers_transformed->isNotEmpty() ? $payment_vouchers_transformed->merge($containers_transformed) :
            //     ($receipt_vouchers->isNotEmpty() ? $receipt_vouchers_transformed->merge($containers_transformed) : $containers_transformed));

            $merged_data = collect()
                ->merge(collect($containers_transformed)->map(function ($item) {
                    return $item instanceof \Illuminate\Database\Eloquent\Model
                        ? $item->toArray()
                        : $item;
                }))
                ->merge(collect($payment_vouchers_transformed)->map(function ($item) {
                    return $item instanceof \Illuminate\Database\Eloquent\Model
                        ? $item->toArray()
                        : $item;
                }))
                ->merge(collect($receipt_vouchers_transformed)->map(function ($item) {
                    return $item instanceof \Illuminate\Database\Eloquent\Model
                        ? $item->toArray()
                        : $item;
                }))
                ->sortBy('entry_date')
                ->values();

            $grouped = $merged_data->groupBy(fn ($item) => $item['account_code'] ?? 'no_account');

            $previous_containers = StockIn::whereDate('entry_date', '<', Carbon::parse($request->from_date)->format('Y-m-d'))
                ->when($fromCode && $toCode, function ($query) use ($fromCode, $toCode) {
                    $query->where(function ($sub) use ($fromCode, $toCode) {
                        $filter = function ($q) use ($fromCode, $toCode) {
                            if ($fromCode === $toCode) {
                                $q->where('code', $fromCode);
                            } else {
                                $q->whereBetween('code', [$fromCode, $toCode]);
                            }
                        };

                        $sub->where(function ($inner) use ($filter) {
                            $inner->whereHas('vendor', $filter)
                                ->orWhereHas('transporter', $filter)
                                ->orWhereHas('freight_forwarder', $filter)
                                ->orWhereHas('custom_clearance', $filter);
                        });
                    });
                })
                ->with(['vendor', 'transporter', 'freight_forwarder', 'custom_clearance'])
                ->get();

            $previous_vouchers = Voucher::whereDate('payment_date', '<', Carbon::parse($request->from_date)->format('Y-m-d'))
                ->where(function ($query) use ($fromCode, $toCode) {
                    $query->whereHas('account_detail', function ($q) use ($fromCode, $toCode) {
                        $q->whereBetween('code', [$fromCode, $toCode]);
                    })
                        ->orWhereRaw("
            EXISTS (
                SELECT 1
                FROM details
                WHERE details.id = CAST(JSON_UNQUOTE(JSON_EXTRACT(vouchers.bank_details, '$.bank_id')) AS UNSIGNED)
                AND details.code BETWEEN ? AND ?
            )
        ", [$fromCode, $toCode]);
                })
                ->get();

            $previous_receipt_vouchers = ReceiptVoucher::whereDate('receipt_date', '<', Carbon::parse($request->from_date)->format('Y-m-d'))
                ->where(function ($query) use ($fromCode, $toCode) {
                    $query->whereHas('account_detail', function ($q) use ($fromCode, $toCode) {
                        $q->whereBetween('code', [$fromCode, $toCode]);
                    })
                        ->orWhereRaw("
            EXISTS (
                SELECT 1
                FROM details
                WHERE details.id = CAST(JSON_UNQUOTE(JSON_EXTRACT(receipt_vouchers.bank_details, '$.bank_id')) AS UNSIGNED)
                AND details.code BETWEEN ? AND ?
            )
        ", [$fromCode, $toCode]);
                })
                ->get();

            // --- Step 1: Previous containers with account_code ---
            $previous_entries = $previous_containers->flatMap(function ($container) use ($fromCode, $toCode) {
                $checkRange = fn ($code) => $fromCode === $toCode ? $code === $fromCode : ($code >= $fromCode && $code <= $toCode);
                $entry_date = $container->entry_date ?? now()->subDay();
                $entries = [];

                if ($checkRange($container->vendor->code ?? null)) {
                    $entries[] = [
                        'account_code' => $container->vendor->account_code,
                        'debit' => null,
                        'credit' => $container->product_total_amount,
                        'entry_date' => $entry_date,
                    ];
                }

                if ($checkRange($container->transporter->code ?? null)) {
                    $entries[] = [
                        'account_code' => $container->transporter->account_code,
                        'debit' => null,
                        'credit' => $container->transporter_rate,
                        'entry_date' => $entry_date,
                    ];
                }

                if ($checkRange($container->freight_forwarder->code ?? null)) {
                    $entries[] = [
                        'account_code' => $container->freight_forwarder->account_code,
                        'debit' => null,
                        'credit' => $container->freight_forwarder_rate,
                        'entry_date' => $entry_date,
                    ];
                }

                if ($checkRange($container->custom_clearance->code ?? null)) {
                    $entries[] = [
                        'account_code' => $container->custom_clearance->account_code,
                        'debit' => null,
                        'credit' => $container->custom_clearance_rate,
                        'entry_date' => $entry_date,
                    ];
                }

                return $entries;
            });

            // --- Step 2: Previous vouchers with account_code ---
            $previous_voucher_entries = $previous_vouchers->flatMap(function ($voucher) use ($fromCode, $toCode) {
                $entries = [];
                $payment_date = $voucher->payment_date ?? now()->subDay();

                // Check account_detail
                if ($voucher->account_detail && $voucher->account_detail->code >= $fromCode && $voucher->account_detail->code <= $toCode) {
                    $entries[] = [
                        'account_code' => $voucher->account_detail->account_code,
                        'debit' => $voucher->total_amount,
                        'credit' => null,
                        'entry_date' => $payment_date,
                    ];
                }

                // Check bank (can be another account)
                $bank_id = $voucher->bank_details['bank_id'] ?? null;
                if ($bank_id) {
                    $bank = Detail::find($bank_id);
                    if ($bank && $bank->code >= $fromCode && $bank->code <= $toCode) {
                        $entries[] = [
                            'account_code' => $bank->account_code,
                            'debit' => null,
                            'credit' => $voucher->total_amount,
                            'entry_date' => $payment_date,
                        ];
                    }
                }

                return $entries; // flatMap ensures all matching entries are included
            });

            // --- Step 3: Previous Receipt vouchers with account_code ---
            $previous_receipt_voucher_entries = $previous_receipt_vouchers->flatMap(function ($voucher) use ($fromCode, $toCode) {
                $entries = [];
                $receipt_date = $voucher->receipt_date ?? now()->subDay();

                // Check account_detail
                if ($voucher->account_detail && $voucher->account_detail->code >= $fromCode && $voucher->account_detail->code <= $toCode) {
                    $entries[] = [
                        'account_code' => $voucher->account_detail->account_code,
                        'debit' => null,
                        'credit' => $voucher->total_amount,
                        'entry_date' => $receipt_date,
                    ];
                }

                // Check bank (can be another account)
                $bank_id = $voucher->bank_details['bank_id'] ?? null;
                if ($bank_id) {
                    $bank = Detail::find($bank_id);
                    if ($bank && $bank->code >= $fromCode && $bank->code <= $toCode) {
                        $entries[] = [
                            'account_code' => $bank->account_code,
                            'debit' => $voucher->total_amount,
                            'credit' => null,
                            'entry_date' => $receipt_date,
                        ];
                    }
                }

                return $entries; // flatMap ensures all matching entries are included
            });

            // Step 1: Fetch all account base openings once
            $account_openings = Detail::query();

            if ($fromCode && $toCode) {
                if ($fromCode === $toCode) {
                    $account_openings = $account_openings->where('code', $fromCode);
                } else {
                    $account_openings = $account_openings->whereBetween('code', [$fromCode, $toCode]);
                }
            }

            $account_openings = $account_openings->pluck('opening_balance', 'account_code');

            // Step 2: Compute previous debits/credits per account
            $previous_totals = collect($previous_entries)
                ->merge($previous_voucher_entries)
                ->merge($previous_receipt_voucher_entries)
                ->filter(fn ($item) => isset($item['entry_date']) && $item['entry_date'] < $request->from_date)
                ->groupBy('account_code')
                ->map(function ($entries) {
                    $total_debit = $entries->sum(fn ($e) => floatval($e['debit'] ?? 0));
                    $total_credit = $entries->sum(fn ($e) => floatval($e['credit'] ?? 0));

                    return $total_debit - $total_credit;
                });

            // Step 3: Merge both to get final opening balances
            $opening_balances = $account_openings->mapWithKeys(function ($base_opening, $accountCode) use ($previous_totals) {
                $prev_total = $previous_totals[$accountCode] ?? 0;

                return [$accountCode => $base_opening + $prev_total];
            });

            $allGrouped = collect($opening_balances->keys())
                ->mapWithKeys(fn ($code) => [$code => collect()])
                ->merge($grouped);

            $final_data = $allGrouped->map(function ($items, $accountCode) use ($request, $opening_balances) {

                $items = $items->sortBy('entry_date')->values();

                $account_opening = $opening_balances[$accountCode] ?? 0;
                $data = [
                    'account_code' => $accountCode,
                    'now' => Carbon::now()->format('d-m-Y'),
                    'from_date' => Carbon::parse($request->from_date)->format('d-m-Y'),
                    'to_date' => Carbon::parse($request->to_date)->format('d-m-Y'),
                    'account_title' => $items->first()['account_title'] ?? 'N/A',
                    'transactions' => $items->map(fn ($item) => [
                        'id' => $item['id'],
                        'entry_date' => $item['entry_date'],
                        'opening_balance' => $account_opening ?? 0,
                        'narration' => $item['narration'],
                        'credit' => $item['credit'] ?? 0,
                        'debit' => $item['debit'] ?? 0,
                    ])->toArray(),
                    'total_credit' => $items->sum(fn ($i) => $i['credit'] ?? 0),
                    'total_debit' => $items->sum(fn ($i) => $i['debit'] ?? 0),
                ];

                if (blank($data['transactions'])) {
                    $detail = Detail::where('account_code', $accountCode)->first();
                    $data = [
                        'account_code' => $accountCode,
                        'now' => Carbon::now()->format('d-m-Y'),
                        'from_date' => Carbon::parse($request->from_date)->format('d-m-Y'),
                        'to_date' => Carbon::parse($request->to_date)->format('d-m-Y'),
                        'account_title' => $detail->title ?? 'N/A',
                        'transactions' => [
                            [
                                'id' => '',
                                'entry_date' => '',
                                'opening_balance' => $account_opening,
                                'narration' => 'Opening Balance',
                                'credit' => 0,
                                'debit' => 0,
                            ],
                        ],
                        'total_credit' => 0,
                        'total_debit' => 0,
                    ];
                }

                return $data;

            })
                ->values()
                ->filter(fn ($item) => $item['account_code'] != 'no_account');

            $final_data = $final_data->map(function ($account) use ($request) {
                $stockInvoices = StockOutInvoice::whereBetween('invoice_date', [$request->date('from_date'), $request->date('to_date')])->where(function ($q) use ($account) {
                    $q->where('account_code', $account['account_code'])
                        ->orWhere('income_code', $account['account_code']);
                })->get();

                if ($stockInvoices->isNotEmpty()) {
                    foreach ($stockInvoices as $invoice) {
                        if ($invoice->account_code === $account['account_code']) {
                            $account['transactions'][] = [
                                'id' => $invoice->invoice_no,
                                'entry_date' => Carbon::parse($invoice->invoice_date)->format('d-m-Y'),
                                'opening_balance' => $account['transactions'][0]['opening_balance'] ?? 0,
                                'narration' => 'Stock Out (Debit)',
                                'credit' => 0,
                                'debit' => $invoice->totals['total_container_amount'],
                            ];
                        }

                        if ($invoice->income_code === $account['account_code']) {
                            $account['transactions'][] = [
                                'id' => $invoice->invoice_no,
                                'entry_date' => Carbon::parse($invoice->invoice_date)->format('d-m-Y'),
                                'opening_balance' => $account['transactions'][0]['opening_balance'] ?? 0,
                                'narration' => 'Stock Out (Debit)',
                                'credit' => $invoice->totals['total_container_amount'],
                                'debit' => 0,
                            ];
                        }
                    }
                }

                // calculate totals
                $account['total_credit'] = collect($account['transactions'])->sum('credit');
                $account['total_debit'] = collect($account['transactions'])->sum('debit');

                return $account;
            });

            return response()->json(['status' => true, 'data' => $final_data]);
        } catch (Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()]);
        }

    }
}
