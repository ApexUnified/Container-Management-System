import BreadCrumb from '@/Components/BreadCrumb';
import Card from '@/Components/Card';
import Input from '@/Components/Input';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';

export default function index({ details }) {
    const { data, setData } = useForm({
        from_date: '',
        to_date: '',
        from_account_code: '',
        to_account_code: '',
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const [ledgerReportModalOpen, setLedgerReportModalOpen] = useState(false);
    const [ledgerReportData, setLedgerReportData] = useState({});

    const [selectedAccountCode, setSelectedAccountCode] = useState('');
    const [currentAccount, setCurrentAccount] = useState(null);

    useEffect(() => {
        if (ledgerReportData && ledgerReportData.length > 0) {
            if (!selectedAccountCode) {
                // Set first account as default
                setSelectedAccountCode(ledgerReportData[0].account_code);
                setCurrentAccount(ledgerReportData[0]);
            } else {
                // Find selected account
                const account = ledgerReportData.find(
                    (acc) => acc.account_code === selectedAccountCode,
                );
                setCurrentAccount(account);
            }
        }
    }, [ledgerReportData, selectedAccountCode]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    };

    const formatCurrency = (amount) => {
        if (!amount) return '0.00';
        return parseFloat(amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const formatBalance = (amount) => {
        const numAmount = parseFloat(amount) || 0;
        const absAmount = Math.abs(numAmount);
        const formattedAmount = absAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        console.log(amount);

        if (numAmount > 0) {
            return `${formattedAmount} DR`;
        } else if (numAmount < 0) {
            return `${formattedAmount} CR`;
        } else {
            return '0.00';
        }
    };

    const calculateRunningBalance = (transactions) => {
        const openingBalance =
            transactions.length > 0 && transactions[0].opening_balance
                ? parseFloat(transactions[0].opening_balance)
                : 0;

        let runningBalance = openingBalance; // Start with opening balance

        return transactions.map((transaction, index) => {
            const debitAmount = transaction.debit ? parseFloat(transaction.debit) : 0;
            const creditAmount = transaction.credit ? parseFloat(transaction.credit) : 0;

            runningBalance += debitAmount - creditAmount;

            return {
                ...transaction,
                runningBalance,
                openingBalance: index === 0 ? openingBalance : null, // show only once
            };
        });
    };

    const flatpickerRefFromDate = useRef(null);
    const flatpickerRefToDate = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            if (flatpickerRefFromDate.current) {
                flatpickr(flatpickerRefFromDate.current, {
                    dateFormat: 'Y-m-d',
                    disableMobile: true,
                    onChange: function (selectedDates, dateStr) {
                        setData('from_date', dateStr);
                    },
                });
            }

            if (flatpickerRefToDate.current) {
                flatpickr(flatpickerRefToDate.current, {
                    dateFormat: 'Y-m-d',
                    disableMobile: true,
                    onChange: function (selectedDates, dateStr) {
                        setData('to_date', dateStr);
                    },
                });
            }
        }, 500);
    }, []);

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);
        axios
            .post(route('reports.account-ledgers.generate-report'), data)
            .then((res) => {
                if (res.data.status === false) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Info',
                        text: res.data.message,
                    });
                } else {
                    if (res.data.data.length > 0) {
                        setTimeout(() => {
                            setLedgerReportData(res.data.data);
                            setLedgerReportModalOpen(true);
                        }, 1000);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Something Went Wrong',
                        });
                    }
                }
            })
            .catch((error) => {
                if (error.response.status === 422) {
                    setErrors(error.response.data.errors);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.response.data.message,
                    });
                }
                setLedgerReportModalOpen(false);
                setLedgerReportData({});
            })
            .finally(() => {
                setTimeout(() => {
                    setProcessing(false);
                }, 1000);
            });
    };

    const handlePrintPreview = () => {
        const printWindow = window.open('', '_blank');

        const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Accounts Ledger - All Accounts</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; font-size: 12px; }
            .page { min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-start; padding: 20px; box-sizing: border-box; }
            .page-break { page-break-before: always; }
            .header { text-align: center; margin-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .report-title { font-size: 18px; font-weight: bold; }
            .account-info { background-color: #f5f5f5; padding: 15px; margin: 15px 0; border: 1px solid #ddd; }
            .info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 10px; }
            .info-item { font-size: 11px; }
            .info-label { font-weight: bold; }
            .account-title { font-size: 16px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; page-break-inside: auto; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 10px; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .text-right { text-align: right; }
            .total-row { background-color: #f0f0f0; font-weight: bold; }
            .summary { background-color: #e3f2fd; padding: 15px; margin: 15px 0; border: 1px solid #90caf9; }
            .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
            .summary-item { font-size: 12px; }
            .summary-label { font-weight: bold; color: #666; }
            .summary-value { font-size: 16px; font-weight: bold; margin-top: 5px; }
            .debit-color { color: #d32f2f; }
            .credit-color { color: #388e3c; }
            .balance-color { color: #1976d2; }
            .footer { text-align: center; margin-top: auto; font-size: 10px; color: #666; }
            @media print { .page-break { page-break-before: always; } body { margin: 0; } table, tr, td, th { page-break-inside: avoid; } .no-print { display: none !important; } }
        </style>
    </head>
    <body>
        <div style="display: flex; justify-content: end; margin:1rem;" class='no-print' onclick="window.print()">
            <button>Print</button>
        </div>

        ${ledgerReportData
            .map((account, index) => {
                const runningTransactions = calculateRunningBalance(account.transactions);

                // Compute totals from runningTransactions
                const totalDebit = runningTransactions.reduce(
                    (sum, t) => sum + (t.debit ? parseFloat(t.debit) : 0),
                    0,
                );
                const totalCredit = runningTransactions.reduce(
                    (sum, t) => sum + (t.credit ? parseFloat(t.credit) : 0),
                    0,
                );
                const netBalance =
                    (runningTransactions[0]?.opening_balance || 0) +
                    runningTransactions.reduce(
                        (sum, t) =>
                            sum +
                            (t.debit ? parseFloat(t.debit) : 0) -
                            (t.credit ? parseFloat(t.credit) : 0),
                        0,
                    );

                return `
            <div class="page ${index > 0 ? 'page-break' : ''}">
                <div class="header">
                    <div class="company-name">Hasnain Enterprises</div>
                    <div class="report-title">Accounts Ledger</div>
                </div>

                <div class="account-info">
                    <div class="info-grid">
                        <div class="info-item"><div class="info-label">Account Code:</div><div>${account.account_code}</div></div>
                        <div class="info-item"><div class="info-label">FROM:</div><div>${account.from_date || '01/07/2024'}</div></div>
                        <div class="info-item"><div class="info-label">TO:</div><div>${account.to_date || '30/06/2025'}</div></div>
                        <div class="info-item"><div class="info-label">Print Dt:</div><div>${formatDate(new Date())}</div></div>
                    </div>
                    <div class="account-title">Account Title: ${account.account_title}</div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>V Dt</th>
                            <th>Inv # / Voucher #</th>
                            <th>Narration</th>
                            <th class="text-right">Debit</th>
                            <th class="text-right">Credit</th>
                            <th class="text-right">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${runningTransactions
                            .map((t, idx) => {
                                let row = '';
                                if (idx === 0 && t.narration !== 'Opening Balance') {
                                    row += `<tr>
                                    <td>${t.entry_date ? formatDate(t.entry_date) : '-'}</td>
                                    <td>-</td>
                                    <td>Opening Balance</td>
                                    <td class="text-right">-</td>
                                    <td class="text-right">-</td>
                                    <td class="text-right">${formatBalance(t.opening_balance)}</td>
                                </tr>`;
                                }

                                row += `<tr>
                                <td>${t.entry_date ? formatDate(t.entry_date) : '-'}</td>
                                <td>${t.id || '-'}</td>
                                <td>${t.narration || '-'}</td>
                                <td class="text-right">${t.debit ? formatCurrency(t.debit) : '-'}</td>
                                <td class="text-right">${t.credit ? formatCurrency(t.credit) : '-'}</td>
                                <td class="text-right">${formatBalance(t.runningBalance)}</td>
                            </tr>`;
                                return row;
                            })
                            .join('')}
                        <tr class="total-row">
                            <td colspan="3">Total Dr & Cr :</td>
                            <td class="text-right">${formatCurrency(totalDebit)}</td>
                            <td class="text-right">${formatCurrency(totalCredit)}</td>
                            <td class="text-right">${formatBalance(netBalance)}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="summary">
                    <h3>Account Summary</h3>
                    <div class="summary-grid">
                        <div class="summary-item"><div class="summary-label">Total Debits:</div><div class="summary-value debit-color">Rs. ${formatCurrency(totalDebit)}</div></div>
                        <div class="summary-item"><div class="summary-label">Total Credits:</div><div class="summary-value credit-color">Rs. ${formatCurrency(totalCredit)}</div></div>
                        <div class="summary-item"><div class="summary-label">Net Balance:</div><div class="summary-value balance-color">Rs. ${formatBalance(netBalance)}</div></div>
                    </div>
                </div>

                <div class="footer">
                    <p>Page No: ${index + 1} | Generated on: ${formatDate(new Date())}</p>
                </div>
            </div>`;
            })
            .join('')}
    </body>
    </html>
    `;

        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
    };

    return (
        <AuthenticatedLayout>
            <Head title="Reports - Account Ledger" />

            <BreadCrumb
                header={'Reports - Account Ledger'}
                parent={'Dashboard'}
                parent_link={route('dashboard')}
                child={'Account Ledger'}
            />

            <Card
                Content={
                    <>
                        <form onSubmit={submit}>
                            <div className="my-10 grid grid-cols-1 gap-5 p-4 md:grid-cols-2">
                                <Input
                                    InputName={'From Date'}
                                    Id={'from_date'}
                                    Name={'from_date'}
                                    Placeholder={'From Date'}
                                    Type={'text'}
                                    Error={errors?.from_date}
                                    Value={data?.from_date}
                                    Required={true}
                                    Action={(e) => setData('from_date', e.target.value)}
                                    InputRef={flatpickerRefFromDate}
                                />

                                <Input
                                    InputName={'To Date'}
                                    Id={'to_date'}
                                    Name={'to_date'}
                                    Placeholder={'From Date'}
                                    Type={'text'}
                                    Error={errors?.to_date}
                                    Value={data?.to_date}
                                    Required={true}
                                    Action={(e) => setData('to_date', e.target.value)}
                                    InputRef={flatpickerRefToDate}
                                />

                                <SelectInput
                                    InputName={'From Account Code'}
                                    Id={'from_account_code'}
                                    Name={'from_account_code'}
                                    Placeholder={'Enter From Account Code'}
                                    Error={errors?.from_account_code}
                                    Value={data?.from_account_code}
                                    items={details}
                                    itemKey={'name'}
                                    Required={true}
                                    Action={(value) => setData('from_account_code', value)}
                                />

                                <SelectInput
                                    InputName={'To Account Code'}
                                    Id={'to_account_code'}
                                    Name={'to_account_code'}
                                    Placeholder={'Enter To Account Code'}
                                    Error={errors?.to_account_code}
                                    Value={data?.to_account_code}
                                    items={details}
                                    itemKey={'name'}
                                    Required={true}
                                    Action={(value) => setData('to_account_code', value)}
                                />
                            </div>

                            <PrimaryButton
                                CustomClass={'w-[250px] h-[50px] p-4 mx-auto'}
                                Text={'Generate Account Ledger'}
                                Type={'submit'}
                                Processing={processing}
                                Spinner={processing}
                                Disabled={
                                    processing ||
                                    data?.from_date == '' ||
                                    data?.to_date == '' ||
                                    data?.from_account_code == '' ||
                                    data?.to_account_code == ''
                                }
                                Icon={
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"
                                        />
                                    </svg>
                                }
                            />
                        </form>
                    </>
                }
            />

            <div className="border-t border-gray-100 p-6 dark:border-gray-800">
                {ledgerReportModalOpen && currentAccount && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 backdrop-blur-[32px]"
                            onClick={() => setLedgerReportModalOpen(false)}
                        ></div>

                        {/* Modal content */}
                        <div className="relative z-10 max-h-screen w-full max-w-7xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 sm:p-8">
                            <div className="min-h-screen bg-white p-8">
                                <div className="mx-auto max-w-7xl">
                                    {/* Header */}
                                    <div className="mb-8 text-center">
                                        <h1 className="mb-2 text-2xl font-bold text-gray-800">
                                            Hasnain Enterprises
                                        </h1>
                                        <h2 className="text-lg font-semibold text-gray-700">
                                            Accounts Ledger
                                        </h2>
                                    </div>

                                    {/* Account Selection */}
                                    <div className="my-5 flex flex-wrap items-center justify-between gap-4">
                                        {/* Select Input */}
                                        <div className="min-w-0 flex-1">
                                            <SelectInput
                                                key={selectedAccountCode}
                                                InputName={'Select Account'}
                                                CustomCss={'w-full md:w-[300px]'}
                                                Id={'selectedAccountCode'}
                                                Name={'selectedAccountCode'}
                                                items={ledgerReportData.map((account) => ({
                                                    id: account.account_code,
                                                    name: `${account.account_code} - ${account.account_title}`,
                                                }))}
                                                Value={selectedAccountCode}
                                                Action={(value) => setSelectedAccountCode(value)}
                                                Placeholder={'Select Account'}
                                                Multiple={false}
                                                itemKey={'name'}
                                                DarkModeSupported={false}
                                                Clearable={false}
                                            />
                                        </div>

                                        {/* Print Button */}
                                        <button
                                            className="h-[50px] rounded-lg bg-blue-600 px-6 font-medium text-white shadow-md transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            onClick={() => handlePrintPreview()}
                                        >
                                            Print Preview
                                        </button>
                                    </div>

                                    {/* Report Header Info */}
                                    <div className="mb-6 border border-gray-300 bg-gray-50 p-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                                            <div>
                                                <span className="font-semibold">Account Code:</span>
                                                <br />
                                                <span>{currentAccount.account_code}</span>
                                            </div>
                                            <div>
                                                <span className="font-semibold">FROM:</span>
                                                <br />
                                                <span>{currentAccount.from_date}</span>
                                            </div>
                                            <div>
                                                <span className="font-semibold">TO:</span>
                                                <br />
                                                <span>{currentAccount.to_date}</span>
                                            </div>
                                            <div>
                                                <span className="font-semibold">Print Dt:</span>
                                                <br />
                                                <span>{formatDate(new Date())}</span>
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <span className="text-lg font-semibold">
                                                Account Title:{' '}
                                            </span>
                                            <span className="text-lg">
                                                {currentAccount.account_title}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Ledger Table */}
                                    <div className="overflow-x-auto border border-gray-300">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-300 bg-gray-100">
                                                    <th className="border-r border-gray-300 px-3 py-2 text-left font-semibold">
                                                        V Dt
                                                    </th>
                                                    <th className="border-r border-gray-300 px-3 py-2 text-left font-semibold">
                                                        Inv # / Voucher #
                                                    </th>

                                                    <th className="border-r border-gray-300 px-3 py-2 text-left font-semibold">
                                                        Narration
                                                    </th>

                                                    <th className="border-r border-gray-300 px-3 py-2 text-right font-semibold">
                                                        Debit
                                                    </th>
                                                    <th className="border-r border-gray-300 px-3 py-2 text-right font-semibold">
                                                        Credit
                                                    </th>
                                                    <th className="px-3 py-2 text-right font-semibold">
                                                        Balance
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {calculateRunningBalance(
                                                    currentAccount.transactions,
                                                ).map((transaction, index) => {
                                                    const isOpeningBalance =
                                                        transaction.narration === 'Opening Balance';

                                                    return (
                                                        <Fragment key={index}>
                                                            {index == 0 && !isOpeningBalance && (
                                                                <tr key={index + 1}>
                                                                    <td className="border-r border-gray-300 px-3 py-2 text-xs">
                                                                        {transaction.entry_date !=
                                                                        ''
                                                                            ? formatDate(
                                                                                  transaction.entry_date,
                                                                              )
                                                                            : '-'}
                                                                    </td>

                                                                    <td className="border-r border-gray-300 px-3 py-2 text-xs">
                                                                        -
                                                                    </td>

                                                                    <td className="border-r border-gray-300 px-3 py-2 text-xs">
                                                                        Opening Balance
                                                                    </td>

                                                                    <td className="px-3 py-2 text-right font-mono text-xs font-semibold">
                                                                        -
                                                                    </td>

                                                                    <td className="px-3 py-2 text-right font-mono text-xs font-semibold">
                                                                        -
                                                                    </td>

                                                                    <td className="px-3 py-2 text-right font-mono text-xs font-semibold">
                                                                        {formatBalance(
                                                                            transaction?.opening_balance,
                                                                        ) ?? '-'}
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            <tr
                                                                key={index + 2}
                                                                className="border-b border-gray-200 hover:bg-gray-50"
                                                            >
                                                                <td className="border-r border-gray-300 px-3 py-2 text-xs">
                                                                    {transaction.entry_date != ''
                                                                        ? formatDate(
                                                                              transaction.entry_date,
                                                                          )
                                                                        : '-'}
                                                                </td>
                                                                <td className="border-r border-gray-300 px-3 py-2 text-xs">
                                                                    {transaction.id || '-'}
                                                                </td>

                                                                <td className="max-w-xs border-r border-gray-300 px-3 py-2 text-xs">
                                                                    {transaction.narration || '-'}
                                                                </td>

                                                                <td className="border-r border-gray-300 px-3 py-2 text-right font-mono text-xs">
                                                                    {transaction.debit
                                                                        ? formatCurrency(
                                                                              transaction.debit,
                                                                          )
                                                                        : '-'}
                                                                </td>
                                                                <td className="border-r border-gray-300 px-3 py-2 text-right font-mono text-xs">
                                                                    {transaction.credit
                                                                        ? formatCurrency(
                                                                              transaction.credit,
                                                                          )
                                                                        : '-'}
                                                                </td>
                                                                <td className="px-3 py-2 text-right font-mono text-xs font-semibold">
                                                                    {formatBalance(
                                                                        transaction.runningBalance,
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        </Fragment>
                                                    );
                                                })}

                                                {/* Total Row */}
                                                <tr className="border-t-2 border-gray-400 bg-gray-100 font-semibold">
                                                    <td
                                                        className="border-r border-gray-300 px-3 py-2 text-xs"
                                                        colSpan="3"
                                                    >
                                                        Total Dr & Cr :
                                                    </td>
                                                    <td className="border-r border-gray-300 px-3 py-2 text-right font-mono text-xs">
                                                        {formatCurrency(
                                                            currentAccount.transactions.reduce(
                                                                (sum, t) =>
                                                                    sum +
                                                                    (t.debit
                                                                        ? parseFloat(t.debit)
                                                                        : 0),
                                                                0,
                                                            ),
                                                        )}
                                                    </td>
                                                    <td className="border-r border-gray-300 px-3 py-2 text-right font-mono text-xs">
                                                        {formatCurrency(
                                                            currentAccount.transactions.reduce(
                                                                (sum, t) =>
                                                                    sum +
                                                                    (t.credit
                                                                        ? parseFloat(t.credit)
                                                                        : 0),
                                                                0,
                                                            ),
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2"></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Summary Section */}
                                    <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                                        <h3 className="mb-2 font-semibold text-gray-800">
                                            Account Summary
                                        </h3>
                                        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                                            <div>
                                                <span className="font-medium text-gray-600">
                                                    Total Debits:
                                                </span>
                                                <div className="font-mono text-lg font-semibold text-red-600">
                                                    Rs.{' '}
                                                    {(() => {
                                                        const totalDebit =
                                                            currentAccount.transactions.reduce(
                                                                (sum, t) =>
                                                                    sum +
                                                                    (t.debit
                                                                        ? parseFloat(t.debit)
                                                                        : 0),
                                                                0,
                                                            );
                                                        return totalDebit > 0
                                                            ? formatCurrency(totalDebit)
                                                            : '0.00';
                                                    })()}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-600">
                                                    Total Credits:
                                                </span>
                                                <div className="font-mono text-lg font-semibold text-green-600">
                                                    Rs.{' '}
                                                    {(() => {
                                                        const totalCredit =
                                                            currentAccount.transactions.reduce(
                                                                (sum, t) =>
                                                                    sum +
                                                                    (t.credit
                                                                        ? parseFloat(t.credit)
                                                                        : 0),
                                                                0,
                                                            );
                                                        return totalCredit > 0
                                                            ? formatCurrency(totalCredit)
                                                            : '0.00';
                                                    })()}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-600">
                                                    Net Balance:
                                                </span>
                                                <div className="font-mono text-lg font-semibold text-blue-600">
                                                    Rs.{' '}
                                                    {(() => {
                                                        const netBalance =
                                                            (currentAccount.transactions.length >
                                                                0 &&
                                                            currentAccount.transactions[0]
                                                                .opening_balance
                                                                ? parseFloat(
                                                                      currentAccount.transactions[0]
                                                                          .opening_balance,
                                                                  )
                                                                : 0) +
                                                            currentAccount.transactions.reduce(
                                                                (sum, t) =>
                                                                    sum +
                                                                    (t.debit
                                                                        ? parseFloat(t.debit)
                                                                        : 0) -
                                                                    (t.credit
                                                                        ? parseFloat(t.credit)
                                                                        : 0),
                                                                0,
                                                            );
                                                        return formatBalance(netBalance);
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Close Button */}
                                    <div className="mt-6 text-center">
                                        <button
                                            onClick={() => setLedgerReportModalOpen(false)}
                                            className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            Close
                                        </button>
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-8 text-center text-xs text-gray-500">
                                        <p>Page No: 1 | Generated on: {formatDate(new Date())}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
