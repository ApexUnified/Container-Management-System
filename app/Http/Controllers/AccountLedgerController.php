<?php

namespace App\Http\Controllers;

use App\Models\Detail;
use App\Models\StockIn;
use App\Models\Voucher;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountLedgerController extends Controller
{
    public function index(Request $request)
    {
        $details = Detail::get()->map(function ($detail) {
            return [
                'id' => $detail->account_code,
                'name' => $detail->title.' - '.$detail->account_code,
            ];
        });

        return Inertia::render('Reports/AccountLedgers/index', compact('details'));
    }

    public function generateReport(Request $request)
    {

        $request->validate([
            'from_date' => ['required', 'date:Y-m-d'],
            'to_date' => ['required', 'date:Y-m-d'],
            'from_account_code' => ['required'],
            'to_account_code' => ['required'],
        ]);

        $fromCode = $request->from_account_code ? str_replace('-', '', $request->from_account_code) : null;
        $toCode = $request->to_account_code ? str_replace('-', '', $request->to_account_code) : null;

        $containers_data = StockIn::whereBetween('entry_date', [$request->from_date, $request->to_date])
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

        $containers_transformed = $containers_data->flatMap(function ($container) use ($fromCode, $toCode) {
            $checkRange = fn ($code) => $fromCode === $toCode ? $code === $fromCode : ($code >= $fromCode && $code <= $toCode);

            $entries = [];

            if ($checkRange($container->vendor->code ?? null)) {
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
                    'credit' => $container->total_amount,
                    'debit' => null,
                ];
            }

            if ($checkRange($container->transporter->code ?? null)) {
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
                    'debit' => null,
                ];
            }

            if ($checkRange($container->freight_forwarder->code ?? null)) {
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
                    'debit' => null,
                ];
            }

            if ($checkRange($container->custom_clearance->code ?? null)) {
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
                    'debit' => null,
                ];
            }

            return $entries; // flatMap will flatten this array automatically
        });

        $payment_vouchers = Voucher::whereBetween('payment_date', [$request->from_date, $request->to_date])
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

        $payment_vouchers_transformed = $payment_vouchers->map(function ($voucher) use ($fromCode, $toCode) {
            $debit = null;
            $credit = null;
            $account_code = null;
            $account_title = null;

            $bank_id = $voucher->bank_details['bank_id'] ?? null;

            if ($voucher->account_detail && $voucher->account_detail->code >= $fromCode && $voucher->account_detail->code <= $toCode) {
                $debit = $voucher->amount;
                $account_code = $voucher->account_detail->account_code;
                $account_title = $voucher->account_detail->title;
            } elseif ($bank_id) {
                $bank = Detail::find($bank_id);
                if ($bank && $bank->code >= $fromCode && $bank->code <= $toCode) {
                    $credit = $voucher->amount;
                    // Only set account info if debit not already set
                    if (! $account_code) {
                        $account_code = $bank->account_code;
                        $account_title = $bank->title;
                    }
                }
            }

            return collect([
                'id' => $voucher->payment_no,
                'account_code' => $account_code,
                'account_title' => $account_title,
                'entry_date' => $voucher->payment_date,
                'narration' => $voucher->payment_details,
                'credit' => $credit,
                'debit' => $debit,
            ]);
        });

        if ($containers_transformed->isEmpty() && $payment_vouchers_transformed->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'No Data Found Between The Date Range And Account Code You Selected']);
        }

        $merged_data = $containers_transformed->isEmpty()
        ? $payment_vouchers_transformed
        : ($payment_vouchers_transformed->isNotEmpty() ? $payment_vouchers_transformed->merge($containers_transformed) : $containers_transformed);

        $grouped = $merged_data->groupBy(fn ($item) => $item['account_code'] ?? 'no_account');

        $previous_containers = StockIn::whereDate('entry_date', '<', $request->from_date)
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

        $previous_vouchers = Voucher::whereDate('payment_date', '<', $request->from_date)
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

        // --- Step 1: Previous containers with account_code ---
        $previous_entries = $previous_containers->flatMap(function ($container) use ($fromCode, $toCode) {
            $checkRange = fn ($code) => $fromCode === $toCode ? $code === $fromCode : ($code >= $fromCode && $code <= $toCode);

            $entries = [];

            if ($checkRange($container->vendor->code ?? null)) {
                $entries[] = [
                    'account_code' => $container->vendor->account_code,
                    'debit' => null,
                    'credit' => $container->total_amount,
                ];
            }

            if ($checkRange($container->transporter->code ?? null)) {
                $entries[] = [
                    'account_code' => $container->transporter->account_code,
                    'debit' => null,
                    'credit' => $container->transporter_rate,
                ];
            }

            if ($checkRange($container->freight_forwarder->code ?? null)) {
                $entries[] = [
                    'account_code' => $container->freight_forwarder->account_code,
                    'debit' => null,
                    'credit' => $container->freight_forwarder_rate,
                ];
            }

            if ($checkRange($container->custom_clearance->code ?? null)) {
                $entries[] = [
                    'account_code' => $container->custom_clearance->account_code,
                    'debit' => null,
                    'credit' => $container->custom_clearance_rate,
                ];
            }

            return $entries;
        });

        // --- Step 2: Previous vouchers with account_code ---
        $previous_voucher_entries = $previous_vouchers->map(function ($voucher) use ($fromCode, $toCode) {
            $debit = null;
            $credit = null;
            $account_code = null;

            $bank_id = $voucher->bank_details['bank_id'] ?? null;

            if ($voucher->account_detail && $voucher->account_detail->code >= $fromCode && $voucher->account_detail->code <= $toCode) {
                $debit = $voucher->amount;
                $account_code = $voucher->account_detail->account_code;
            } elseif ($bank_id) {
                $bank = Detail::find($bank_id);
                if ($bank && $bank->code >= $fromCode && $bank->code <= $toCode) {
                    $credit = $voucher->amount;
                    $account_code = $bank->account_code;
                }
            }

            return [
                'account_code' => $account_code,
                'debit' => $debit,
                'credit' => $credit,
            ];
        });

        // --- Step 3: Group by account and calculate opening balance per account ---
        $opening_balances = collect($previous_entries)
            ->merge($previous_voucher_entries)
            ->groupBy('account_code')
            ->map(function ($entries) {
                return ($entries->sum('opening_balance') ?? 0) + ($entries->sum('debit') ?? 0) - ($entries->sum('credit') ?? 0);
            });

        $final_data = $grouped->map(function ($items, $accountCode) use ($request, $opening_balances) {

            $items = $items->sortBy('entry_date')->values();
            $account_opening = $opening_balances[$accountCode] ?? null;

            return [
                'account_code' => $accountCode,
                'from_date' => Carbon::parse($request->from_date)->format('d/m/Y'),
                'to_date' => Carbon::parse($request->to_date)->format('d/m/Y'),
                'account_title' => $items->first()['account_title'] ?? 'N/A',
                'transactions' => $items->map(fn ($item) => [
                    'id' => $item['id'],
                    'entry_date' => $item['entry_date'],
                    'opening_balance' => $account_opening ?? $item['opening_balance'] ?? 0,
                    'narration' => $item['narration'],
                    'credit' => $item['credit'] ?? 0,
                    'debit' => $item['debit'] ?? 0,
                ])->toArray(),
                'total_credit' => $items->sum(fn ($i) => $i['credit'] ?? 0),
                'total_debit' => $items->sum(fn ($i) => $i['debit'] ?? 0),
            ];
        })
            ->values()
            ->filter(fn ($item) => $item['account_code'] != 'no_account');

        dd([
            'final Data: ' => $final_data,
            'container_data' => $containers_data,
            'payment_vouchers' => $payment_vouchers,
            'previous container' => $previous_containers,
            'previous vouchrs' => $previous_vouchers,
            'previous cotnainer entriues' => $previous_entries,
            'previous voucher entries' => $previous_voucher_entries,

        ]);

        if ($final_data->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'No Data Found Between The Date Range And Account Code You Selected']);
        }

        return response()->json(['status' => true, 'data' => $final_data]);

    }
}
