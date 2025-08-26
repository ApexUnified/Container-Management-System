<?php

namespace App\Http\Controllers;

use App\Models\ReceiptVoucher;
use App\Models\StockIn;
use App\Models\Subsidary;
use App\Models\Voucher;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrialBalanceController extends Controller
{
    public function index()
    {
        return Inertia::render('Reports/TrialBalances/index');
    }

    public function generateReport(Request $request)
    {
        $validated_req = $request->validate([
            'from_date' => ['required', 'date:Y-m-d'],
            'to_date' => ['required', 'date:Y-m-d', 'after_or_equal:from_date'],
            'cols' => ['required', 'in:2,6'],
        ], [
            'to_date.after_or_equal' => 'To date must be greater than or equal to From date',
            'cols.required' => 'Please select number of columns',
            'cols.in' => 'Please select number of columns between 2 Or 6',
        ]);

        try {
            $from_date = $request->input('from_date');
            $to_date = $request->input('to_date');
            $columns = $request->input('cols');
            $all_total_opening_balances = ['debit' => 0.0, 'credit' => 0.0];
            $all_total_to_date_transactions = ['debit' => 0.0, 'credit' => 0.0];
            $all_total_closing_balances = ['debit' => 0.0, 'credit' => 0.0];
            $subsidaries = Subsidary::with('control', 'details')
                ->get()
                ->map(function ($subsidary) use (
                    &$all_total_opening_balances,
                    &$all_total_to_date_transactions,
                    &$all_total_closing_balances,
                    $from_date,
                    $to_date,
                ) {
                    $total_opening_balances = [
                        'credit' => 0,
                        'debit' => 0,
                    ];

                    $total_to_date_transactions = [
                        'credit' => 0,
                        'debit' => 0,
                    ];

                    $total_closing_balances = [
                        'credit' => 0,
                        'debit' => 0,
                    ];

                    $results = [
                        'header' => $subsidary->control->name."\n    \n".$subsidary->name,
                        'control' => $subsidary->control->name,
                        'subsidiary' => $subsidary->name,
                        'accounts' => $subsidary->details->isNotEmpty() ?
                        $subsidary->details->map(function ($account) use (&$total_opening_balances, &$total_to_date_transactions, &$total_closing_balances, $from_date,
                            $to_date) {
                            $ob = (float) ($account->opening_balance ?? 0);

                            // Opening Balance Logic
                            $containers = [
                                'as_vendor' => StockIn::with('vendor')->whereDate('entry_date', '<', $from_date)->where('vendor_id', $account->id)->orderBy('entry_date')->get(),
                                'as_transporter' => StockIn::with('transporter')->whereDate('entry_date', '<', $from_date)->where('transporter_id', $account->id)->orderBy('entry_date')->get(),
                                'as_custom_clearance' => StockIn::with('custom_clearance')->whereDate('entry_date', '<', $from_date)->where('custom_clearance_id', $account->id)->orderBy('entry_date')->get(),
                                'as_freight_forwarder' => StockIn::with('freight_forwarder')->whereDate('entry_date', '<', $from_date)->where('freight_forwarder_id', $account->id)->orderBy('entry_date')->get(),
                            ];

                            $opening_balance = [
                                'debit' => $ob > 0 ? $ob : 0.0,
                                'credit' => $ob < 0 ? abs($ob) : 0.0,
                            ];

                            $payment_vouchers = Voucher::with(['account_detail'])->whereDate('payment_date', '<', $from_date)->get();
                            if ($payment_vouchers->isNotEmpty()) {
                                foreach ($payment_vouchers as $payment_voucher) {
                                    if ($payment_voucher->account_detail->id == $account->id) {
                                        $amount = (float) ($payment_voucher->total_amount ?? 0);
                                        $opening_balance['debit'] += (float) $amount;
                                    }

                                    $bank_id = $payment_voucher->bank_details['bank_id'] ?? null;
                                    if (! empty($bank_id)) {
                                        if ($bank_id == $account->id) {
                                            $amount = (float) ($payment_voucher->total_amount ?? 0);
                                            $opening_balance['credit'] += (float) $amount;
                                        }

                                    }
                                }
                            }

                            $receipt_vouchers = ReceiptVoucher::with(['account_detail'])->whereDate('receipt_date', '<', $from_date)->get();
                            if ($receipt_vouchers->isNotEmpty()) {
                                foreach ($receipt_vouchers as $receipt_voucher) {
                                    if ($receipt_voucher->account_detail->id == $account->id) {
                                        $amount = (float) ($receipt_voucher->total_amount ?? 0);
                                        $opening_balance['credit'] += (float) $amount;
                                    }

                                    $bank_id = $receipt_voucher->bank_details['bank_id'] ?? null;
                                    if (! empty($bank_id)) {
                                        if ($bank_id == $account->id) {
                                            $amount = (float) ($receipt_voucher->total_amount ?? 0);
                                            $opening_balance['debit'] += (float) $amount;
                                        }

                                    }
                                }
                            }

                            if (! blank($containers['as_vendor'])) {
                                foreach ($containers['as_vendor'] as $c) {
                                    $opening_balance['credit'] += (float) ($c['product_total_amount'] ?? 0);
                                }
                            }
                            if (! blank($containers['as_transporter'])) {
                                foreach ($containers['as_transporter'] as $c) {
                                    $opening_balance['credit'] += (float) ($c['transporter_rate'] ?? 0);
                                }
                            }
                            if (! blank($containers['as_custom_clearance'])) {
                                foreach ($containers['as_custom_clearance'] as $c) {
                                    $opening_balance['credit'] += (float) ($c['custom_clearance_rate'] ?? 0);
                                }
                            }
                            if (! blank($containers['as_freight_forwarder'])) {
                                foreach ($containers['as_freight_forwarder'] as $c) {
                                    $opening_balance['credit'] += (float) ($c['freight_forwarder_rate'] ?? 0);
                                }
                            }

                            $total_opening_balances['credit'] += $opening_balance['credit'];
                            $total_opening_balances['debit'] += $opening_balance['debit'];
                            // Opening Balance Logic

                            // To Date Transactions Logic
                            $to_date_transaction_containers = [
                                'as_vendor' => StockIn::with('vendor')->whereBetween('entry_date', [$from_date, $to_date])->where('vendor_id', $account->id)->orderBy('entry_date')->get(),
                                'as_transporter' => StockIn::with('transporter')->whereBetween('entry_date', [$from_date, $to_date])->where('transporter_id', $account->id)->orderBy('entry_date')->get(),
                                'as_custom_clearance' => StockIn::with('custom_clearance')->whereBetween('entry_date', [$from_date, $to_date])->where('custom_clearance_id', $account->id)->orderBy('entry_date')->get(),
                                'as_freight_forwarder' => StockIn::with('freight_forwarder')->whereBetween('entry_date', [$from_date, $to_date])->where('freight_forwarder_id', $account->id)->orderBy('entry_date')->get(),
                            ];

                            $to_date_transactions = ['debit' => 0, 'credit' => 0];

                            $to_date_payment_vouchers = Voucher::with(['account_detail'])
                                ->whereBetween('payment_date', [$from_date, $to_date])
                                ->get();
                            if ($to_date_payment_vouchers->isNotEmpty()) {
                                foreach ($to_date_payment_vouchers as $td_payment_voucher) {
                                    if ($td_payment_voucher->account_detail->id == $account->id) {
                                        $amount = (float) ($td_payment_voucher->total_amount ?? 0);
                                        $to_date_transactions['debit'] += (float) $amount;
                                    }

                                    $td_bank_id = $td_payment_voucher->bank_details['bank_id'] ?? null;
                                    if (! empty($td_bank_id)) {
                                        if ($td_bank_id == $account->id) {
                                            $amount = (float) ($td_payment_voucher->total_amount ?? 0);
                                            $to_date_transactions['credit'] += (float) $amount;
                                        }

                                    }
                                }
                            }

                            $to_date_receipt_vouchers = ReceiptVoucher::with(['account_detail'])
                                ->whereBetween('receipt_date', [$from_date, $to_date])
                                ->get();

                            if ($to_date_receipt_vouchers->isNotEmpty()) {
                                foreach ($to_date_receipt_vouchers as $td_receipt_voucher) {
                                    if ($td_receipt_voucher->account_detail->id == $account->id) {
                                        $amount = (float) ($td_receipt_voucher->total_amount ?? 0);
                                        $to_date_transactions['credit'] += (float) $amount;
                                    }

                                    $td_bank_id = $td_receipt_voucher->bank_details['bank_id'] ?? null;
                                    if (! empty($td_bank_id)) {
                                        if ($td_bank_id == $account->id) {
                                            $amount = (float) ($td_receipt_voucher->total_amount ?? 0);
                                            $to_date_transactions['debit'] += (float) $amount;
                                        }

                                    }
                                }
                            }

                            if (! blank($to_date_transaction_containers['as_vendor'])) {
                                foreach ($to_date_transaction_containers['as_vendor'] as $c) {
                                    $to_date_transactions['credit'] += (float) ($c['product_total_amount'] ?? 0);
                                }
                            }
                            if (! blank($to_date_transaction_containers['as_transporter'])) {
                                foreach ($to_date_transaction_containers['as_transporter'] as $c) {
                                    $to_date_transactions['credit'] += (float) ($c['transporter_rate'] ?? 0);
                                }
                            }
                            if (! blank($to_date_transaction_containers['as_custom_clearance'])) {
                                foreach ($to_date_transaction_containers['as_custom_clearance'] as $c) {
                                    $to_date_transactions['credit'] += (float) ($c['custom_clearance_rate'] ?? 0);
                                }
                            }
                            if (! blank($to_date_transaction_containers['as_freight_forwarder'])) {
                                foreach ($to_date_transaction_containers['as_freight_forwarder'] as $c) {
                                    $to_date_transactions['credit'] += (float) ($c['freight_forwarder_rate'] ?? 0);
                                }
                            }

                            $total_to_date_transactions['credit'] += $to_date_transactions['credit'];
                            $total_to_date_transactions['debit'] += $to_date_transactions['debit'];

                            // To Date Transactions Logic
                            // Closing Balance Logic
                            $opening_net = (float) $opening_balance['debit'] - (float) $opening_balance['credit'];
                            $to_date_net = (float) $to_date_transactions['debit'] - (float) $to_date_transactions['credit'];
                            $closing_net = $opening_net + $to_date_net;
                            $closing_balance = [
                                'debit' => $closing_net > 0 ? $closing_net : 0,
                                'credit' => $closing_net < 0 ? abs($closing_net) : 0,
                            ];
                            $total_closing_balances['credit'] += $closing_balance['credit'];
                            $total_closing_balances['debit'] += $closing_balance['debit'];
                            // Closing Balance Logic

                            return [
                                'account_code' => $account->account_code ?? '-',
                                'account_title' => $account->title ?? '-',
                                // 'payment_vouchers' => $payment_vouchers ?? '-',
                                // 'account_opening' => $account->opening_balance,
                                'opening_balance' => $opening_balance ?? ['credit' => 0, 'debit' => 0],
                                'to_date_transactions' => $to_date_transactions ?? ['credit' => 0, 'debit' => 0],
                                'closing_balance' => $closing_balance ?? ['credit' => 0, 'debit' => 0],
                            ];
                        })->values()
                        : collect([
                            [
                                'account_code' => 'No Account',
                                'account_title' => 'No Account',
                                'opening_balance' => ['credit' => 0, 'debit' => 0],
                                'to_date_transactions' => ['credit' => 0, 'debit' => 0],
                                'closing_balance' => ['credit' => 0, 'debit' => 0],
                            ],
                        ]),
                        'total_opening_balance' => $total_opening_balances ?? ['credit' => 0, 'debit' => 0],
                        'total_to_date_transaction' => $total_to_date_transactions ?? ['credit' => 0, 'debit' => 0],
                        'total_closing_balance' => $total_closing_balances ?? ['credit' => 0, 'debit' => 0],
                    ];

                    $all_total_opening_balances['debit'] += (float) $total_opening_balances['debit'];
                    $all_total_opening_balances['credit'] += (float) $total_opening_balances['credit'];

                    $all_total_to_date_transactions['debit'] += (float) $total_to_date_transactions['debit'];
                    $all_total_to_date_transactions['credit'] += (float) $total_to_date_transactions['credit'];

                    $all_total_closing_balances['debit'] += (float) $total_closing_balances['debit'];
                    $all_total_closing_balances['credit'] += (float) $total_closing_balances['credit'];

                    return $results;

                });
            // dd($subsidaries->toArray(), [
            //     'totals' => [
            //         'opening_balance' => $all_total_opening_balances,
            //         'to_date_transactions' => $all_total_to_date_transactions,
            //         'closing_balance' => $all_total_closing_balances,
            //         'now' => now()->format('Y-m-d'),
            //     ],
            // ]);

            return response()->json([
                'status' => true,
                'data' => [
                    'subsidaries' => $subsidaries,
                    'totals' => [
                        'opening_balance' => $all_total_opening_balances,
                        'to_date_transactions' => $all_total_to_date_transactions,
                        'closing_balance' => $all_total_closing_balances,

                    ],
                    'now' => now()->format('Y-m-d'),
                    'from_date' => $from_date,
                    'to_date' => $to_date,
                    'columns' => $columns,
                ],
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()]);
        }

    }
}
