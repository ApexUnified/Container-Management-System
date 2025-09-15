<?php

namespace App\Http\Controllers;

use App\Models\AccountSetting;
use App\Models\Detail;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountSettingController extends Controller
{
    public function index()
    {
        $account_setting = AccountSetting::first();

        $account_codes = Detail::select(['account_code', 'title', 'id'])->get()
            ->map(function ($detail) {
                return [
                    'account_code' => $detail->account_code,
                    'name' => $detail->account_code.' - '.$detail->title,
                    'id' => $detail->id,
                ];
            });

        return Inertia::render('Setups/AccountSettings/Index', compact('account_setting', 'account_codes'));
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

        if ($request->filled('income_code')) {
            if (Detail::where('account_code', $validated_req['vendor_expense_code'])->doesntExist()) {
                return back()->with('error', 'Invalid Vendor Expense Account Code.');
            }

        }

        if ($request->filled('transporter_expense_code')) {
            if (Detail::where('account_code', $validated_req['transporter_expense_code'])->doesntExist()) {
                return back()->with('error', 'Invalid Transporter Expense Account Code.');
            }
        }

        if ($request->filled('custom_clearance_expense_code')) {
            if (Detail::where('account_code', $validated_req['custom_clearance_expense_code'])->doesntExist()) {
                return back()->with('error', 'Invalid Custom Clearance Expense Account Code.');
            }
        }

        if ($request->filled('freight_expense_code')) {
            if (Detail::where('account_code', $validated_req['freight_expense_code'])->doesntExist()) {
                return back()->with('error', 'Invalid Freight Expense Account Code.');
            }
        }

        if (AccountSetting::exists()) {
            AccountSetting::first()->update($validated_req);
        } else {
            AccountSetting::create($validated_req);
        }

        return back()->with('success', 'Account settings saved successfully.');
    }
}
