import BreadCrumb from '@/Components/BreadCrumb';
import Card from '@/Components/Card';
import Input from '@/Components/Input';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import axios from 'axios';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';

export default function index() {
    const [trialBalanceModalOpen, setTrialBalanceModalOpen] = useState(false);
    const [trialBalanceData, setTrialBalanceData] = useState({});
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const { data, setData } = useForm({
        from_date: '',
        to_date: '',
        cols: '',
    });

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
            .post(route('reports.trial-balances.generate-report'), data)
            .then((res) => {
                if (res.data.status === false) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Info',
                        text: res.data.message,
                    });
                } else {
                    setTrialBalanceData(res.data.data);
                    setTrialBalanceModalOpen(true);
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'info',
                    title: 'Info',
                    text: error,
                });
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    const printRef = useRef();
    const handlePrintPreview = () => {
        const w = window.open('', '_blank');
        w.document.write('<html><head><title>Trial Balance Report</title>');
        w.document.write(
            '<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">',
        );
        w.document.write(`
    <style>
      .hide { display: none }
      @media print {
        .no-print { display: none !important; }
        thead { display: table-row-group; }   /* <— stop repeating header */
        tfoot { display: table-row-group; }   /* already set to not repeat */
        tr, td, th { page-break-inside: avoid; }
        .sticky, .sticky * { position: static !important; } /* disable any sticky in print */
      }
    </style>
  `);
        w.document.write('</head><body>');
        w.document.write('<div class="p-4">');
        w.document.write(
            '<div class="no-print mb-4"><button onclick="window.print()" class="px-4 py-2 bg-blue-600 text-white rounded">Print</button></div>',
        );
        w.document.write(`<div>${printRef.current.innerHTML}</div>`);
        w.document.write('</div></body></html>');
        w.document.close();
        w.focus();
    };

    return (
        <AuthenticatedLayout>
            <Head title="Reports - Trial Balance" />

            <BreadCrumb
                header={'Reports - Trial Balance'}
                parent={'Dashboard'}
                parent_link={route('dashboard')}
                child={'Trial Balance'}
            />

            <Card
                Content={
                    <>
                        <form onSubmit={submit}>
                            <div className="my-10 grid grid-cols-1 gap-5 p-4 md:grid-cols-3">
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
                                    InputName={'Columns'}
                                    Id={'cols'}
                                    Name={'cols'}
                                    Placeholder={'Select Columns'}
                                    Error={errors?.cols}
                                    Value={data?.cols}
                                    items={[
                                        { id: 2, name: '2 Columns' },
                                        { id: 6, name: '6 Columns' },
                                    ]}
                                    itemKey={'name'}
                                    Required={true}
                                    Action={(value) => setData('cols', value)}
                                />
                            </div>

                            <PrimaryButton
                                CustomClass={'w-[250px] h-[50px] p-4 mx-auto'}
                                Text={'Generate Trial Balance'}
                                Type={'submit'}
                                Processing={processing}
                                Spinner={processing}
                                Disabled={
                                    processing ||
                                    data?.from_date == '' ||
                                    data?.to_date == '' ||
                                    data?.cols == ''
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
                {trialBalanceModalOpen && trialBalanceData && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
                        {/* Enhanced Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-300"
                            onClick={() => setTrialBalanceModalOpen(false)}
                        />

                        {/* Modal content */}
                        <div
                            ref={printRef}
                            className="relative z-10 max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl"
                        >
                            {/* Header Section */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                                            <span className="text-xl font-bold text-white">H</span>
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-white">
                                                Hasnain Enterprises
                                            </h1>
                                            <p className="text-sm font-medium text-blue-100">
                                                Trial Balance Report
                                            </p>
                                        </div>
                                    </div>

                                    <div className="hide flex items-center gap-3">
                                        <button
                                            onClick={() => handlePrintPreview()}
                                            className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-white transition-colors duration-200 hover:bg-white/30"
                                        >
                                            <span className="text-sm font-medium">Print</span>
                                        </button>

                                        <button
                                            onClick={() => setTrialBalanceModalOpen(false)}
                                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white transition-colors duration-200 hover:bg-white/30"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>

                                {/* Report Info */}
                                <div className="mt-4 flex items-center gap-6 text-sm text-blue-100">
                                    <span>Generated: {trialBalanceData.now}</span>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="max-h-[calc(95vh-140px)] overflow-auto bg-gray-50/50">
                                <div className="p-8">
                                    {/* Enhanced Table */}
                                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                        <div className="max-h-[700px] overflow-x-auto">
                                            <table className="w-full">
                                                {/* Table Header */}
                                                <thead className="sticky top-0 z-20 bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                                                    <tr className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                                                        <th className="px-4 py-4 text-left text-sm font-semibold">
                                                            Account Code
                                                        </th>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold">
                                                            Account Title
                                                        </th>
                                                        <th className="border-l border-gray-600 px-4 py-4 text-center text-sm font-semibold">
                                                            <div className="text-center">
                                                                <div className="font-bold">
                                                                    Opening Balance
                                                                </div>
                                                                <div className="mt-1 text-xs text-gray-300">
                                                                    Debit
                                                                </div>
                                                            </div>
                                                        </th>
                                                        <th className="px-4 py-4 text-center text-sm font-semibold">
                                                            <div className="text-center">
                                                                <div className="font-bold">
                                                                    Opening Balance
                                                                </div>
                                                                <div className="mt-1 text-xs text-gray-300">
                                                                    Credit
                                                                </div>
                                                            </div>
                                                        </th>
                                                        {trialBalanceData.columns == 6 && (
                                                            <>
                                                                <th className="border-l border-gray-600 px-4 py-4 text-center text-sm font-semibold">
                                                                    <div className="text-center">
                                                                        <div className="font-bold">
                                                                            To Date
                                                                        </div>
                                                                        <div className="mt-1 text-xs text-gray-300">
                                                                            Debit
                                                                        </div>
                                                                    </div>
                                                                </th>
                                                                <th className="px-4 py-4 text-center text-sm font-semibold">
                                                                    <div className="text-center">
                                                                        <div className="font-bold">
                                                                            To Date
                                                                        </div>
                                                                        <div className="mt-1 text-xs text-gray-300">
                                                                            Credit
                                                                        </div>
                                                                    </div>
                                                                </th>
                                                                <th className="border-l border-gray-600 px-4 py-4 text-center text-sm font-semibold">
                                                                    <div className="text-center">
                                                                        <div className="font-bold">
                                                                            Closing Balance
                                                                        </div>
                                                                        <div className="mt-1 text-xs text-gray-300">
                                                                            Debit
                                                                        </div>
                                                                    </div>
                                                                </th>
                                                                <th className="px-4 py-4 text-center text-sm font-semibold">
                                                                    <div className="text-center">
                                                                        <div className="font-bold">
                                                                            Closing Balance
                                                                        </div>
                                                                        <div className="mt-1 text-xs text-gray-300">
                                                                            Credit
                                                                        </div>
                                                                    </div>
                                                                </th>
                                                            </>
                                                        )}
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {trialBalanceData?.subsidaries?.map(
                                                        (section, idx) => (
                                                            <Fragment key={idx}>
                                                                {/* Section Header */}
                                                                <tr className="border-2 border-blue-200 bg-blue-50">
                                                                    <td
                                                                        colSpan={8}
                                                                        className="px-6 py-4"
                                                                    >
                                                                        <h3 className="whitespace-pre-line text-lg font-bold leading-tight text-blue-700">
                                                                            {section.header}
                                                                        </h3>
                                                                    </td>
                                                                </tr>

                                                                {/* All Account Details */}
                                                                {section.accounts?.map((acc, i) => (
                                                                    <tr
                                                                        key={i}
                                                                        className="border-b border-gray-100 transition-colors duration-150 hover:bg-blue-50/50"
                                                                    >
                                                                        <td className="bg-gray-50/50 px-4 py-3 font-mono text-sm text-gray-700">
                                                                            {acc.account_code}
                                                                        </td>
                                                                        <td className="px-6 py-3 text-sm font-medium text-gray-800">
                                                                            {acc.account_title}
                                                                        </td>
                                                                        <td className="border-l border-gray-200 px-4 py-3 text-right text-sm font-medium">
                                                                            {acc.opening_balance.debit.toFixed(
                                                                                2,
                                                                            )}
                                                                        </td>
                                                                        <td className="px-4 py-3 text-right text-sm font-medium">
                                                                            {acc.opening_balance.credit.toFixed(
                                                                                2,
                                                                            )}
                                                                        </td>
                                                                        {trialBalanceData.columns ==
                                                                            6 && (
                                                                            <>
                                                                                <td className="border-l border-gray-200 px-4 py-3 text-right text-sm font-medium">
                                                                                    {acc.to_date_transactions.debit.toFixed(
                                                                                        2,
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-4 py-3 text-right text-sm font-medium">
                                                                                    {acc.to_date_transactions.credit.toFixed(
                                                                                        2,
                                                                                    )}
                                                                                </td>
                                                                                <td className="border-l border-gray-200 px-4 py-3 text-right text-sm font-bold">
                                                                                    {acc.closing_balance.debit.toFixed(
                                                                                        2,
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-4 py-3 text-right text-sm font-bold">
                                                                                    {acc.closing_balance.credit.toFixed(
                                                                                        2,
                                                                                    )}
                                                                                </td>
                                                                            </>
                                                                        )}
                                                                    </tr>
                                                                ))}

                                                                {/* Section Totals */}
                                                                <tr className="border-t-2 border-gray-300 bg-gradient-to-r from-gray-100 to-gray-50">
                                                                    <td
                                                                        colSpan="2"
                                                                        className="px-6 py-4 text-left font-bold text-gray-800"
                                                                    >
                                                                        Total of{' '}
                                                                        {section.subsidiary}
                                                                    </td>
                                                                    <td className="border-l border-gray-300 px-4 py-4 text-right font-bold">
                                                                        {section.total_opening_balance.debit.toFixed(
                                                                            2,
                                                                        )}
                                                                    </td>
                                                                    <td className="px-4 py-4 text-right font-bold">
                                                                        {section.total_opening_balance.credit.toFixed(
                                                                            2,
                                                                        )}
                                                                    </td>

                                                                    {trialBalanceData.columns ==
                                                                        6 && (
                                                                        <>
                                                                            <td className="border-l border-gray-300 px-4 py-4 text-right font-bold">
                                                                                {section.total_to_date_transaction.debit.toFixed(
                                                                                    2,
                                                                                )}
                                                                            </td>
                                                                            <td className="px-4 py-4 text-right font-bold">
                                                                                {section.total_to_date_transaction.credit.toFixed(
                                                                                    2,
                                                                                )}
                                                                            </td>
                                                                            <td className="border-l border-gray-300 px-4 py-4 text-right text-lg font-bold">
                                                                                {section.total_closing_balance.debit.toFixed(
                                                                                    2,
                                                                                )}
                                                                            </td>
                                                                            <td className="px-4 py-4 text-right text-lg font-bold">
                                                                                {section.total_closing_balance.credit.toFixed(
                                                                                    2,
                                                                                )}
                                                                            </td>
                                                                        </>
                                                                    )}
                                                                </tr>
                                                            </Fragment>
                                                        ),
                                                    )}
                                                </tbody>

                                                {/* Grand Totals */}
                                                <tfoot className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                                    <tr>
                                                        <td
                                                            colSpan="2"
                                                            className="px-6 py-5 text-left"
                                                        >
                                                            <div className="text-lg font-bold">
                                                                Grand Totals
                                                            </div>
                                                        </td>
                                                        <td className="border-l border-blue-500 px-4 py-5 text-right text-lg font-bold">
                                                            {trialBalanceData.totals.opening_balance.debit.toFixed(
                                                                2,
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-5 text-right text-lg font-bold">
                                                            {trialBalanceData.totals.opening_balance.credit.toFixed(
                                                                2,
                                                            )}
                                                        </td>
                                                        {trialBalanceData.columns == 6 && (
                                                            <>
                                                                <td className="border-l border-blue-500 px-4 py-5 text-right text-lg font-bold">
                                                                    {trialBalanceData.totals.to_date_transactions.debit.toFixed(
                                                                        2,
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-5 text-right text-lg font-bold">
                                                                    {trialBalanceData.totals.to_date_transactions.credit.toFixed(
                                                                        2,
                                                                    )}
                                                                </td>
                                                                <td className="border-l border-blue-500 px-4 py-5 text-right text-xl font-bold">
                                                                    {trialBalanceData.totals.closing_balance.debit.toFixed(
                                                                        2,
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-5 text-right text-xl font-bold">
                                                                    {trialBalanceData.totals.closing_balance.credit.toFixed(
                                                                        2,
                                                                    )}
                                                                </td>
                                                            </>
                                                        )}
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Footer Info */}
                                    <div className="mt-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 shadow-sm">
                                        <div className="text-right">
                                            <div className="font-medium">
                                                Generated on: {trialBalanceData.now}
                                            </div>
                                        </div>
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
