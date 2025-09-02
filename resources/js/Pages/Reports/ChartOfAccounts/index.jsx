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

export default function index({ controls_with_sub_and_details }) {
    const [controlData, setControlData] = useState(controls_with_sub_and_details || []);
    const [selectedControlId, setSelectedControlId] = useState(null);
    const [currentControl, setCurrentControl] = useState(null);

    const printRef = useRef(null);

    useEffect(() => {
        if (controlData && controlData.length > 0) {
            if (!selectedControlId) {
                setSelectedControlId(controlData[0].id);
                setCurrentControl(controlData[0]);
            } else {
                const control = controlData.find((c) => c.id == selectedControlId);
                setCurrentControl(control);
            }
        }
    }, [selectedControlId, controlData]);

    const handlePrintPreview = () => {
        const printWindow = window.open('', '_blank');

        // Build HTML content for all controls
        const allTables = `
    <table class="w-full border-collapse text-xs lg:m-auto lg:w-[600px]">
        <thead>
            <tr class="bg-gray-100 border-b border-gray-300">
                <th class="px-2 py-1 border-r border-gray-300 text-left">Control</th>
                <th class="px-2 py-1 border-r border-gray-300 text-left">Subsidiary</th>
                <th class="px-2 py-1 border-r border-gray-300 text-left">Detail Code</th>
                <th class="px-2 py-1 text-left">Title of Account</th>
            </tr>
        </thead>
        <tbody>
            ${controlData
                .map(
                    (control) => `
                    <tr class="font-bold bg-gray-50">
                        <td class="px-2 py-1 border-r border-gray-300">${control.id} - ${control.name}</td>
                        <td class="px-2 py-1 border-r border-gray-300"></td>
                        <td class="px-2 py-1 border-r border-gray-300"></td>
                        <td class="px-2 py-1"></td>
                    </tr>
                    ${control.subsidaries
                        .map(
                            (sub) => `
                            <tr class="font-semibold">
                                <td class="px-2 py-1 border-r border-gray-300"></td>
                                <td class="px-2 py-1 border-r border-gray-300">${sub.account_code} - ${sub.name}</td>
                                <td class="px-2 py-1 border-r border-gray-300"></td>
                                <td class="px-2 py-1"></td>
                            </tr>
                            ${control.details
                                .filter((det) => det.subsidary_id === sub.id)
                                .map(
                                    (det) => `
                                    <tr class="text-xs">
                                        <td class="px-2 py-1 border-r border-gray-300"></td>
                                        <td class="px-2 py-1 border-r border-gray-300"></td>
                                        <td class="px-2 py-1 border-r border-gray-300">${det.account_code}</td>
                                        <td class="px-2 py-1">${det.title}</td>
                                    </tr>
                                `,
                                )
                                .join('')}
                        `,
                        )
                        .join('')}
                `,
                )
                .join('')}
        </tbody>
    </table>
`;

        // Inject Tailwind and content
        printWindow.document.write(`
        <html>
          <head>
            <title>Chart of Accounts</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="p-6 w-full text-xs lg:m-auto lg:w-[600px]">
            <h1 class="text-2xl font-bold text-center mb-6">Hasnain Enterprises</h1>
            <h2 class="text-lg font-semibold text-center mb-8">Chart Of Accounts</h2>
            <div class='flex justify-end print:hidden my-4'>
                <button onclick="window.print()" class="px-4 py-2 bg-blue-600 text-white rounded">Print</button>
            </div>
            ${allTables}

          </body>
        </html>
    `);

        printWindow.document.close();
    };

    return (
        <AuthenticatedLayout>
            <Head title="Reports - Chart of Accounts" />

            <BreadCrumb
                header={'Reports - Chart of Accounts'}
                parent={'Dashboard'}
                parent_link={route('dashboard')}
                child={'Chart of Accounts'}
            />

            <Card
                Content={
                    <div ref={printRef} className="p-6 bg-white">
                        {/* Header */}
                        <div className="mb-8 text-center">
                            <h1 className="mb-2 text-2xl font-bold text-gray-800">
                                Hasnain Enterprises
                            </h1>
                            <h2 className="text-lg font-semibold text-gray-700">
                                Chart Of Accounts
                            </h2>
                        </div>

                        {/* Control Selection */}
                        <div className="flex items-center justify-between mb-5">
                            <SelectInput
                                key={selectedControlId}
                                InputName={'Select Control'}
                                CustomCss={'w-full md:w-[300px]'}
                                Id={'selectedControlId'}
                                Name={'selectedControlId'}
                                items={controlData.map((con) => ({
                                    id: con.id,
                                    name: `${con.id} - ${con.name}`,
                                }))}
                                Value={selectedControlId}
                                Action={(value) => setSelectedControlId(value)}
                                Placeholder={'Select Control'}
                                Multiple={false}
                                itemKey={'name'}
                                DarkModeSupported={false}
                                Clearable={false}
                            />
                            <button
                                className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                onClick={handlePrintPreview}
                            >
                                Print Preview
                            </button>
                        </div>

                        {/* COA Table */}
                        {currentControl && (
                            <div className="border border-gray-300">
                                <table className="w-full border-collapse text-xs lg:m-auto lg:w-[600px]">
                                    <thead>
                                        <tr className="bg-gray-100 border-b border-gray-300">
                                            <th className="px-2 py-1 text-left border-r border-gray-300">
                                                Control
                                            </th>
                                            <th className="px-2 py-1 text-left border-r border-gray-300">
                                                Subsidiary
                                            </th>
                                            <th className="px-2 py-1 text-left border-r border-gray-300">
                                                Detail Code
                                            </th>
                                            <th className="px-2 py-1 text-left">
                                                Title of Account
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Control Level */}
                                        <tr className="font-bold bg-gray-100">
                                            <td className="px-2 py-1 border-r border-gray-300">
                                                {currentControl.id} - {currentControl.name}
                                            </td>
                                            <td className="px-2 py-1 border-r border-gray-300"></td>
                                            <td className="px-2 py-1 border-r border-gray-300"></td>
                                            <td className="px-2 py-1"></td>
                                        </tr>

                                        {/* Subsidiaries */}
                                        {currentControl.subsidaries.map((sub) => (
                                            <React.Fragment key={sub.id}>
                                                <tr className="font-semibold">
                                                    <td className="px-2 py-1 border-r border-gray-300"></td>
                                                    <td className="px-2 py-1 border-r border-gray-300">
                                                        {sub.code} - {sub.name}
                                                    </td>
                                                    <td className="px-2 py-1 border-r border-gray-300"></td>
                                                    <td className="px-2 py-1"></td>
                                                </tr>

                                                {/* Details */}
                                                {currentControl.details
                                                    .filter((det) => det.subsidary_id === sub.id)
                                                    .map((det) => (
                                                        <tr key={det.id} className="text-xs">
                                                            <td className="px-2 py-1 border-r border-gray-300"></td>
                                                            <td className="px-2 py-1 border-r border-gray-300"></td>
                                                            <td className="px-2 py-1 border-r border-gray-300">
                                                                {det.account_code}
                                                            </td>
                                                            <td className="px-2 py-1">
                                                                {det.title}
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Footer */}
                        {currentControl && (
                            <div className="mt-8 text-xs text-center text-gray-500">
                                <p>Page No: 1 | Generated on: {currentControl.now}</p>
                            </div>
                        )}
                    </div>
                }
            />
        </AuthenticatedLayout>
    );
}
