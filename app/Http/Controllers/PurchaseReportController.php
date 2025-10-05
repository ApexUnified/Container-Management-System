<?php

namespace App\Http\Controllers;

use App\Models\Detail;
use App\Models\StockIn;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseReportController extends Controller
{
    public function index()
    {

        $vendors = Detail::whereHas('subsidary', function ($query) {
            $query->where('account_category', 'V');
        })
            ->get()
            ->map(function ($vendor) {
                return [
                    'id' => $vendor->id,
                    'name' => $vendor->account_code.' - '.$vendor->title,
                ];
            });

        $purchaseData = collect();

        return Inertia::render('Reports/PurchaseReport/index', compact('vendors', 'purchaseData'));
    }

    public function generateReport(Request $request)
    {
        $request->validate([
            'from_date' => ['required', 'date:d-m-Y'],
            'to_date' => ['required', 'date:d-m-Y', 'after_or_equal:from_date'],
            'vendor_id' => ['required', 'exists:details,id'],
        ], [
            'to_date.after_or_equal' => 'To date must be greater than or equal to From date',
        ]);

        $stockIns = StockIn::whereBetween('entry_date', [Carbon::parse($request->from_date)->format('Y-m-d'), Carbon::parse($request->to_date)->format('Y-m-d')])->where('vendor_id', $request->vendor_id)
            ->with(['vendor', 'cro', 'unit'])
            ->get()
            ->map(function ($stockIn) {
                return [
                    'id' => $stockIn->id,
                    'container_no' => $stockIn->container_no,
                    'purchase_date' => $stockIn->entry_date,
                    'vehicle_no' => $stockIn->vehicle_no,
                    'container_size' => $stockIn->container_size,
                    'vendor_name' => $stockIn->vendor->account_code.' - '.$stockIn->vendor->title,
                    'product_name' => $stockIn->product->name,
                    'cro' => $stockIn->cro->cro_no,
                    'unit' => $stockIn->unit->name,
                    'weight' => $stockIn->product_weight,
                    'weight_in_mann' => $stockIn->product_weight_in_man,
                    'bundles' => $stockIn->product_no_of_bundles,
                    'total_value' => $stockIn->product_total_amount,
                ];
            });

        if ($stockIns->isEmpty()) {
            return back()->with('error', 'No Stock In Found');
        }

        $stockIns->push(['now' => Carbon::now()->format('d-m-Y')]);

        $data = [
            'now' => Carbon::now()->format('d-m-Y'),
            'stockIns' => $stockIns,
        ];

        return Inertia::render('Reports/PurchaseReport/index', ['purchaseData' => $data]);
    }
}
