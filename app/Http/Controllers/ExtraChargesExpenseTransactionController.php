<?php

namespace App\Http\Controllers;

use App\Models\DubaiExpenseTransaction;
use App\Models\ExtraChargesExpense;
use App\Models\StockOut;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExtraChargesExpenseTransactionController extends Controller
{
    public function index()
    {

        $expenses = ExtraChargesExpense::all();

        return Inertia::render('Transactions/ExtraChargesExpenseTransactions/index', [
            'expenses' => Inertia::defer(fn () => $expenses),
        ]);
    }

    public function store(Request $request)
    {
        // dd($request->all());
        try {
            $validated_req = $request->validate([
                'data.containers' => ['required', 'array'],
                'data.total_amount_after_extra_charges' => ['required', 'numeric'],
            ]);

            $dubai_expense_transaction = DubaiExpenseTransaction::where('bl_no', $request->input('bl_no'))->first();
            if (empty($dubai_expense_transaction)) {
                return back()->with('error', 'Please Add Expense First On This B/L No. Before Adding Extra Charges.');
            }

            if ($request->integer('data.total_amount_after_extra_charges') < 1) {
                return back()->with('success', 'No Extra Charges Expense Applied.');
            }

            foreach ($validated_req['data']['containers'] as $container) {
                if (blank($container['extra_charges_expenses'])) {
                    return back()->with('error', 'Please Select Extra Charges Expense For Each Container.');
                }
            }

            $updated = $dubai_expense_transaction->update([
                'extra_charges_expenses' => $validated_req['data']['containers'],
                'total_amount_after_extra_charges' => $validated_req['data']['total_amount_after_extra_charges'],
            ]);

            if (! $updated) {
                throw new Exception('Failed to Add Extra Charges Expense In This B/L No.');
            }

            return back()->with('success', 'Extra Charges Expense Added Successfully.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }

    }

    public function findContainers(Request $request)
    {
        $bl_no = $request->input('bl_no');

        if (empty($bl_no)) {
            return response()->json([
                'error' => 'BL No is required',
            ], 400);
        }

        $dubai_expense_transaction = DubaiExpenseTransaction::where('bl_no', $bl_no)->first();

        if (empty($dubai_expense_transaction)) {
            return response()->json([
                'error' => 'No Dubai Expense Transaction found for the provided B/L No Please Add Dubai Expense First',
            ], 404);
        }

        $data = StockOut::where('bl_no', $bl_no)->get()
            ->map(function ($container) use ($dubai_expense_transaction) {

                $container->containers_count = count($container->containers);

                $weight_in_tons = $container->containers_collection->map(function ($cont) {
                    return $cont->product_weight;
                })->sum() / 1000;

                $container->weight_in_tons = number_format($weight_in_tons, 2, '.', '.');

                $updatedContainers = collect($container->containers)->map(function ($c) use ($dubai_expense_transaction) {
                    foreach ($dubai_expense_transaction->containers as $cont) {
                        if ($c['container_id'] == $cont['container_id']) {
                            $c['total_amount'] = $cont['total_amount'];
                            $c['container_expenses'] = $cont['container_expenses'] ?? [];
                        }
                    }

                    return $c;
                })->toArray();

                $container->containers = $updatedContainers;

                return $container;
            });

        if ($data->isEmpty()) {
            return response()->json([
                'error' => 'No containers found for the provided B/L No',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $data[0],
            'total_amount' => $dubai_expense_transaction->total_amount,
            'all_expenses' => $dubai_expense_transaction->all_expenses,

            'weight_in_tons' => $dubai_expense_transaction->weight_in_tons,
        ]);
    }
}
