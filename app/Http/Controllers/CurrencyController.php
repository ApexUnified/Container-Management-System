<?php

namespace App\Http\Controllers;

use App\Models\Currency;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CurrencyController extends Controller
{
    public function index()
    {
        $currencies = Currency::latest()->paginate(10);

        return Inertia::render('Setups/Currencies/index', compact('currencies'));
    }

    public function store(Request $request)
    {
        $validated_req = $request->validate([
            'name' => ['required', 'unique:currencies,name'],
        ]);

        try {
            if (Currency::create($validated_req)) {
                return back()->with('success', 'Currency Created Successfully');
            }

            throw new Exception('Currency Creation Failed');
        } catch (Exception $e) {
            throw ValidationException::withMessages([
                'server' => $e->getMessage(),
            ]);
        }
    }

    public function update(Request $request, string $id)
    {
        if (empty($id)) {
            return back()->with('error', 'Currency ID Found');
        }

        $validated_req = $request->validate([
            'name' => ['required', 'unique:currencies,name,'.$id],
        ]);

        try {
            $currency = Currency::find($id);

            if (empty($currency)) {
                throw new Exception('Currency Not Found');
            }

            if ($currency->update($validated_req)) {
                return back()->with('success', 'Currency Updated Successfully');
            }

            throw new Exception('Currency Update Failed');
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
                throw new Exception('Currency ID Found');
            }

            $currency = Currency::find($id);

            if (empty($currency)) {
                throw new Exception('Currency Not Found');
            }

            if ($currency->delete()) {
                return back()->with('success', 'Currency Deleted Successfully');
            }

            throw new Exception('Currency Deletion Failed');
        } catch (Exception $e) {

            return back()->with('error', $e->getMessage());
        }

    }

    public function destroyBySelection(Request $request)
    {
        try {
            $ids = $request->array('ids');
            if (blank($ids)) {
                throw new Exception('Currency ID is Missing');
            }

            $deleted = Currency::destroy($ids);

            if ($deleted !== count($ids)) {
                throw new Exception('Something Went Wrong While Deleting Currency');
            }

            return back()->with('success', 'Currency Deleted Successfully');

        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
