<?php

namespace App\Http\Controllers;

use App\Models\ShippingLine;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ShippingLineController extends Controller
{
    public function index()
    {
        $shipping_lines = ShippingLine::latest()->paginate(10);

        return Inertia::render('Setups/ShippingLines/index', compact('shipping_lines'));
    }

    public function store(Request $request)
    {
        $validated_req = $request->validate([
            'name' => ['required'],
            'email' => ['nullable', 'unique:shipping_lines,email'],
            'contact_person' => ['nullable'],
            'address' => ['nullable'],
            'tel_no' => ['nullable'],
            'mobile_no' => ['nullable'],
        ]);

        try {
            if (ShippingLine::create($validated_req)) {
                return back()->with('success', 'Shipping Line Created Successfully');
            }

            throw new Exception('Something Went Wrong While Creating Shipping Line');
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
                'server' => 'Shipping Line ID is Missing',
            ]);
        }

        $validated_req = $request->validate([
            'name' => ['required'],
            'email' => ['nullable', 'unique:shipping_lines,email,'.$id],
            'contact_person' => ['nullable'],
            'address' => ['nullable'],
            'tel_no' => ['nullable'],
            'mobile_no' => ['nullable'],
        ]);

        try {

            $shipping_line = ShippingLine::find($id);

            if (empty($shipping_line)) {
                throw new Exception('Shipping Line Not Found');
            }

            if ($shipping_line->update($validated_req)) {
                return back()->with('success', 'Shipping Line Updated Successfully');
            }

            throw new Exception('Something Went Wrong While Updating Shipping Line');
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
                return back()->with('error', 'Shipping Line ID is Missing');
            }

            $shipping_line = ShippingLine::find($id);

            if (empty($shipping_line)) {
                throw new Exception('Shipping Line Not Found');
            }

            if ($shipping_line->delete()) {
                return back()->with('success', 'Shipping Line Deleted Successfully');
            }

            throw new Exception('Something Went Wrong While Deleting Shipping Line');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroyBySelection(Request $request)
    {
        try {
            $ids = $request->array('ids');
            if (blank($ids)) {
                throw new Exception('Shipping Line ID is Missing');
            }

            $deleted = ShippingLine::destroy($ids);

            if ($deleted !== count($ids)) {
                throw new Exception('Something Went Wrong While Deleting Shipping Line');
            }

            return back()->with('success', 'Shipping Line Deleted Successfully');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
