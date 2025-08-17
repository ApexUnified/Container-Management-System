<?php

namespace App\Http\Controllers;

use App\Models\Control;
use App\Models\Detail;
use App\Models\Subsidary;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class DetailController extends Controller
{
    public function index()
    {
        $details = Detail::with(['control', 'subsidary'])->orderBy('code', 'asc')->paginate(10);
        $controls = Control::all();

        return Inertia::render('Setups/Accounts/Details/index', compact('details', 'controls'));
    }

    public function store(Request $request)
    {
        $validated_req = $request->validate([
            'control_id' => ['required', 'exists:controls,id'],
            'subsidary_id' => ['required', 'exists:subsidaries,id'],
            'title' => ['required', 'max:255'],
            'bank_cash' => ['nullable', 'in:cash,bank'],
            'other_details' => ['nullable', 'max:500'],
            'address' => ['nullable', 'max:500'],
            'ntn_no' => ['nullable', 'max:255'],
            'strn_no' => ['nullable', 'max:255'],
            'email' => ['nullable', 'max:255', 'email'],
            'mobile_no' => ['nullable', 'max:255'],
            'cnic_no' => ['nullable', 'max:255'],
            'opening_balance' => ['nullable', 'numeric'],
        ], [
            'title.required' => 'Detail Account is Required',
            'title.max' => 'Detail Account Must Not Exceed 255 Characters',
        ]);

        try {
            $control = Control::find($validated_req['control_id']);

            if (empty($control)) {
                throw new Exception('Control Not Found');
            }

            $subsidary = Subsidary::find($validated_req['subsidary_id']);

            if (empty($subsidary)) {
                throw new Exception('Subsidary Not Found');
            }

            if ($subsidary->control_id !== $validated_req['control_id']) {
                throw new Exception('Wrong Subsidary Selected Please Select The Correct Subsidary');
            }

            $lastDetail = Detail::where('control_id', $validated_req['control_id'])
                ->where('subsidary_id', $validated_req['subsidary_id'])
                ->latest('code')
                ->first();

            $subsidary_code = explode('-', $subsidary->account_code);

            if (empty($lastDetail)) {
                $sequence = 1;
            } else {
                $lastCode = $lastDetail->account_code;
                $parts = explode('-', $lastCode);
                $sequence = intval($parts[2]) + 1;
            }

            $sequencePadded = str_pad($sequence, 3, '0', STR_PAD_LEFT);
            $validated_req['account_code'] = $control->id.'-'.$subsidary_code[1].'-'.$sequencePadded;
            $validated_req['code'] = $control->id.$subsidary_code[1].$sequencePadded;

            $created = Detail::create($validated_req);

            if (empty($created)) {
                throw new Exception('Something Went Wrong While Adding Detail');
            }

            return back()->with('success', 'Detail Added Successfully');

        } catch (Exception $e) {
            throw ValidationException::withMessages([
                'server' => $e->getMessage(),
            ]);
        }
    }

    public function update(Request $request, string $id)
    {

        if (empty($id)) {
            return back()->with('error', 'Detail ID Not Found');
        }

        $validated_req = $request->validate([
            'title' => ['required', 'max:255'],
            'bank_cash' => ['nullable', 'in:cash,bank'],
            'other_details' => ['nullable', 'max:500'],
            'address' => ['nullable', 'max:500'],
            'ntn_no' => ['nullable', 'max:255'],
            'strn_no' => ['nullable', 'max:255'],
            'email' => ['nullable', 'max:255', 'email'],
            'mobile_no' => ['nullable', 'max:255'],
            'cnic_no' => ['nullable', 'max:255'],
            'opening_balance' => ['nullable', 'numeric'],
        ],
            [
                'title.required' => 'Detail Account is Required',
                'title.max' => 'Detail Account Must Not Exceed 255 Characters',
            ]);
        try {
            $detail = Detail::find($id);

            if (empty($detail)) {
                throw new Exception('Detail Not Found');
            }

            if ($detail->update($validated_req)) {
                return back()->with('success', 'Detail Updated Successfully');
            }

            throw new Exception('Something Went Wrong While Updating Detail');
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
                throw new Exception('Detail ID Not Found');
            }

            $detail = Detail::find($id);

            if (empty($detail)) {
                throw new Exception('Detail Not Found');
            }

            if ($detail->delete()) {
                return back()->with('success', 'Detail Deleted Successfully');
            }

            throw new Exception('Something Went Wrong While Deleting Detail');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroyBySelection(Request $request)
    {
        try {
            $ids = $request->array('ids');
            if (blank($ids)) {
                throw new Exception('Detail ID is Missing');
            }

            $deleted = Detail::destroy($ids);

            if ($deleted !== count($ids)) {
                throw new Exception('Something Went Wrong While Deleting Detail');
            }

            return back()->with('success', 'Details Deleted Successfully');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function getSubsidaryByControl(string $control_id)
    {
        try {
            if (empty($control_id)) {
                throw new Exception('Control ID is Missing');
            }

            $subsidaries = Subsidary::where('control_id', $control_id)->get();

            return response()->json(['status' => true, 'data' => $subsidaries]);
        } catch (Exception $e) {
            return response()->json(['status' => false, 'message' => $e]);
        }
    }
}
