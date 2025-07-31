<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class UnitController extends Controller
{
    public function index()
    {
        $units = Unit::latest()->paginate(10);

        return Inertia::render('Setups/Units/index', compact('units'));
    }

    public function store(Request $request)
    {
        $validated_req = $request->validate([
            'name' => ['required'],
        ]);

        try {
            if (Unit::create($validated_req)) {
                return back()->with('success', 'Unit created successfully');
            }

            throw new Exception('Something went wrong While Creating Unit');
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
                'server' => 'Unit ID is Missing',
            ]);
        }

        $validated_req = $request->validate([
            'name' => ['required'],
        ]);

        try {
            $unit = Unit::find($id);

            if (empty($unit)) {
                throw new Exception('Unit does not exist');
            }

            if ($unit->update($validated_req)) {
                return back()->with('success', 'Unit updated successfully');
            }

            throw new Exception('Something went wrong While Updating Unit');
        } catch (Exception $e) {
            throw ValidationException::withMessages([
                'server' => $e->getMessage(),
            ]);
        }

    }

    public function destroy(string $id)
    {
        if (empty($id)) {
            return back()->with('error', 'Unit ID is Missing');
        }

        try {
            $unit = Unit::find($id);

            if (empty($unit)) {
                throw new Exception('Unit does not exist');
            }

            if ($unit->delete()) {
                return back()->with('success', 'Unit deleted successfully');
            }

            throw new Exception('Something went wrong While Deleting Unit');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroyBySelection(Request $request)
    {
        $ids = $request->array('ids');

        if (blank($ids)) {
            return back()->with('error', 'Unit ID is Missing');
        }

        try {
            $deleted = Unit::destroy($ids);
            if ($deleted != count($ids)) {
                throw new Exception('Something went wrong While Deleting Unit');
            }

            return back()->with('success', 'Unit deleted successfully');

        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
