<?php

namespace App\Http\Controllers;

use App\Models\Currency;
use App\Models\StockIn;
use App\Models\StockOut;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class StockOutController extends Controller
{
    public function index(Request $request)
    {
        //     dd($request->all());
        $request->validate([
            'bl_date' => ['nullable', 'date'],
            'bl_no' => ['nullable', 'max:255', 'string', 'exists:stock_outs,bl_no'],
        ], [
            'bl_no.exists' => 'The B/L No You Searched is Not Exists',

        ]);

        $stock_outs = StockOut::query()->latest();

        $stock_outs = $stock_outs
            ->when(! empty($request->input('bl_date')), function ($query) use ($request) {
                $query->whereDate('bl_date', $request->input('bl_date'));
            })
            ->when(! empty($request->input('bl_no')), function ($query) use ($request) {
                $query->where('bl_no', $request->input('bl_no'));
            });

        $stock_outs = $stock_outs->paginate(10)->withQueryString();

        // For Checking If Already Exists Or Not In The Stock Out Table
        $all_stock_outs = StockOut::latest()->get();

        $container_collection = $all_stock_outs->pluck('containers_collection')->unique()->flatten(1);
        $container_ids = $all_stock_outs->pluck('containers_collection')
            ->flatten(1)
            ->pluck('id')
            ->unique()
            ->toArray();

        $stock_ins = StockIn::whereNotIn('id', $container_ids)->get();

        $currencies = Currency::all();

        return Inertia::render('Transactions/StockOuts/index', [
            'stock_outs' => $stock_outs,
            'stock_ins' => $stock_ins,
            'currencies' => $currencies,
            'container_collection' => $container_collection,
            'bl_date' => old('bl_date') ?? $request->input('bl_date'),
            'bl_no' => old('bl_no') ?? $request->input('bl_no'),
        ]);
    }

    public function store(Request $request)
    {

        $validated_req = $request->validate([
            'bl_date' => ['required', 'date'],
            'bl_no' => ['required', 'unique:stock_outs,bl_no'],
            'exchange_rate' => ['required', 'numeric'],
            'containers' => ['required', 'array'],
            'currency_id' => ['required', 'exists:currencies,id'],
        ]);

        try {

            $request->validate([
                'containers.*.container_id' => ['required', 'exists:stock_ins,id', function ($attribute, $value, $fail) {
                    $container = StockOut::whereJsonContains('containers', [['container_id' => $value]])->first();

                    if (! empty($container)) {
                        $fail("Container No:  {$container->containers[0]['container_no']} already exists");
                    }
                }],
                'containers.*.total_amount' => ['required', 'numeric'],
                'containers.*.container_no' => ['required'],
            ], [
                'containers.*.container_id.required' => 'Please Select Atleast One Container',

                'containers.*.total_amount.required' => 'Total amount is required',
                'conainers.*.container_no.required' => 'Container Number is required',
            ]);

            $created = StockOut::create($validated_req);

            if (empty($created)) {
                throw new Exception('Something went wrong While Saving Stock Out');
            }

            return back()->with('success', 'Stock Out Saved Successfully');
        } catch (Exception $e) {
            throw ValidationException::withMessages([
                'server' => $e->getMessage(),
            ]);
        }
    }

    public function update(Request $request, string $id)
    {

        if (empty($id)) {
            throw ValidationException::withMessages([
                'server' => 'Stock Out ID is Missing',
            ]);
        }

        $validated_req = $request->validate([
            'bl_date' => ['required', 'date'],
            'bl_no' => ['required', 'unique:stock_outs,bl_no,'.$id],
            'exchange_rate' => ['required', 'numeric'],
            'containers' => ['required', 'array'],
            'currency_id' => ['required', 'exists:currencies,id'],
        ]);

        try {

            $request->validate([
                'containers.*.container_id' => ['required', 'exists:stock_ins,id', function ($attribute, $value, $fail) use ($id) {
                    $container = StockOut::whereNot('id', $id)->whereJsonContains('containers', [['container_id' => $value]])->first();

                    if (! empty($container)) {
                        $fail("Container No:  {$container->containers[0]['container_no']} already exists");
                    }
                }],
                'containers.*.total_amount' => ['required', 'numeric'],
                'containers.*.container_no' => ['required'],
            ], [
                'containers.*.container_id.required' => 'Please Select Atleast One Container',
                'containers.*.total_amount.required' => 'Total amount is required',
                'conainers.*.container_no.required' => 'Container Number is required',
            ]);

            $stock_out = StockOut::find($id);

            if (empty($stock_out)) {
                throw ValidationException::withMessages([
                    'server' => 'Stock Out Not Found',
                ]);
            }

            $updated = $stock_out->update($validated_req);

            if (! $updated) {
                throw new Exception('Something went wrong While Updating Stock Out');
            }

            return back()->with('success', 'Stock Out Updated Successfully');

        } catch (Exception $e) {
            throw ValidationException::withMessages([
                'server' => $e->getMessage(),
            ]);
        }
    }

    public function destroy(string $id)
    {
        try {
            if (empty($id)) {
                throw new Exception('Stock Out ID is Missing');
            }

            $stock_out = StockOut::find($id);

            if (empty($stock_out)) {
                throw new Exception('Stock Out Not Found');
            }

            $deleted = $stock_out->delete();

            if (! $deleted) {
                throw new Exception('Something went wrong While Deleting Stock Out');
            }

            return back()->with('success', 'Stock Out Deleted Successfully');

        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroyBySelection(Request $request)
    {
        try {
            $ids = $request->array('ids');

            if (blank($ids)) {
                throw new Exception('Please Select Atleast One Stock Out');
            }

            $deleted = StockOut::destroy($ids);

            if ($deleted !== count($ids)) {
                throw new Exception('Something went wrong While Deleting Stock Out');
            }

            return back()->with('success', 'Stock Out Deleted Successfully');

        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
