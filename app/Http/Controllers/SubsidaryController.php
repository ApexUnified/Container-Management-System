<?php

namespace App\Http\Controllers;

use App\Models\Control;
use App\Models\Subsidary;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SubsidaryController extends Controller
{
    public function index()
    {
        $subsidaries = Subsidary::with(['control'])->orderBy('code', 'asc')->paginate(10);
        $controls = Control::all();

        return Inertia::render('Setups/Accounts/Subsidaries/index', compact('subsidaries', 'controls'));
    }

    public function store(Request $request)
    {
        $validated_req = $request->validate([
            'name' => ['required',  'unique:subsidaries,name', 'max:255'],
            'control_id' => ['required', 'exists:controls,id'],
        ]);

        try {
            $control = Control::find($validated_req['control_id']);

            if (empty($control)) {
                throw new Exception('Control Not Found');
            }

            $sequence = null;
            $prefix = $control->id;

            $lastSubsidiary = Subsidary::where('code', 'like', $prefix.'%')
                ->orderBy('code', 'desc')
                ->first();

            if (empty($lastSubsidiary)) {

                $sequence = 1;
            } else {
                $lastCode = $lastSubsidiary->code;
                $sequencePart = substr($lastCode, strlen($prefix));
                $sequence = intval($sequencePart) + 1;
            }

            $sequencePadded = str_pad($sequence, 2, '0', STR_PAD_LEFT);

            $code = $prefix.$sequencePadded;
            $account_code = $prefix.'-'.$sequencePadded;

            if (Subsidary::create(array_merge($validated_req, ['code' => $code, 'account_code' => $account_code]))) {
                return back()->with('success', 'Subsidary Created Successfully');
            }

            throw new Exception('Something Went Wrong While Creating Subsidary');
        } catch (Exception $e) {
            throw ValidationException::withMessages([
                'server' => $e->getMessage(),
            ]);
        }
    }

    public function update(Request $request, string $id)
    {

        if (empty($id)) {
            return back()->with('error', 'Subsidary ID Not Found');
        }

        $validated_req = $request->validate([
            'name' => ['required',  'unique:subsidaries,name,'.$id, 'max:255'],
        ]);

        try {
            $subsidary = Subsidary::find($id);

            if (empty($subsidary)) {
                throw new Exception('Subsidary Not Found');
            }

            if ($subsidary->update($validated_req)) {
                return back()->with('success', 'Subsidary Updated Successfully');
            }

            throw new Exception('Something Went Wrong While Updating Subsidary');
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
                return back()->with('error', 'Subsidary ID Not Found');
            }

            $subsidary = Subsidary::find($id);

            if (empty($subsidary)) {
                throw new Exception('Subsidary Not Found');
            }

            if ($subsidary->details()->exists()) {
                throw new Exception($subsidary->name.' Subsidary Account Has '.$subsidary->details()->count().' Detail Account So It Cant Be Deleted');
            }

            if ($subsidary->delete()) {
                return back()->with('success', 'Subsidary Deleted Successfully');
            }

            throw new Exception('Something Went Wrong While Deleting Subsidary');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroyBySelection(Request $request)
    {
        try {
            $ids = $request->array('ids');
            if (blank($ids)) {
                throw new Exception('Subsidary ID is Missing');
            }

            $subsidaries = Subsidary::whereIn('id', $ids)->get();

            if ($subsidaries->isEmpty()) {
                throw new Exception('Something Went Wrong While Deleting Subsidary');
            }

            foreach ($subsidaries as $subsidary) {
                if ($subsidary->details()->exists()) {
                    throw new Exception('Selected '.$subsidary->name.' Subsidary Account Has '.$subsidary->details()->count().' Detail Account So It Cant Be Deleted');
                }
                $subsidary->delete();
            }

            return back()->with('success', 'Subsidary Deleted Successfully');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
