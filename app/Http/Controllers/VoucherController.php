<?php

namespace App\Http\Controllers;

use App\Models\Currency;
use App\Models\Detail;
use App\Models\Voucher;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Validator;

class VoucherController extends Controller
{
    public function index()
    {
        $vouchers = Voucher::with(['currency', 'account_detail'])->paginate(10);
        $account_details = Detail::all();
        $currencies = Currency::all();

        // return $vouchers;

        return Inertia::render('Transactions/Vouchers/index', compact('vouchers', 'account_details', 'currencies'));
    }

    public function store(Request $request)
    {
        // dd($request->all());
        $validated_req = $request->validate([
            'payment_date' => ['required', 'date'],
            'paid_to' => ['nullable', 'string', 'max:255'],
            'payment_details' => ['nullable', 'string'],
            'payment_by' => ['required', 'in:bank,cash'],
            'bank_details' => ['nullable', 'array', 'required_without:cash_details'],
            'cash_details' => ['nullable', 'array', 'required_without:bank_details'],
            'detail_id' => ['required', 'exists:details,id'],
            'currency_id' => ['required', 'exists:currencies,id'],
            'amount' => ['required', 'numeric', 'min:1'],
            'exchange_rate' => ['required', 'numeric', 'min:1'],
            'total_amount' => ['required', 'numeric', 'min:1'],
        ], [
            'detail_id.required' => 'Account is Required',
            'detail_id.exists' => 'Selecte Account Does Not Exist',
            'currency_id.required' => 'Currency is Required',
            'currency_id.exists' => 'Selected Currency Does Not Exist',
        ]);

        try {

            if ($validated_req['payment_by'] == 'bank') {

                $bank_validator = Validator::make($validated_req, [
                    'bank_details.bank_id' => ['required', 'exists:details,id'],
                    'bank_details.cheque_no' => ['nullable', 'string', 'max:255'],
                    'bank_details.cheque_date' => ['nullable', 'date'],
                ], [
                    'bank_details.bank_id.required' => 'Bank is Required Please Select Bank',
                    'bank_details.bank_id.exists' => 'Selected Bank Does Not Exist',
                    'bank_details.cheque_no.max' => 'Cheque No Should Not Exceed 255 Characters',
                    'bank_details.cheque_date.date' => 'Cheque Date Should Be Valid Date',
                ]);

                if ($bank_validator->fails()) {
                    throw new Exception($bank_validator->errors()->first());
                }
            }

            if ($validated_req['payment_by'] == 'cash') {
                $cash_validator = Validator::make($validated_req, [
                    'cash_details.chequebook_id' => ['required', 'exists:details,id'],
                ], [
                    'cash_details.chequebook_id.required' => 'Chequebook is Required Please Select Checkbook',
                    'cash_details.chequebook_id.exists' => 'Selected Checkbook Does Not Exist',
                ]);

                if ($cash_validator->fails()) {
                    throw new Exception($cash_validator->errors()->first());
                }
            }

            $created = Voucher::create($validated_req);

            if (empty($created)) {
                throw new Exception('Something Went Wrong While Creating Voucher');
            }

            return back()->with('success', 'Voucher Created Successfully');
        } catch (Exception $e) {
            throw ValidationException::withMessages([
                'server' => $e->getMessage(),
            ]);
        }
    }

    public function update(Request $request, string $id)
    {

        // dd($request->all());

        if (empty($id)) {
            return back()->with('error', 'Voucher Not ID Found');
        }

        $validated_req = $request->validate([
            'payment_date' => ['required', 'date'],
            'paid_to' => ['nullable', 'string', 'max:255'],
            'payment_details' => ['nullable', 'string'],
            'payment_by' => ['required', 'in:bank,cash'],
            'bank_details' => ['nullable', 'array', 'required_without:cash_details'],
            'cash_details' => ['nullable', 'array', 'required_without:bank_details'],
            'detail_id' => ['required', 'exists:details,id'],
            'currency_id' => ['required', 'exists:currencies,id'],
            'amount' => ['required', 'numeric', 'min:1'],
            'exchange_rate' => ['required', 'numeric', 'min:1'],
            'total_amount' => ['required', 'numeric', 'min:1'],
        ], [
            'detail_id.required' => 'Account is Required',
            'detail_id.exists' => 'Selecte Account Does Not Exist',
            'currency_id.required' => 'Currency is Required',
            'currency_id.exists' => 'Selected Currency Does Not Exist',
        ]);

        try {
            if ($validated_req['payment_by'] == 'bank') {

                $bank_validator = Validator::make($validated_req, [
                    'bank_details.bank_id' => ['required', 'exists:details,id'],
                    'bank_details.cheque_no' => ['nullable', 'string', 'max:255'],
                    'bank_details.cheque_date' => ['nullable', 'date'],
                ], [
                    'bank_details.bank_id.required' => 'Bank is Required Please Select Bank',
                    'bank_details.bank_id.exists' => 'Selected Bank Does Not Exist',
                    'bank_details.cheque_no.max' => 'Cheque No Should Not Exceed 255 Characters',
                    'bank_details.cheque_date.date' => 'Cheque Date Should Be Valid Date',
                ]);

                if ($bank_validator->fails()) {
                    throw new Exception($bank_validator->errors()->first());
                }
            }

            if ($validated_req['payment_by'] == 'cash') {
                $cash_validator = Validator::make($validated_req, [
                    'cash_details.chequebook_id' => ['required', 'exists:details,id'],
                ], [
                    'cash_details.chequebook_id.required' => 'Chequebook is Required Please Select Checkbook',
                    'cash_details.chequebook_id.exists' => 'Selected Checkbook Does Not Exist',
                ]);

                if ($cash_validator->fails()) {
                    throw new Exception($cash_validator->errors()->first());
                }
            }

            $voucher = Voucher::find($id);

            if (empty($voucher)) {
                throw new Exception('Voucher Does Not Exist');
            }

            $updated = $voucher->update($validated_req);

            if (! $updated) {
                throw new Exception('Something Went Wrong While Updating Voucher');
            }

            return back()->with('success', 'Voucher Updated Successfully');

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
                throw new Exception('Voucher ID is Not Found');
            }

            $voucher = Voucher::find($id);

            if (empty($voucher)) {
                throw new Exception('Voucher Not Found');
            }

            if ($voucher->delete()) {
                return back()->with('success', 'Voucher Deleted Successfully');
            }

            throw new Exception('Something Went Wrong While Deleting Voucher');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroyBySelection(Request $request)
    {
        try {
            $ids = $request->array('ids');
            if (blank($ids)) {
                throw new Exception('Voucher ID is Not Found');
            }

            $deleted = Voucher::destroy($ids);

            if ($deleted !== count($ids)) {
                throw new Exception('Something Went Wrong While Deleting Voucher');
            }

            return back()->with('success', 'Voucher Deleted Successfully');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function getAccountDetailsByType(string $type)
    {
        try {
            if (empty($type)) {
                throw new Exception('Account Type is Missing');
            }

            if (! in_array($type, ['bank', 'cash'])) {
                throw new Exception('Invalid Account Type');
            }

            $details = Detail::where('bank_cash', $type)->get();
            if ($details->isEmpty()) {
                throw new Exception('No Account Found From Given Account Type');
            }

            return response()->json(['status' => true, 'type' => $type, 'data' => $details]);

        } catch (Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()]);
        }
    }
}
