import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BreadCrumb from '@/Components/BreadCrumb';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import Input from '@/Components/Input';
import PrimaryButton from '@/Components/PrimaryButton';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import SelectInput from '@/Components/SelectInput';

export default function index({ expenses = {}, expense_setting }) {
    const { props } = usePage();
    // const {
    //     data: data,
    //     setData: setData,
    //     post: post,
    //     errors: errors,
    //     processing: processing,
    // } = useForm({
    //     bl_no: '',
    // });

    const [blExpenses, setBlExpenses] = useState([]);
    const [tonExpenses, setTonExpenses] = useState([]);
    const [containerExpensesList, setContainerExpensesList] = useState([]);

    useEffect(() => {
        if (Object.values(expenses).length === 0) return;

        const blExpenses = expenses?.filter((e) => e.type === 'bl');
        const tonExpenses = expenses?.filter((e) => e.type === 'ton');
        const containerExpensesList = expenses?.filter((e) => e.type === 'container');

        setBlExpenses(blExpenses);
        setTonExpenses(tonExpenses);
        setContainerExpensesList(containerExpensesList);
    }, [expenses]);

    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [blNo, setBlNo] = useState('');
    const [processing, setProcessing] = useState(false);
    const [bl_results, setBlResults] = useState({});

    const [selectedBlExpenses, setSelectedBlExpenses] = useState(null);
    const [selectedTonExpenses, setSelectedTonExpenses] = useState(null);

    const [totalAmount, setTotalAmount] = useState(0);
    const [containerExpenses, setContainerExpenses] = useState({
        containers: [],
        bl_no: '',
        bl_date: '',
        containers_count: 0,
        weight_in_tons: 0,
        total_amount: 0,
        mofa_amount: expense_setting?.amount || 0,
        applied_mofa: 0,
        applied_vat: 0,
    });

    const findContainers = (e) => {
        e.preventDefault();
        setProcessing(true);
        axios
            .post(route('transactions.dubai-expense-transactions.find-containers'), { bl_no: blNo })
            .then((response) => {
                if (response.data.status) {
                    setBlResults(response.data.data);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No containers found for the provided B/L No.',
                    });
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error! ' + error.response.data.error,
                });
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    useEffect(() => {
        if (Object.values(bl_results).length > 0) {
            const containersWithBase = bl_results.containers.map((c) => ({
                ...c,
                base_amount: parseFloat(c.total_amount || 0),
            }));

            const amount = containersWithBase.reduce((sum, item) => {
                return sum + parseFloat(item.base_amount || 0);
            }, 0);

            setTotalAmount(parseFloat(amount));

            setContainerExpenses({
                bl_no: bl_results.bl_no,
                bl_date: bl_results.bl_date,
                containers_count: bl_results.containers_count,
                weight_in_tons: bl_results.weight_in_tons,
                containers: containersWithBase,
                total_amount: parseFloat(amount),
                mofa_amount: expense_setting?.amount || 0,
                applied_mofa: 0,
                applied_vat: 0,
            });

            setViewModalOpen(true);
        } else {
            setContainerExpenses({
                containers: [],
                bl_no: '',
                bl_date: '',
                containers_count: 0,
                weight_in_tons: 0,
                total_amount: 0,
                mofa_amount: expense_setting?.amount || 0,
                applied_mofa: 0,
                applied_vat: 0,
            });
            setViewModalOpen(false);
            setSelectedBlExpenses([]);
            setSelectedTonExpenses([]);
        }
    }, [bl_results]);

    const handleExpenseSelect = async (containerId, selectedExpenseNames) => {
        const current = structuredClone(containerExpenses);

        if (!current?.containers?.length) return;

        const updatedContainers = await Promise.all(
            current.containers.map(async (container) => {
                if (container.container_id !== containerId) return container;

                const previous = container.container_expenses || [];
                const baseAmount = parseFloat(container.base_amount || 0);

                // Build list of newly selected container expenses
                let selectedExpenseObjects = expenses
                    .filter(
                        (exp) =>
                            exp.type === 'container' && selectedExpenseNames.includes(exp.name),
                    )
                    .map((exp) => {
                        const old = previous.find((p) => p.name === exp.name);
                        return {
                            name: exp.name,
                            amount: old ? parseFloat(old.amount) : parseFloat(exp.amount) || '',
                        };
                    });

                // Prompt for missing ones
                for (let exp of selectedExpenseObjects.filter((e) => e.amount === '')) {
                    const { value, isConfirmed } = await Swal.fire({
                        title: `Enter amount for ${exp.name}`,
                        input: 'number',
                        inputPlaceholder: 'Enter custom amount (AED)',
                        showCancelButton: true,
                        confirmButtonText: 'Save',
                        confirmButtonColor: '#2563eb',
                    });

                    if (isConfirmed && value && !isNaN(value)) {
                        exp.amount = parseFloat(value);
                    } else if (!isConfirmed) {
                        selectedExpenseObjects = selectedExpenseObjects.filter(
                            (x) => x.name !== exp.name,
                        );
                    } else {
                        exp.amount = 0;
                    }
                }

                // Calculate total
                const expenseTotal = selectedExpenseObjects.reduce(
                    (sum, exp) => sum + (parseFloat(exp.amount) || 0),
                    0,
                );

                const newTotal = baseAmount + expenseTotal;

                return {
                    ...container,
                    container_expenses: selectedExpenseObjects,
                    total_amount: parseFloat(newTotal),
                };
            }),
        );

        const { grandTotal, mofaAmount, vatAmount } = recalculateTotal(
            { ...current, containers: updatedContainers },
            current.bl_expenses || [],
            current.ton_expenses || [],
        );

        setContainerExpenses({
            ...current,
            containers: updatedContainers,
            total_amount: grandTotal,
            applied_mofa: mofaAmount,
            applied_vat: vatAmount,
        });
        setTotalAmount(grandTotal);
    };

    const handleBLExpenseSelect = async (selectedNames) => {
        const previous = containerExpenses.bl_expenses || [];

        let selected = blExpenses
            .filter((exp) => selectedNames.includes(exp.name))
            .map((exp) => {
                const old = previous.find((p) => p.name === exp.name);
                return {
                    name: exp.name,
                    amount: old ? old.amount : parseFloat(exp.amount) || '',
                };
            });

        // Prompt for missing amounts only for new selections
        for (let e of selected.filter((x) => !x.amount)) {
            const { value, isConfirmed } = await Swal.fire({
                title: `Enter amount for ${e.name}`,
                input: 'number',
                inputPlaceholder: 'Enter custom amount (AED)',
                showCancelButton: true,
                confirmButtonText: 'Save',
            });

            if (isConfirmed && value && !isNaN(value)) {
                e.amount = parseFloat(value);
            } else if (!isConfirmed) {
                selected = selected.filter((x) => x.name !== e.name);
            } else {
                e.amount = 0;
            }
        }

        // ✅ Update both local and container states
        setSelectedBlExpenses(selected);

        const updated = { ...containerExpenses, bl_expenses: selected };
        const { grandTotal, mofaAmount, vatAmount } = recalculateTotal(
            updated,
            selected,
            containerExpenses.ton_expenses || [],
        );

        setContainerExpenses({
            ...updated,
            total_amount: grandTotal,
            applied_mofa: mofaAmount,
            applied_vat: vatAmount,
        });
        setTotalAmount(grandTotal);
    };

    const handleTonExpenseSelect = async (selectedNames) => {
        const previous = containerExpenses.ton_expenses || [];

        let selected = tonExpenses
            .filter((exp) => selectedNames.includes(exp.name))
            .map((exp) => {
                const old = previous.find((p) => p.name === exp.name);
                return {
                    name: exp.name,
                    amount: old ? old.amount : parseFloat(exp.amount) || '',
                };
            });

        for (let e of selected.filter((x) => !x.amount)) {
            const { value, isConfirmed } = await Swal.fire({
                title: `Enter amount per ton for ${e.name}`,
                input: 'number',
                inputPlaceholder: 'Enter custom amount (AED)',
                showCancelButton: true,
                confirmButtonText: 'Save',
            });

            if (isConfirmed && value && !isNaN(value)) {
                e.amount = parseFloat(value);
            } else if (!isConfirmed) {
                selected = selected.filter((x) => x.name !== e.name);
            } else {
                e.amount = 0;
            }
        }

        // ✅ Update both local and container states
        setSelectedTonExpenses(selected);

        const updated = { ...containerExpenses, ton_expenses: selected };
        const { grandTotal, mofaAmount, vatAmount } = recalculateTotal(
            updated,
            containerExpenses.bl_expenses || [],
            selected,
        );

        setContainerExpenses({
            ...updated,
            total_amount: grandTotal,
            applied_mofa: mofaAmount,
            applied_vat: vatAmount,
        });
        setTotalAmount(grandTotal);
    };

    const recalculateTotal = (containerData, blExp = [], tonExp = []) => {
        const containerTotal = containerData.containers.reduce(
            (sum, c) => sum + parseFloat(c.total_amount || 0),
            0,
        );

        const blTotal = blExp.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

        const totalTonnage = parseFloat(containerData.weight_in_tons || 0);

        const tonTotal = tonExp.reduce(
            (sum, e) => sum + totalTonnage * (parseFloat(e.amount) || 0),
            0,
        );

        const usdRate = 3.6795;
        const usdPerTon = parseFloat(containerData.mofa_amount || 0);
        const mofaPrice = totalTonnage * usdPerTon * usdRate;
        const mofaAmount = mofaPrice > 10000 ? mofaPrice : 0;

        const vatAmount = totalTonnage * usdPerTon * usdRate * 0.05;

        const grandTotal = parseFloat(
            (containerTotal + blTotal + tonTotal + mofaAmount + vatAmount).toFixed(2),
        );

        return { grandTotal, mofaAmount, vatAmount };
    };

    useEffect(() => {
        if (!containerExpenses?.containers?.length) return;

        const { grandTotal, mofaAmount, vatAmount } = recalculateTotal(
            containerExpenses,
            containerExpenses.bl_expenses || [],
            containerExpenses.ton_expenses || [],
        );

        if (
            grandTotal !== containerExpenses.total_amount ||
            mofaAmount !== containerExpenses.applied_mofa ||
            vatAmount !== containerExpenses.applied_vat
        ) {
            setContainerExpenses((prev) => ({
                ...prev,
                total_amount: grandTotal,
                applied_mofa: mofaAmount,
                applied_vat: vatAmount,
            }));

            setTotalAmount(grandTotal);
        }
    }, [
        containerExpenses.containers,
        containerExpenses.bl_expenses,
        containerExpenses.ton_expenses,
    ]);

    const [submitProcessing, setSubmitProcessing] = useState(false);
    const submit = () => {
        setSubmitProcessing(true);

        router.post(
            route('transactions.dubai-expense-transactions.store'),
            {
                data: containerExpenses,
            },
            {
                onFinish: () => setSubmitProcessing(false),
            },
        );
    };

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Setups - Dubai Expense" />

                <BreadCrumb
                    header={'Setups - Dubai Expense'}
                    parent={'Dashboard'}
                    parent_link={route('dashboard')}
                    child={'Setups - Dubai Expense'}
                />

                <Card
                    Content={
                        <>
                            <form onSubmit={findContainers}>
                                <div className="mx-auto mt-4 flex items-center gap-2 px-10">
                                    <Input
                                        InputName={'B/L No'}
                                        Id={'bl_no'}
                                        Name={'bl_no'}
                                        Type={'text'}
                                        Placeholder={'Enter B/L No'}
                                        Required={true}
                                        Value={blNo}
                                        Action={(e) => setBlNo(e.target.value)}
                                    />
                                </div>
                                <PrimaryButton
                                    Disabled={processing || blNo === ''}
                                    Spinner={processing}
                                    CustomClass={'mx-auto mt-0 flex items-center gap-2'}
                                    Text={'Find Containers'}
                                    Type={'submit'}
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
                                                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                                            />
                                        </svg>
                                    }
                                />
                            </form>
                        </>
                    }
                />

                {viewModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 backdrop-blur-[32px]"
                            onClick={() => {
                                setBlResults({});
                            }}
                        ></div>

                        {/* Modal Box */}
                        <div className="relative z-10 max-h-screen w-full max-w-screen-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 sm:p-8">
                            <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                                Dubai Expense
                            </h3>

                            {/* Divider */}
                            <div className="mb-6 border-b border-gray-200 dark:border-gray-700"></div>

                            {/* Main Content */}
                            <div className="space-y-8">
                                {/* Header Info Section */}
                                <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30 sm:grid-cols-2 lg:grid-cols-4">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                            B/L No
                                        </p>
                                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                                            {containerExpenses.bl_no || '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                            B/L Date
                                        </p>
                                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                                            {containerExpenses.bl_date || '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                            Containers in B/L
                                        </p>
                                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                                            {containerExpenses.containers_count || 0}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                            Total Tonnage
                                        </p>
                                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                                            {containerExpenses.weight_in_tons || 0}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <SelectInput
                                        InputName="B/L Level Expenses"
                                        Id="bl_expenses"
                                        Multiple={false}
                                        items={blExpenses}
                                        itemKey="name"
                                        valueKey="name"
                                        Placeholder="Select BL Expenses"
                                        Value={selectedBlExpenses?.[0]?.name}
                                        Action={(value) => handleBLExpenseSelect(value)}
                                    />
                                    <SelectInput
                                        InputName="Ton-Based Expenses"
                                        Id="ton_expenses"
                                        Multiple={false}
                                        items={tonExpenses}
                                        itemKey="name"
                                        valueKey="name"
                                        Placeholder="Select Ton Expenses"
                                        Value={selectedTonExpenses?.[0]?.name}
                                        Action={(value) => handleTonExpenseSelect(value)}
                                    />
                                </div>

                                {/* Divider */}
                                <div className="border-b border-gray-200 dark:border-gray-700"></div>

                                {/* Table Section */}
                                {containerExpenses?.containers &&
                                containerExpenses.containers.length > 0 ? (
                                    <div className="relative overflow-visible rounded-lg border border-gray-200 dark:border-gray-700">
                                        <table className="min-w-full text-left text-sm text-gray-700 dark:text-gray-300">
                                            <thead className="bg-gray-100 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
                                                        #
                                                    </th>
                                                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
                                                        Container No
                                                    </th>
                                                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
                                                        Expense Type
                                                    </th>
                                                    <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">
                                                        Total Amount
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {containerExpenses.containers.map((item, index) => {
                                                    return (
                                                        <tr
                                                            key={item.container_id}
                                                            className="transition hover:bg-gray-50 dark:hover:bg-gray-800"
                                                        >
                                                            <td className="px-4 py-4 text-left text-sm text-gray-900 dark:text-gray-100">
                                                                {index + 1}
                                                            </td>

                                                            <td className="px-4 py-4 text-left font-medium text-gray-900 dark:text-gray-100">
                                                                {item.container_no}
                                                            </td>

                                                            <td className="w-[250px] px-4 py-3">
                                                                <div className="flex items-center justify-center">
                                                                    <SelectInput
                                                                        InputName="Container Expenses"
                                                                        Id={`expenses-${item.container_id}`}
                                                                        Multiple={true}
                                                                        items={
                                                                            containerExpensesList
                                                                        }
                                                                        itemKey="name"
                                                                        valueKey="name"
                                                                        Placeholder="Select Container Expense"
                                                                        Clearable={true}
                                                                        className="w-full"
                                                                        Value={
                                                                            item?.container_expenses?.map(
                                                                                (exp) => exp.name,
                                                                            ) || []
                                                                        }
                                                                        Action={(value) =>
                                                                            handleExpenseSelect(
                                                                                item.container_id,
                                                                                value,
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </td>

                                                            <td className="px-4 py-4 text-right font-semibold text-green-500 dark:text-green-400">
                                                                {parseFloat(item.total_amount || 0)}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>

                                            <tfoot className="bg-gray-50 dark:bg-gray-800">
                                                {/* MOFA Row */}
                                                <tr className="border-t border-gray-200 dark:border-gray-700">
                                                    <td
                                                        colSpan="3"
                                                        className="px-6 py-3 text-right text-sm font-semibold text-gray-800 dark:text-gray-200"
                                                    >
                                                        MOFA:
                                                    </td>
                                                    <td
                                                        className={`px-6 py-3 text-right text-sm font-bold ${
                                                            containerExpenses.applied_mofa > 0
                                                                ? 'text-blue-600 dark:text-blue-400'
                                                                : 'text-gray-500 dark:text-gray-400'
                                                        }`}
                                                    >
                                                        {containerExpenses.applied_mofa > 0
                                                            ? `${parseFloat(
                                                                  containerExpenses.applied_mofa,
                                                              )} AED`
                                                            : 'Not Applicable'}
                                                    </td>
                                                </tr>

                                                <tr className="border-t border-gray-200 dark:border-gray-700">
                                                    <td
                                                        colSpan="3"
                                                        className="px-6 py-3 text-right text-sm font-semibold text-gray-800 dark:text-gray-200"
                                                    >
                                                        VAT (5%):
                                                    </td>
                                                    <td className="px-6 py-3 text-right text-sm font-bold text-yellow-600 dark:text-yellow-400">
                                                        {parseFloat(
                                                            containerExpenses.applied_vat || 0,
                                                        ).toLocaleString('en-US', {
                                                            minimumFractionDigits: 2,
                                                        })}{' '}
                                                        AED
                                                    </td>
                                                </tr>

                                                {/* Total Row */}
                                                <tr className="border-t border-gray-200 dark:border-gray-700">
                                                    <td
                                                        colSpan="3"
                                                        className="px-6 py-3 text-right text-sm font-semibold text-gray-800 dark:text-gray-200"
                                                    >
                                                        Grand Total:
                                                    </td>
                                                    <td className="px-6 py-3 text-right text-sm font-bold text-green-600 dark:text-green-400">
                                                        {parseFloat(totalAmount || 0)} AED
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                        No containers found.
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="mt-8 flex flex-col-reverse items-center justify-end gap-4 sm:flex-row">
                                <PrimaryButton
                                    Action={() => setBlResults({})}
                                    Text="Close"
                                    Type="button"
                                    CustomClass="bg-red-500 hover:bg-red-600 w-full"
                                />

                                <PrimaryButton
                                    Action={() => submit()}
                                    Text="Save"
                                    Disabled={submitProcessing}
                                    Spinner={submitProcessing}
                                    Type="button"
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
                                                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                                            />
                                        </svg>
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}
            </AuthenticatedLayout>
        </>
    );
}
