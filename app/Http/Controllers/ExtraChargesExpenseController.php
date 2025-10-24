<?php

namespace App\Http\Controllers;

use App\Models\ExtraChargesExpense;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ExtraChargesExpenseController extends Controller
{
    public function index()
    {
        $extra_charges_expenses = ExtraChargesExpense::latest()->paginate(10);

        return Inertia::render('Setups/ExtraChargesExpenses/index', compact('extra_charges_expenses'));
    }

    public function store(Request $request)
    {
        $validated_req = $request->validate([
            'name' => ['required', 'max:255', 'string'],
            'amount' => ['nullable', 'numeric'],
        ]);

        try {
            $created = ExtraChargesExpense::create($validated_req);

            if (empty($created)) {
                throw new Exception('Failed to create Extra Charges Expense');
            }

            return back()->with('success', 'Extra Charges Expense created successfully.');

        } catch (Exception $e) {
            throw new ValidationException([
                'server' => $e->getMessage(),
            ]);
        }
    }

    public function update(Request $request, string $id)
    {
        if (empty($id)) {
            return back()->with('error', 'Extra Charges Expense ID is Missing');
        }

        $validated_req = $request->validate([
            'name' => ['required', 'max:255', 'string'],
            'amount' => ['nullable', 'numeric'],
        ]);

        try {
            $extra_charges_expense = ExtraChargesExpense::find($id);

            if (empty($extra_charges_expense)) {
                throw new Exception('Extra Charges Expense not found');
            }

            $updated = $extra_charges_expense->update($validated_req);
            if (! $updated) {
                throw new Exception('Failed to update Extra Charges Expense');
            }

            return back()->with('success', 'Extra Charges Expense updated successfully.');

        } catch (Exception $e) {
            throw new ValidationException([
                'server' => $e->getMessage(),
            ]);
        }
    }

    public function destroy(string $id)
    {
        if (empty($id)) {
            return back()->with('error', 'Extra Charges Expense ID is Missing');
        }

        try {
            $extra_charges_expense = ExtraChargesExpense::find($id);

            if (empty($extra_charges_expense)) {
                throw new Exception('Extra Charges Expense not found');
            }

            $deleted = $extra_charges_expense->delete();
            if (! $deleted) {
                throw new Exception('Failed to delete Extra Charges Expense');
            }

            return back()->with('success', 'Extra Charges Expense deleted successfully.');

        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());

        }
    }

    public function destroyBySelection(Request $request)
    {
        try {
            $ids = $request->array('ids');
            if (blank($ids)) {
                throw new Exception('No Extra Charges Expense Selected for Deletion');
            }

            $deleted = ExtraChargesExpense::destroy($ids);

            if ($deleted !== count($ids)) {
                throw new Exception('Something Went Wrong While Deleting Extra Charges Expense');
            }

            return back()->with('success', 'Selected Extra Charges Expense Deleted Successfully');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());

        }
    }
}
