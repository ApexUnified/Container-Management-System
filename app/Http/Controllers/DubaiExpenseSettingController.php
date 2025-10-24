<?php

namespace App\Http\Controllers;

use App\Models\DubaiExpenseSetting;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class DubaiExpenseSettingController extends Controller
{
    public function index()
    {
        $dubai_expense_setting = DubaiExpenseSetting::first();

        return inertia('Setups/DubaiExpenseSetting/index', compact('dubai_expense_setting'));
    }

    public function save(Request $request)
    {
        $validated_req = $request->validate([
            'amount' => ['required', 'numeric'],
        ]);

        $setting = DubaiExpenseSetting::first();

        try {
            if ($setting) {
                $setting->update($validated_req);
            } else {
                DubaiExpenseSetting::create($validated_req);
            }

            return back()->with('success', 'Dubai Expense Setting Saved Successfully');
        } catch (Exception $e) {
            throw ValidationException::withMessages([
                'server' => $e->getMessage(),
            ]);
        }
    }
}
