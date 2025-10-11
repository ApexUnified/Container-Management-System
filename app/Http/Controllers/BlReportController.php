<?php

namespace App\Http\Controllers;

use App\Models\StockOut;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Reports/BlReport/index');
    }

    public function generateReport(Request $request)
    {

        $stockOuts = StockOut::query();

        if ($request->filled('from_bl_no') && $request->filled('to_bl_no')) {
            $stockOuts = $stockOuts->whereBetween('bl_no', [$request->input('from_bl_no'), $request->input('to_bl_no')]);
        }
        $stockOuts = $stockOuts->get()->map(function ($stockout) {

            $total_value_in_pkr = 0;

            foreach ($stockout->containers_collection as $container_col) {

                $total_value_in_pkr += $container_col->total_amount;
            }

            $total_amount_fc = 0;

            foreach ($stockout->containers as $container) {

                $total_amount_fc += $container['total_amount'];
            }

            return [
                'id' => $stockout->id,
                'bl_no' => $stockout->bl_no,
                'bl_date' => $stockout->bl_date,
                'port_name' => $stockout->port_name,
                'no_of_containers' => count($stockout->containers),
                'total_val_in_pkr' => $total_value_in_pkr,
                'total_val_in_fc' => $total_amount_fc,
            ];
        });

        if ($stockOuts->isEmpty()) {
            return back()->with('error', 'No data found');
        }

        $data = [
            'blData' => $stockOuts,
            'now' => now()->format('d-m-Y'),
        ];

        return Inertia::render('Reports/BlReport/index', ['blData' => $data]);
    }
}
