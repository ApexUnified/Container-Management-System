<?php

namespace App\Http\Controllers;

use App\Models\Currency;
use App\Models\Detail;
use App\Models\ReceiptVoucher;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ReceiptVoucherController extends Controller
{
    public function index()
    {
        $receipt_vouchers = ReceiptVoucher::with(['currency', 'account_detail'])->paginate(10);
        $account_details = Detail::all()->map(function ($detail) {
            return [
                'id' => $detail->id,
                'name' => $detail->account_code.' - '.$detail->title,
            ];
        });
        $currencies = Currency::all();

        return Inertia::render('Transactions/ReceiptVouchers/index', compact('receipt_vouchers', 'account_details', 'currencies'));
    }

    public function store(Request $request)
    {
        $validated_req = $request->validate([
            'receipt_date' => ['required', 'date'],
            'received_from' => ['nullable', 'string', 'max:255'],
            'received_details' => ['nullable', 'string'],
            'received_by' => ['required', 'in:bank,cash'],
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

            if ($validated_req['received_by'] == 'bank') {

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

            if ($validated_req['received_by'] == 'cash') {
                $cash_validator = Validator::make($validated_req, [
                    'cash_details.chequebook_id' => ['required', 'exists:details,id'],
                ], [
                    'cash_details.chequebook_id.required' => 'Cash Book is Required Please Select Cash Book',
                    'cash_details.chequebook_id.exists' => 'Selected Cash Book Does Not Exist',
                ]);

                if ($cash_validator->fails()) {
                    throw new Exception($cash_validator->errors()->first());
                }
            }

            $created = ReceiptVoucher::create($validated_req);

            if (empty($created)) {
                throw new Exception('Something Went Wrong While Creating Receipt Voucher');
            }

            return back()->with('success', 'Receipt Voucher Created Successfully');
        } catch (Exception $e) {
            throw ValidationException::withMessages([
                'server' => $e->getMessage(),
            ]);
        }
    }

    public function update(Request $request, string $id)
    {

        if (empty($id)) {
            return back()->with('error', 'Receipt Voucher Not ID Found');
        }

        $validated_req = $request->validate([
            'receipt_date' => ['required', 'date'],
            'received_from' => ['nullable', 'string', 'max:255'],
            'received_details' => ['nullable', 'string'],
            'received_by' => ['required', 'in:bank,cash'],
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
            if ($validated_req['received_by'] == 'bank') {

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

            if ($validated_req['received_by'] == 'cash') {
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

            $receipt_voucher = ReceiptVoucher::find($id);

            if (empty($receipt_voucher)) {
                throw new Exception('Receipt Voucher Does Not Exist');
            }

            $updated = $receipt_voucher->update($validated_req);

            if (! $updated) {
                throw new Exception('Something Went Wrong While Updating Receipt Voucher');
            }

            return back()->with('success', 'Receipt Voucher Updated Successfully');

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
                throw new Exception('Receipt Voucher ID is Not Found');
            }

            $receipt_voucher = ReceiptVoucher::find($id);

            if (empty($receipt_voucher)) {
                throw new Exception('Receipt Voucher Not Found');
            }

            if ($receipt_voucher->delete()) {
                return back()->with('success', 'Receipt Voucher Deleted Successfully');
            }

            throw new Exception('Something Went Wrong While Deleting Receipt Voucher');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroyBySelection(Request $request)
    {
        try {
            $ids = $request->array('ids');
            if (blank($ids)) {
                throw new Exception('Receipt Voucher ID is Not Found');
            }

            $deleted = ReceiptVoucher::destroy($ids);

            if ($deleted !== count($ids)) {
                throw new Exception('Something Went Wrong While Deleting Receipt Voucher');
            }

            return back()->with('success', 'Receipt Voucher Deleted Successfully');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
