<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class VendorController extends Controller
{
    public function index()
    {
        $vendors = Vendor::latest()->paginate(10);

        return Inertia::render('Setups/Vendors/index', compact('vendors'));
    }

    public function store(Request $request)
    {
        $validated_req = $request->validate([
            'name' => ['required'],
            'email' => ['nullable', 'unique:vendors,email'],
            'contact_person' => ['nullable'],
            'address' => ['nullable'],
            'tel_no' => ['nullable'],
            'mobile_no' => ['nullable'],
        ]);

        try {
            if (Vendor::create($validated_req)) {
                return back()->with('success', 'Vendor Created Successfully');
            }

            throw new Exception('Something Went Wrong While Creating Vendor');
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
                'server' => 'Vendor ID is Missing',
            ]);
        }

        $validated_req = $request->validate([
            'name' => ['required'],
            'email' => ['nullable', 'unique:vendors,email,'.$id],
            'contact_person' => ['nullable'],
            'address' => ['nullable'],
            'tel_no' => ['nullable'],
            'mobile_no' => ['nullable'],
        ]);

        try {

            $vendor = Vendor::find($id);

            if (empty($vendor)) {
                throw new Exception('Vendor Not Found');
            }

            if ($vendor->update($validated_req)) {
                return back()->with('success', 'Vendor Updated Successfully');
            }

            throw new Exception('Something Went Wrong While Updating Vendor');
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
                throw new Exception('Vendor ID is Missing');
            }

            $vendor = Vendor::find($id);

            if (empty($vendor)) {
                throw new Exception('Vendor Not Found');
            }

            if ($vendor->delete()) {
                return back()->with('success', 'Vendor Deleted Successfully');
            }

            throw new Exception('Something Went Wrong While Deleting Vendor');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroyBySelection(Request $request)
    {
        try {
            $ids = $request->array('ids');
            if (blank($ids)) {
                throw new Exception('Vendor ID is Missing');
            }

            $deleted = Vendor::destroy($ids);

            if ($deleted !== count($ids)) {
                throw new Exception('Something Went Wrong While Deleting Vendor');
            }

            return back()->with('success', 'Vendor Deleted Successfully');

        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
