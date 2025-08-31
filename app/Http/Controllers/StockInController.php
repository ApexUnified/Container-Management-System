<?php

namespace App\Http\Controllers;

use App\Models\Cro;
use App\Models\Currency;
use App\Models\Detail;
use App\Models\Product;
use App\Models\StockIn;
use App\Models\Unit;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class StockInController extends Controller
{
    public function index(Request $request)
    {
        // dd($request->all());
        $request->validate([
            'container_no' => ['nullable', 'max:255', 'string', 'exists:stock_ins,container_no'],
        ], [
            'container_no.exists' => 'The Container You Searched is Not Exists',
        ]);

        if (! empty($request->input('s_cro_no'))) {
            $cro = Cro::where('cro_no', $request->input('s_cro_no'))->first();
            if (empty($cro)) {
                throw ValidationException::withMessages([
                    's_cro_no' => 'The CRO You Searched is Not Exists',
                ]);
            }

        }

        $entry_date = $request->input('entry_date');
        $dates = [];

        if (! empty($entry_date)) {
            $dates = explode(' to ', $entry_date);

            if (count($dates) !== 2 || empty($dates[0]) || empty($dates[1])) {
                return back()->with('error', 'Please A Valid Select Date Range');
            }

            if (strtotime($dates[0]) > strtotime($dates[1])) {
                return back()->with('error', 'Start date must be before end date.');
            }

        }

        $stock_ins = StockIn::query()
            ->with(['currency', 'vendor', 'product', 'unit', 'cro', 'transporter', 'custom_clearance', 'freight_forwarder'])
            ->latest();

        $stock_ins = $stock_ins->when(! empty($request->input('entry_date')), function ($query) use ($dates) {
            $query->whereBetween('entry_date', [$dates[0], $dates[1]]);
        })->when(! empty($request->input('container_no')), function ($query) use ($request) {
            $query->where('container_no', $request->input('container_no'));
        })
            ->when(! empty($request->input('s_cro_no')), function ($query) use ($request) {
                $query->whereHas('cro', function ($subQ) use ($request) {
                    $subQ->where('cro_no', $request->input('s_cro_no'));
                });
            });

        $stock_ins = $stock_ins->paginate(10)->withQueryString();

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

        $products = Product::all();
        $units = Unit::all();

        $transporters = Detail::whereHas('subsidary', function ($query) {
            $query->where('account_category', 'T');
        })
            ->get()
            ->map(function ($transporter) {
                return [
                    'id' => $transporter->id,
                    'name' => $transporter->account_code.' - '.$transporter->title,
                ];
            });

        $custom_clearances = Detail::whereHas('subsidary', function ($query) {
            $query->where('account_category', 'C');
        })
            ->get()
            ->map(function ($custom_clearance) {
                return [
                    'id' => $custom_clearance->id,
                    'name' => $custom_clearance->account_code.' - '.$custom_clearance->title,
                ];
            });

        $freight_forwarders = Detail::whereHas('subsidary', function ($query) {
            $query->where('account_category', 'F');
        })
            ->get()
            ->map(function ($freight_forwarder) {
                return [
                    'id' => $freight_forwarder->id,
                    'name' => $freight_forwarder->account_code.' - '.$freight_forwarder->title,
                ];
            });

        $currencies = Currency::all();
        $cros = Cro::with('containers')->get();

        // return [
        //     'transporters' => $transporters,
        //     'custom_clerance' => $custom_clearances,
        //     'freight_forwarders' => $freight_forwarders,
        //     'vendors ' => $vendors,
        // ];

        return Inertia::render('Transactions/StockIns/index', [
            'stock_ins' => $stock_ins,
            'vendors' => $vendors,
            'products' => $products,
            'transporters' => $transporters,
            'custom_clearances' => $custom_clearances,
            'freight_forwarders' => $freight_forwarders,
            'units' => $units,
            'cros' => $cros,
            'currencies' => $currencies,
            'container_no' => old('container_no') ?? $request->input('container_no'),
            'entry_date' => old('entry_date') ?? $request->input('entry_date'),
            's_cro_no' => old('s_cro_no') ?? $request->input('s_cro_no'),
        ]);
    }

    public function store(Request $request)
    {

        $validated_req = $request->validate([
            'entry_date' => ['required', 'date'],
            'container_no' => ['required', 'max:255', 'unique:stock_ins,container_no'],
            'vehicle_no' => ['nullable', 'max:255'],
            'cro_id' => ['required', 'exists:cros,id'],
            'container_size' => ['required', 'string'],
            'port_location' => ['required', 'in:KICT,KDGL'],
            'vendor_id' => ['required', 'exists:details,id'],
            'product_id' => ['required', 'exists:products,id'],
            'product_weight' => ['required', 'numeric'],
            'product_unit_id' => ['required', 'exists:units,id'],
            'product_weight_in_man' => ['required', 'numeric'],
            'product_no_of_bundles' => ['required', 'numeric'],
            'product_rate' => ['required', 'numeric'],
            'product_total_amount' => ['required', 'numeric'],
            'transporter_id' => ['nullable', 'exists:details,id'],
            'transporter_rate' => ['nullable', 'numeric', 'required_with:transporter_id'],
            'custom_clearance_id' => ['nullable', 'exists:details,id'],
            'custom_clearance_rate' => ['nullable', 'numeric', 'required_with:custom_clearance_id'],
            'freight_forwarder_id' => ['nullable', 'exists:details,id'],
            'freight_forwarder_rate' => ['nullable', 'numeric', 'required_with:freight_forwarder_id'],
            'fc_amount' => ['nullable', 'numeric', 'required_with:freight_forwarder_id'],
            'exchange_rate' => ['nullable', 'numeric', 'required_with:fc_amount'],
            'currency_id' => ['nullable', 'exists:currencies,id', 'required_with:exchange_rate'],
            'total_amount' => ['required', 'numeric'],
            'all_in_one' => ['nullable', 'boolean'],
            'note' => ['nullable'],
        ]);

        try {

            $cro = Cro::find($validated_req['cro_id']);

            if (empty($cro)) {
                throw new Exception('CRO Not Found');
            }

            $allowed_containers = $cro->containers_count;
            $containers_count = $cro->containers()->count();

            if ($containers_count >= $allowed_containers) {
                throw new Exception("This CRO No is Full and you can't add more containers in it");
            }

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
            'container_no' => ['required', 'max:255', 'unique:stock_ins,container_no,'.$id],
            'vehicle_no' => ['nullable', 'max:255'],
            'cro_id' => ['required', 'exists:cros,id'],
            'container_size' => ['required', 'string'],
            'port_location' => ['required', 'in:KICT,KDGL'],
            'vendor_id' => ['required', 'exists:details,id'],
            'product_id' => ['required', 'exists:products,id'],
            'product_weight' => ['required', 'numeric'],
            'product_unit_id' => ['required', 'exists:units,id'],
            'product_weight_in_man' => ['required', 'numeric'],
            'product_no_of_bundles' => ['required', 'numeric'],
            'product_rate' => ['required', 'numeric'],
            'product_total_amount' => ['required', 'numeric'],
            'transporter_id' => ['nullable', 'exists:details,id'],
            'transporter_rate' => ['nullable', 'numeric', 'required_with:transporter_id'],
            'custom_clearance_id' => ['nullable', 'exists:details,id'],
            'custom_clearance_rate' => ['nullable', 'numeric', 'required_with:custom_clearance_id'],
            'freight_forwarder_id' => ['nullable', 'exists:details,id'],
            'freight_forwarder_rate' => ['nullable', 'numeric', 'required_with:freight_forwarder_id'],
            'fc_amount' => ['nullable', 'numeric', 'required_with:freight_forwarder_id'],
            'exchange_rate' => ['nullable', 'numeric', 'required_with:fc_amount'],
            'currency_id' => ['nullable', 'exists:currencies,id', 'required_with:exchange_rate'],
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
