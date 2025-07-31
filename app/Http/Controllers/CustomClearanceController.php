<?php

namespace App\Http\Controllers;

use App\Models\CustomClearance;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CustomClearanceController extends Controller
{
    public function index()
    {
        $custom_clearances = CustomClearance::latest()->paginate(10);

        return Inertia::render('Setups/CustomClearances/index', compact('custom_clearances'));
    }

    public function store(Request $request)
    {
        $validated_req = $request->validate([
            'name' => ['required'],
            'email' => ['nullable', 'unique:custom_clearances,email'],
            'contact_person' => ['nullable'],
            'address' => ['nullable'],
            'tel_no' => ['nullable'],
            'mobile_no' => ['nullable'],
        ]);

        try {
            if (CustomClearance::create($validated_req)) {
                return back()->with('success', 'Custom Clearance Created Successfully');
            }

            throw new Exception('Something Went Wrong While Creating Custom Clearance');
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
                'server' => 'Custom Clearance ID is Missing',
            ]);
        }

        $validated_req = $request->validate([
            'name' => ['required'],
            'email' => ['nullable', 'unique:custom_clearances,email,'.$id],
            'contact_person' => ['nullable'],
            'address' => ['nullable'],
            'tel_no' => ['nullable'],
            'mobile_no' => ['nullable'],
        ]);

        try {

            $custom_clearance = CustomClearance::find($id);

            if (empty($custom_clearance)) {
                throw new Exception('Custom Clearance Not Found');
            }

            if ($custom_clearance->update($validated_req)) {
                return back()->with('success', 'Custom Clearance Updated Successfully');
            }

            throw new Exception('Something Went Wrong While Updating Custom Clearance');
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
                throw new Exception('Custom Clearance ID is Missing');
            }

            $custom_clearance = CustomClearance::find($id);

            if (empty($custom_clearance)) {
                throw new Exception('Custom Clearance Not Found');
            }

            if ($custom_clearance->delete()) {
                return back()->with('success', 'Custom Clearance Deleted Successfully');
            }

            throw new Exception('Something Went Wrong While Deleting Custom Clearance');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroyBySelection(Request $request)
    {
        try {
            $ids = $request->array('ids');
            if (blank($ids)) {
                throw new Exception('Custom Clearance  ID is Missing');
            }

            $deleted = CustomClearance::destroy($ids);

            if ($deleted !== count($ids)) {
                throw new Exception('Something Went Wrong While Deleting Custom Clearance ');
            }

            return back()->with('success', 'Custom Clearance  Deleted Successfully');

        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
