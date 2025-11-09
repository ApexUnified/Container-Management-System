<?php

namespace App\Http\Controllers;

use App\Models\DubaiExpense;
use App\Models\DubaiExpenseSetting;
use App\Models\DubaiExpenseTransaction;
use App\Models\StockOut;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DubaiExpenseTransactionController extends Controller
{
    public function index()
    {

        $expenses = DubaiExpense::all();

        return Inertia::render('Transactions/DubaiExpenseTransactions/index', [
            'expenses' => Inertia::defer(fn () => $expenses),
            'expense_setting' => DubaiExpenseSetting::first(),
        ]);
    }

    public function store(Request $request)
    {
        // dd($request->all());
        try {
            $validated_req = $request->validate([
                'data.bl_no' => ['required', 'string', 'max:255'],
                'data.containers_count' => ['required', 'integer'],
                'data.bl_date' => ['required', 'date'],
                'data.weight_in_tons' => ['required', 'numeric'],
                'data.total_amount' => ['required', 'numeric'],
                'data.mofa_amount' => ['required', 'numeric'],
                'data.applied_mofa' => ['required', 'numeric'],
                'data.applied_vat' => ['required', 'numeric'],
                'data.containers' => ['required', 'array'],
                'data.all_expenses' => ['required', 'array'],
            ]);

            $validated_req['data']['bl_date'] = date('Y-m-d H:i:s', strtotime($validated_req['data']['bl_date']));

            $exists = DubaiExpenseTransaction::where('bl_no', $validated_req['data']['bl_no'])->first();

            if (! empty($exists)) {
                $exists->update(array_merge($validated_req['data'], ['extra_charges_expenses' => null, 'total_amount_after_extra_charges' => null]));

                return back()->with('success', 'Dubai Expense Transaction updated successfully.');
            }

            $created = DubaiExpenseTransaction::create($validated_req['data']);

            if (empty($created)) {
                throw new Exception('Failed to create Dubai Expense Transaction');
            }

            return back()->with('success', 'Dubai Expense Transaction created successfully.');
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

        $data = StockOut::where('bl_no', $bl_no)->get()
            ->map(function ($container) {
                $container->containers_count = count($container->containers);

                $weight_in_tons = $container->containers_collection->map(function ($cont) {
                    return $cont->product_weight;
                })->sum() / 1000;

                $container->weight_in_tons = number_format($weight_in_tons, 2, '.', '.');

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
        ]);
    }
}
