<?php

namespace App\Http\Controllers;

use App\Models\Cro;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CroController extends Controller
{
    public function index()
    {
        $cros = Cro::latest()->paginate(10);

        return Inertia::render('Transactions/Cros/index', compact('cros'));
    }

    public function store(Request $request)
    {
        $validated_req = $request->validate([

            'date' => ['required', 'date'],
            'containers_count' => ['required', 'numeric', 'min:1'],
            'cro_no' => ['required', 'string', 'max:255', 'unique:cros,cro_no'],
        ]);

        try {
            if (Cro::create($validated_req)) {
                return back()->with('success', 'CRO created successfully');
            }

            throw new Exception('Something went wrong While Creating CRO');
        } catch (Exception $e) {
            throw ValidationException::withMessages([
                'server' => $e->getMessage(),
            ]);
        }

    }

    public function update(Request $request, string $id)
    {
        if (empty($id)) {
            return back()->with('error', 'CRO ID Not Found');
        }

        $validated_req = $request->validate([

            'date' => ['required', 'date'],
            'containers_count' => ['required', 'numeric', 'min:1'],
            'cro_no' => ['required', 'string', 'max:255', 'unique:cros,cro_no,'.$id],
        ]);

        try {
            $cro = Cro::find($id);

            if (empty($cro)) {
                throw new Exception('CRO Not Found');
            }

            if ($cro->update($validated_req)) {
                return back()->with('success', 'CRO updated successfully');
            }

            throw new Exception('Something went wrong While Updating CRO');
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
                throw new Exception('CRO ID Not Found');
            }

            $cro = Cro::find($id);

            if (empty($cro)) {
                throw new Exception('CRO Not Found');
            }

            if ($cro->delete()) {
                return back()->with('success', 'CRO Deleted Successfully');
            }

            throw new Exception('CRO Deletion Failed');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroyBySelection(Request $request)
    {
        try {
            $ids = $request->array('ids');

            if (blank($ids)) {
                throw new Exception('CRO ID is Missing');
            }

            $deleted = Cro::destroy($ids);

            if ($deleted !== count($ids)) {
                throw new Exception('Something Went Wrong While Deleting CRO');
            }

            return back()->with('success', 'CRO Deleted Successfully');

        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
