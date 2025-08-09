<?php

namespace App\Http\Controllers;

use App\Models\Control;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ControlController extends Controller
{
    public function index()
    {
        $controls = Control::latest()->paginate(10);

        return Inertia::render('Accounts/Controls/index', compact('controls'));
    }

    public function store(Request $request)
    {
        $validated_req = $request->validate([
            'name' => ['required',  'unique:controls,name'],
        ]);

        try {
            if (Control::create($validated_req)) {
                return back()->with('success', 'Control Created Successfully');
            }

            throw new Exception('Something Went Wrong While Creating Control');
        } catch (Exception $e) {
            throw ValidationException::withMessages([
                'server' => $e->getMessage(),
            ]);
        }
    }

    public function update(Request $request, string $id)
    {
        if (empty($id)) {
            return back()->with('error', 'Control ID Not Found');
        }

        $validated_req = $request->validate([
            'name' => ['required',  'unique:controls,name,'.$id],
        ]);

        try {
            $control = Control::find($id);

            if (empty($control)) {
                throw new Exception('Control Not Found');
            }

            if ($control->update($validated_req)) {
                return back()->with('success', 'Control Updated Successfully');
            }

            throw new Exception('Something Went Wrong While Updating Control');
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
                throw new Exception('Control ID Not Found');
            }

            $control = Control::find($id);

            if (empty($control)) {
                throw new Exception('Control Not Found');
            }

            if ($control->delete()) {
                return back()->with('success', 'Control Deleted Successfully');
            }

            throw new Exception('Something Went Wrong While Deleting Control');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroyBySelection(Request $request)
    {
        try {
            $ids = $request->array('ids');
            if (blank($ids)) {
                throw new Exception('Control ID Not Found');
            }
            $deleted = Control::destroy($ids);
            if ($deleted === count($ids)) {
                return back()->with('success', 'Control Deleted Successfully');
            }

            throw new Exception('Something Went Wrong While Deleting Control');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
