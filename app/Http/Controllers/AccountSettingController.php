<?php

namespace App\Http\Controllers;

use App\Models\AccountSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountSettingController extends Controller
{
    public function index()
    {
        $account_setting = AccountSetting::first();

        return Inertia::render('Setups/AccountSettings/Index', compact('account_setting'));
    }

    public function save(Request $request)
    {
        $validated_req = $request->validate([
            'vendor_expense_code' => ['nullable', 'string', 'max:255'],
            'transporter_expense_code' => ['nullable', 'string', 'max:255'],
            'custom_clearance_expense_code' => ['nullable', 'string', 'max:255'],
            'freight_expense_code' => ['nullable', 'string', 'max:255'],
            'income_code' => ['nullable', 'string', 'max:255'],
            'fiscal_date_from' => ['required', 'date:d-m-Y'],
            'fiscal_date_to' => ['required', 'date:d-m-Y', 'after_or_equal:fiscal_date_from'],
        ]);

        if (AccountSetting::exists()) {
            AccountSetting::first()->update($validated_req);
        } else {
            AccountSetting::create($validated_req);
        }

        return back()->with('success', 'Account settings saved successfully.');
    }
}
