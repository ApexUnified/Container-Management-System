import BreadCrumb from '@/Components/BreadCrumb';
import Card from '@/Components/Card';
import Input from '@/Components/Input';
import SelectInput from '@/Components/SelectInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import PrimaryButton from '@/Components/PrimaryButton';

const index = ({ stockinData }) => {
    const { data, setData, errors, post, processing } = useForm({
        from_date: '',
        to_date: '',
    });

    const [stockinReportData, setStockinReportData] = useState([]);
    const [reportMeta, setReportMeta] = useState('');

    useEffect(() => {
        if (stockinData && Object.keys(stockinData).length > 0) {
            setStockinReportData(stockinData.stockIns || []);
            setReportMeta(stockinData.now || '');
        }
    }, [stockinData]);

    const flatpickerRefFromDate = useRef(null);
    const flatpickerRefToDate = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            if (flatpickerRefFromDate.current) {
                flatpickr(flatpickerRefFromDate.current, {
                    dateFormat: 'd-m-Y',
                    disableMobile: true,
                    onChange: function (selectedDates, dateStr) {
                        setData('from_date', dateStr);
                    },
                });
            }

            if (flatpickerRefToDate.current) {
                flatpickr(flatpickerRefToDate.current, {
                    dateFormat: 'd-m-Y',
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

        post(route('reports.stockin-report.generate-report'));
    };

    const printRef = useRef(null);

    const handlePrintPreview = () => {
        const w = window.open('', '_blank');
        w.document.write('<html><head><title>StockIn Report</title>');
        w.document.write(
            '<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">',
        );
        w.document.write(`
<style>
  body {
    font-family: system-ui, sans-serif;
    font-size: 10px;
    color: #111;
    margin: 0;
    padding: 0;
  }

  .hide { display: none; }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid #ccc;
    padding: 6px 8px;
    text-align: left;
    vertical-align: top;
    word-wrap: break-word;
    white-space: normal; /* ✅ allows wrapping */
  }

  thead {
    display: table-header-group;
    background: #2563eb;
    color: white;
  }

  tr, td, th {
    font-size: 10px;
  }

  /* Ensure the table stays readable */
  tbody tr:nth-child(even) {
    background: #f9fafb;
  }

  @media print {
    body {
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
      zoom: 0.85; /* slight scaling for wide tables */
    }

    .no-print { display: none !important; }

    table {
      width: 100% !important;
      table-layout: auto !important; /* ✅ dynamic column sizing */
    }

    div, section {
      overflow: visible !important;
      max-height: none !important;
    }

    @page {
      size: A4 landscape;
      margin: 0.5cm;
    }
  }
</style>
`);

        w.document.write('</head><body>');
        w.document.write('<div class="p-2">');
        w.document.write(
            '<div class="no-print mb-4"><button onclick="window.print()" class="px-2 py-2 bg-blue-600 text-white rounded">Print</button></div>',
        );
        w.document.write(`<div>${printRef.current.innerHTML}</div>`);
        w.document.write('</div></body></html>');
        w.document.close();
        w.focus();
    };

    return (
        <AuthenticatedLayout>
            <Head title="Reports - StockIn Report" />

            <BreadCrumb
                header={'Reports - StockIn Report'}
                parent={'Dashboard'}
                parent_link={route('dashboard')}
                child={'StockIn Report'}
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
                            </div>

                            <PrimaryButton
                                CustomClass={'w-[250px] h-[50px] p-4 mx-auto'}
                                Text={'Generate StockIn Report'}
                                Type={'submit'}
                                Processing={processing}
                                Spinner={processing}
                                Disabled={
                                    processing || data?.from_date == '' || data?.to_date == ''
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

            {stockinReportData.length > 0 && (
                <>
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
                        {/* Enhanced Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-300"
                            onClick={() => setStockinReportData([])}
                        />

                        {/* Modal content */}
                        <div
                            ref={printRef}
                            className="max-w-8xl relative z-10 max-h-[95vh] w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl"
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
                                                StockIn Report
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
                                            onClick={() => setStockinReportData([])}
                                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white transition-colors duration-200 hover:bg-white/30"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>

                                {/* Report Info */}
                                <div className="mt-4 flex items-center gap-6 text-sm text-blue-100">
                                    <span>Generated: {reportMeta}</span>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="max-h-[90vh] overflow-auto bg-gray-50/50">
                                <div className="p-2">
                                    {/* Enhanced Purchase Report Table */}
                                    <div className="mt-5 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-md">
                                        <table className="min-w-full border-collapse text-sm">
                                            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                                <tr>
                                                    <th className="px-4 py-3 text-left font-semibold">
                                                        Cont #
                                                    </th>
                                                    <th className="px-4 py-3 text-left font-semibold">
                                                        Purchase Date
                                                    </th>

                                                    <th className="px-4 py-3 text-left font-semibold">
                                                        Vehicle #
                                                    </th>

                                                    <th className="px-4 py-3 text-left font-semibold">
                                                        Vendor Name
                                                    </th>
                                                    <th className="px-4 py-3 text-left font-semibold">
                                                        Product Name
                                                    </th>

                                                    <th className="px-4 py-3 text-left font-semibold">
                                                        Wt
                                                    </th>
                                                    <th className="px-4 py-3 text-left font-semibold">
                                                        Wt (Mann)
                                                    </th>
                                                    <th className="px-4 py-3 text-left font-semibold">
                                                        Bundles
                                                    </th>

                                                    <th className="px-4 py-3 text-left font-semibold">
                                                        Rate
                                                    </th>

                                                    <th className="px-4 py-3 text-left font-semibold">
                                                        Value
                                                    </th>

                                                    <th className="px-4 py-3 text-left font-semibold">
                                                        Transporter Name
                                                    </th>

                                                    <th className="px-4 py-3 text-left font-semibold">
                                                        Transporter Amount
                                                    </th>

                                                    <th className="px-4 py-3 text-left font-semibold">
                                                        C/Cl Name
                                                    </th>

                                                    <th className="px-4 py-3 text-left font-semibold">
                                                        C/Cl Amount
                                                    </th>

                                                    <th className="px-4 py-3 text-left font-semibold">
                                                        F/Frwder Name
                                                    </th>
                                                    <th className="px-4 py-3 text-left font-semibold">
                                                        F/Frwder Amount
                                                    </th>

                                                    <th className="px-4 py-3 text-left font-semibold">
                                                        Total Value
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 text-gray-700">
                                                {stockinReportData.map((item, index) => (
                                                    <tr
                                                        key={index}
                                                        className={`transition hover:bg-blue-50 ${
                                                            index % 2 === 0
                                                                ? 'bg-gray-50/50'
                                                                : 'bg-white'
                                                        }`}
                                                    >
                                                        <td className="px-4 py-3">
                                                            {item.container_no ?? 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {item.purchase_date ?? 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {item.vehicle_no ?? 'N/A'}
                                                        </td>

                                                        <td className="px-4 py-3">
                                                            {item.vendor_name ?? 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {item.product_name ?? 'N/A'}
                                                        </td>

                                                        <td className="px-4 py-3 text-right">
                                                            {item.weight ?? 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            {item.weight_in_mann ?? 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            {item.bundles ?? 'N/A'}
                                                        </td>

                                                        <td className="px-4 py-3 text-right">
                                                            {item.rate ?? 'N/A'}
                                                        </td>

                                                        <td className="px-4 py-3 text-right font-medium text-blue-600">
                                                            {item.product_total_amount ?? 'N/A'}
                                                        </td>

                                                        <td className="px-4 py-3 text-right">
                                                            {item.transporter_name ?? 'N/A'}
                                                        </td>

                                                        <td className="px-4 py-3 text-right font-medium text-blue-600">
                                                            {item.transporter_amount ?? 'N/A'}
                                                        </td>

                                                        <td className="px-4 py-3 text-right">
                                                            {item.customer_clearance_name ?? 'N/A'}
                                                        </td>

                                                        <td className="px-4 py-3 text-right font-medium text-blue-600">
                                                            {item.customer_clearance_amount ??
                                                                'N/A'}
                                                        </td>

                                                        <td className="px-4 py-3 text-right">
                                                            {item.freight_forwarder_name ?? 'N/A'}
                                                        </td>

                                                        <td className="px-4 py-3 text-right font-medium text-blue-600">
                                                            {item.freight_forwarder_amount ?? 'N/A'}
                                                        </td>

                                                        <td className="px-4 py-3 text-right font-medium text-blue-900">
                                                            {item.total_value ?? 'N/A'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Footer Info */}
                                    <div className="mt-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 shadow-sm">
                                        <div className="text-right">
                                            <div className="font-medium">
                                                Generated on: {reportMeta}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </AuthenticatedLayout>
    );
};

export default index;
