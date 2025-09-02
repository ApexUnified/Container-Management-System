<?php

namespace App\Http\Controllers;

use App\Models\Transporter;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class TransporterController extends Controller
{
    public function index()
    {
        $transporters = Transporter::latest()->paginate(10);

        return Inertia::render('Setups/Transporters/index', compact('transporters'));
    }

    public function store(Request $request)
    {
        $validated_req = $request->validate([
            'name' => ['required'],
            'email' => ['nullable', 'unique:transporters,email'],
            'contact_person' => ['nullable'],
            'address' => ['nullable'],
            'tel_no' => ['nullable'],
            'mobile_no' => ['nullable'],
        ]);

        try {
            if (transporter::create($validated_req)) {
                return back()->with('success', 'Transporter Created Successfully');
            }

            throw new Exception('Something Went Wrong While Creating Transporter');
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
                'server' => 'Transporter ID is Missing',
            ]);
        }

        $validated_req = $request->validate([
            'name' => ['required'],
            'email' => ['nullable', 'unique:transporters,email,'.$id],
            'contact_person' => ['nullable'],
            'address' => ['nullable'],
            'tel_no' => ['nullable'],
            'mobile_no' => ['nullable'],
        ]);

        try {

            $transporter = Transporter::find($id);

            if (empty($transporter)) {
                throw new Exception('Transporter Not Found');
            }

            if ($transporter->update($validated_req)) {
                return back()->with('success', 'Transporter Updated Successfully');
            }

            throw new Exception('Something Went Wrong While Updating Transporter');
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
                throw new Exception('Transporter ID is Missing');
            }

            $transporter = Transporter::find($id);

            if (empty($transporter)) {
                throw new Exception('Transporter Not Found');
            }

            if ($transporter->delete()) {
                return back()->with('success', 'Transporter Deleted Successfully');
            }

            throw new Exception('Something Went Wrong While Deleting Transporter');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroyBySelection(Request $request)
    {
        try {
            $ids = $request->array('ids');
            if (blank($ids)) {
                throw new Exception('Transporter ID is Missing');
            }

            $deleted = Transporter::destroy($ids);

            if ($deleted !== count($ids)) {
                throw new Exception('Something Went Wrong While Deleting Transporter');
            }

            return back()->with('success', 'Transporter Deleted Successfully');

        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
