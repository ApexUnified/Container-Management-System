<?php

namespace App\Http\Controllers;

use App\Models\DubaiExpense;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class DubaiExpenseController extends Controller
{
    public function index()
    {
        $dubai_expenses = DubaiExpense::latest()->paginate(10);

        return Inertia::render('Setups/DubaiExpenses/index', compact('dubai_expenses'));
    }

    public function store(Request $request)
    {
        $validated_req = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:255'],
            'amount' => ['nullable', 'numeric'],
        ]);

        try {
            $created = DubaiExpense::create($validated_req);

            if (empty($created)) {
                throw new Exception('Dubai Expense Creation Failed');
            }

            return back()->with('success', 'Dubai Expense Created Successfully');

        } catch (Exception $e) {
            throw ValidationException::withMessages([
                'server' => $e->getMessage(),
            ]);
        }
    }

    public function update(Request $request, string $id)
    {
        if (empty($id)) {
            return back()->with('error', 'Dubai Expense ID is Missing');
        }
        $validated_req = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:255'],
            'amount' => ['nullable', 'numeric'],
        ]);

        try {
            $dubai_expense = DubaiExpense::find($id);
            if (empty($dubai_expense)) {
                throw new Exception('Dubai Expense Not Found');
            }
            $dubai_expense->update($validated_req);

            return back()->with('success', 'Dubai Expense Updated Successfully');

        } catch (Exception $e) {
            throw ValidationException::withMessages([
                'server' => $e->getMessage(),
            ]);
        }
    }

    public function destroy(string $id)
    {
        if (empty($id)) {
            return back()->with('error', 'Dubai Expense ID is Missing');
        }

        try {
            $dubai_expense = DubaiExpense::find($id);
            if (empty($dubai_expense)) {
                throw new Exception('Dubai Expense Not Found');
            }
            $dubai_expense->delete();

            return back()->with('success', 'Dubai Expense Deleted Successfully');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroyBySelection(Request $request)
    {
        try {
            $ids = $request->array('ids');
            if (blank($ids)) {
                throw new Exception('No Dubai Expenses Selected for Deletion');
            }

            $deleted = DubaiExpense::destroy($ids);

            if ($deleted !== count($ids)) {
                throw new Exception('Something Went Wrong While Deleting Dubai Expenses');
            }

            return back()->with('success', 'Selected Dubai Expenses Deleted Successfully');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());

        }
    }
}
