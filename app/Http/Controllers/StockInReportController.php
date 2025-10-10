<?php

namespace App\Http\Controllers;

use App\Models\StockIn;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockInReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Reports/StockInReport/index');
    }

    public function generateReport(Request $request)
    {
        $request->validate([
            'from_date' => ['required', 'date'],
            'to_date' => ['required', 'date'],
        ]);

        $from_date = Carbon::createFromFormat('d-m-Y', $request->input('from_date'))->format('Y-m-d');
        $to_date = Carbon::createFromFormat('d-m-Y', $request->input('to_date'))->format('Y-m-d');

        $stockIns = StockIn::whereBetween('entry_date', [$from_date, $to_date])
            ->with(['freight_forwarder', 'custom_clearance', 'vendor', 'transporter', 'product'])
            ->get()
            ->map(function ($stockin) {
                return [
                    'id' => $stockin->id,
                    'purchase_date' => $stockin->entry_date,
                    'vehicle_no' => $stockin->vehicle_no,
                    'container_no' => $stockin->container_no,
                    'vendor_name' => $stockin?->vendor?->account_code ? $stockin?->vendor?->account_code.' - '.$stockin?->vendor?->title : null,
                    'freight_forwarder_name' => $stockin?->freight_forwarder?->account_code ? $stockin?->freight_forwarder?->account_code.' - '.$stockin?->freight_forwarder?->title : null,
                    'custom_clearance_name' => $stockin?->custom_clearance?->account_code ? $stockin?->custom_clearance?->account_code.' - '.$stockin?->custom_clearance?->title : null,
                    'transporter_name' => $stockin?->transporter?->account_code ? $stockin?->transporter?->account_code.' - '.$stockin?->transporter->title : null,
                    'transporter_amount' => $stockin?->transporter_rate,
                    'custom_clearance_amount' => $stockin?->custom_clearance_rate,
                    'freight_forwarder_amount' => $stockin?->freight_forwarder_rate,
                    'product_name' => $stockin?->product->name,
                    'weight' => $stockin->product_weight,
                    'weight_in_mann' => $stockin?->product_weight_in_man,
                    'bundles' => $stockin?->product_no_of_bundles,
                    'rate' => $stockin?->product_rate,
                    'product_total_amount' => $stockin?->product_total_amount,
                    'total_value' => $stockin?->total_amount,

                ];
            });

        if ($stockIns->isEmpty()) {
            return back()->with('error', 'No Stock In Found');
        }

        $data = [
            'stockIns' => $stockIns,
            'now' => now()->format('d-m-Y'),
        ];

        return Inertia::render('Reports/StockInReport/index', ['stockinData' => $data]);
    }
}
