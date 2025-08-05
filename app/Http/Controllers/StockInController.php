<?php

namespace App\Http\Controllers;

use App\Models\Currency;
use App\Models\CustomClearance;
use App\Models\Product;
use App\Models\ShippingLine;
use App\Models\StockIn;
use App\Models\Transporter;
use App\Models\Unit;
use App\Models\Vendor;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class StockInController extends Controller
{
    public function index()
    {
        $stock_ins = StockIn::with(['currency', 'vendor', 'product', 'unit', 'transporter', 'custom_clearance', 'shipping_line'])->latest()->paginate(10);

        $vendors = Vendor::all();
        $products = Product::all();
        $units = Unit::all();
        $transporters = Transporter::all();
        $custom_clearances = CustomClearance::all();
        $shipping_lines = ShippingLine::all();
        $currencies = Currency::all();

        return Inertia::render('StockIns/index',
            compact(
                'stock_ins', 'vendors', 'products', 'units', 'transporters', 'custom_clearances', 'shipping_lines', 'currencies', 'stock_ins'));
    }

    public function store(Request $request)
    {

        $validated_req = $request->validate([
            'entry_date' => ['required', 'date'],
            'container_no' => ['required', 'max:255'],
            'vehicle_no' => ['required', 'max:255'],
            'vendor_id' => ['required', 'exists:vendors,id'],
            'product_id' => ['required', 'exists:products,id'],
            'product_weight' => ['required', 'numeric'],
            'product_unit_id' => ['required', 'exists:units,id'],
            'product_weight_in_man' => ['required', 'numeric'],
            'product_no_of_bundles' => ['required', 'numeric'],
            'product_rate' => ['required', 'numeric'],
            'product_total_amount' => ['required', 'numeric'],
            'transporter_id' => ['nullable', 'exists:transporters,id'],
            'transporter_rate' => ['nullable', 'numeric'],
            'custom_clearance_id' => ['nullable', 'exists:custom_clearances,id'],
            'custom_clearance_rate' => ['nullable', 'numeric'],
            'shipping_line_id' => ['required', 'exists:shipping_lines,id'],
            'shipping_line_rate' => ['required', 'numeric'],
            'fc_amount' => ['required', 'numeric'],
            'exchange_rate' => ['required', 'numeric'],
            'currency_id' => ['required', 'exists:currencies,id'],
            'total_amount' => ['required', 'numeric'],
            'all_in_one' => ['nullable', 'boolean'],
            'note' => ['nullable'],
        ]);

        try {
            if (StockIn::create($validated_req)) {
                return back()->with('success', 'Stock In Added Successfully');
            }

            throw new Exception('Something went wrong While Creating Stock In');
        } catch (Exception $e) {
            throw ValidationException::withMessages([
                'server' => $e->getMessage(),
            ]);
        }
    }

    public function update(Request $request, string $id)
    {
        if (empty($id)) {
            return back()->with('error', 'Stock In ID Not Found');
        }

        $validated_req = $request->validate([
            'entry_date' => ['required', 'date'],
            'container_no' => ['required', 'max:255'],
            'vehicle_no' => ['required', 'max:255'],
            'vendor_id' => ['required', 'exists:vendors,id'],
            'product_id' => ['required', 'exists:products,id'],
            'product_weight' => ['required', 'numeric'],
            'product_unit_id' => ['required', 'exists:units,id'],
            'product_weight_in_man' => ['required', 'numeric'],
            'product_no_of_bundles' => ['required', 'numeric'],
            'product_rate' => ['required', 'numeric'],
            'product_total_amount' => ['required', 'numeric'],
            'transporter_id' => ['nullable', 'exists:transporters,id'],
            'transporter_rate' => ['nullable', 'numeric'],
            'custom_clearance_id' => ['nullable', 'exists:custom_clearances,id'],
            'custom_clearance_rate' => ['nullable', 'numeric'],
            'shipping_line_id' => ['required', 'exists:shipping_lines,id'],
            'shipping_line_rate' => ['required', 'numeric'],
            'fc_amount' => ['required', 'numeric'],
            'exchange_rate' => ['required', 'numeric'],
            'currency_id' => ['required', 'exists:currencies,id'],
            'total_amount' => ['required', 'numeric'],
            'all_in_one' => ['nullable', 'boolean'],
            'note' => ['nullable'],
        ]);

        try {

            $stock_in = StockIn::find($id);

            if (empty($stock_in)) {
                throw new Exception('Stock In Not Found');
            }

            if ($stock_in->update($validated_req)) {
                return back()->with('success', 'Stock In Updated Successfully');
            }

            throw new Exception('Something went wrong While Updating Stock In');
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
                return back()->with('error', 'Stock In ID Not Found');
            }

            $stock_in = StockIn::find($id);

            if (empty($stock_in)) {
                throw new Exception('Stock In Not Found');
            }

            if ($stock_in->delete()) {
                return back()->with('success', 'Stock In Deleted Successfully');
            }

            throw new Exception('Something went wrong While Deleting Stock In');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroyBySelection(Request $request)
    {
        try {
            $ids = $request->array('ids');

            if (blank($ids)) {
                throw new Exception('Please Select Atleast One Stock In');
            }

            $deleted = StockIn::destroy($ids);

            if ($deleted !== count($ids)) {
                throw new Exception('Something went wrong While Deleting Stock In');
            }

            return back()->with('success', 'Stock In Deleted Successfully');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
