import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BreadCrumb from '@/Components/BreadCrumb';
import { Head, router, usePage } from '@inertiajs/react';
import Input from '@/Components/Input';
import PrimaryButton from '@/Components/PrimaryButton';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import SelectInput from '@/Components/SelectInput';

export default function index({ expenses = [] }) {
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [blNo, setBlNo] = useState('');
    const [processing, setProcessing] = useState(false);
    const [bl_results, setBlResults] = useState({});

    const [totalAmount, setTotalAmount] = useState(0);
    const [totalAmountAfterExtraCharges, setTotalAmountAfterExtraCharges] = useState(0);

    const [weigthInTon, setWeigthInTon] = useState(0);
    const [blExpenses, setBlExpenses] = useState([]);
    const [tonExpenses, setTonExpenses] = useState([]);

    const [containerExpenses, setContainerExpenses] = useState({
        containers: [],
        total_amount: 0,
        total_amount_after_extra_charges: 0,
    });

    const findContainers = (e) => {
        e.preventDefault();
        setTotalAmountAfterExtraCharges(0);
        setProcessing(true);
        axios
            .post(route('transactions.extra-charges-expense-transactions.find-containers'), {
                bl_no: blNo,
            })
            .then((response) => {
                if (response.data.status) {
                    const dubai_expense_transactions_total_amount =
                        response?.data?.total_amount ?? 0;

                    const bl_expenses = response?.data?.bl_expenses ?? [];
                    const ton_expenses = response?.data?.ton_expenses ?? [];
                    const weight_in_tons = response?.data?.weight_in_tons ?? 0;

                    setBlExpenses(bl_expenses);
                    setTonExpenses(ton_expenses);
                    setWeigthInTon(weight_in_tons);

                    setContainerExpenses((prevContainerExpenses) => ({
                        ...prevContainerExpenses,
                        total_amount: parseFloat(dubai_expense_transactions_total_amount) || 0,
                    }));
                    setBlResults(response.data.data);

                    setTotalAmount(parseFloat(dubai_expense_transactions_total_amount) || 0);
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
            setContainerExpenses((prev) => ({
                ...prev,
                containers: containersWithBase,
            }));

            setViewModalOpen(true);
        } else {
            setContainerExpenses({
                containers: [],
                total_amount: 0,
                total_amount_after_extra_charges: 0,
            });
            setViewModalOpen(false);
        }
    }, [bl_results]);

    const handleExpenseSelect = async (containerId, selectedExpenseNames) => {
        const current = structuredClone(containerExpenses);
        if (!current?.containers?.length) return;

        let totalExtraAdded = 0;

        const updatedContainers = await Promise.all(
            current.containers.map(async (container) => {
                if (container.container_id !== containerId) {
                    // Still include this container’s extras in total
                    const containerExtra = container.extra_charges_expenses || [];
                    const sum = containerExtra.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
                    totalExtraAdded += sum;
                    return container;
                }

                const previous = container.extra_charges_expenses || [];
                const baseTotal = parseFloat(container.base_amount || container.total_amount || 0);

                // 🧩 Build selected extras
                let selectedExpenseObjects = expenses
                    .filter((exp) => selectedExpenseNames.includes(exp.name))
                    .map((exp) => {
                        const old = previous.find((p) => p.name === exp.name);
                        return {
                            name: exp.name,
                            amount: old ? parseFloat(old.amount) : parseFloat(exp.amount) || '',
                        };
                    });

                // 🧾 Ask for missing values
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

                // 🧮 Merge with existing + remove deselected
                const mergedExpenses = previous
                    .filter((exp) => selectedExpenseNames.includes(exp.name))
                    .concat(
                        selectedExpenseObjects.filter(
                            (exp) => !previous.some((p) => p.name === exp.name),
                        ),
                    );

                if (mergedExpenses.length === 0) {
                    // remove key if no expenses for this container
                    const { extra_charges_expenses, ...rest } = container;
                    return { ...rest, total_amount: baseTotal };
                }

                const extraChargesTotal = mergedExpenses.reduce(
                    (sum, exp) => sum + (parseFloat(exp.amount) || 0),
                    0,
                );
                totalExtraAdded += extraChargesTotal;

                return {
                    ...container,
                    extra_charges_expenses: mergedExpenses,
                    total_amount: baseTotal + extraChargesTotal,
                };
            }),
        );

        // 🧩 Check if *any* container still has extra charges
        const anyExtras = updatedContainers.some(
            (c) => c.extra_charges_expenses && c.extra_charges_expenses.length > 0,
        );

        // 🧾 Calculate total only if extras exist
        const newTotalAfterExtra = anyExtras
            ? parseFloat(totalAmount) + parseFloat(totalExtraAdded || 0)
            : 0;

        setContainerExpenses({
            ...current,
            containers: updatedContainers,
            total_amount_after_extra_charges: newTotalAfterExtra,
        });

        setTotalAmountAfterExtraCharges(newTotalAfterExtra);
    };

    const [submitProcessing, setSubmitProcessing] = useState(false);
    const submit = () => {
        setSubmitProcessing(true);

        router.post(
            route('transactions.extra-charges-expense-transactions.store'),
            {
                data: containerExpenses,
                bl_no: blNo,
            },
            {
                onFinish: () => setSubmitProcessing(false),
            },
        );
    };

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Transactions - Extra Charges Expense" />

                <BreadCrumb
                    header={'Transactions - Extra Charges Expense'}
                    parent={'Dashboard'}
                    parent_link={route('dashboard')}
                    child={'Transactions - Extra Charges Expense'}
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
                                Extra Charges Expense
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
                                            {bl_results?.bl_no || '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                            B/L Date
                                        </p>
                                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                                            {bl_results?.bl_date || '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                            Containers in B/L
                                        </p>
                                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                                            {bl_results?.containers_count || 0}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                            Total Tonnage
                                        </p>
                                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                                            {bl_results?.weight_in_tons || 0}
                                        </p>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-b border-gray-200 dark:border-gray-700"></div>

                                {/* Expenses Summary Alert */}
                                {(blExpenses.length > 0 || tonExpenses.length > 0) && (
                                    <div className="mb-6 space-y-3">
                                        {/* B/L Level Expenses */}
                                        {blExpenses.map((exp, index) => (
                                            <div
                                                key={`bl-${index}`}
                                                className="flex flex-col rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm shadow-sm dark:border-blue-800 dark:bg-blue-900/30 sm:flex-row sm:items-center sm:justify-between"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-blue-800 dark:text-blue-400">
                                                        {exp.name}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        Type: Per B/L
                                                    </span>
                                                </div>

                                                <div className="mt-1 text-right sm:mt-0">
                                                    <span className="font-semibold text-blue-700 dark:text-blue-300">
                                                        {parseFloat(exp.amount || 0).toLocaleString(
                                                            'en-US',
                                                            {
                                                                minimumFractionDigits: 2,
                                                            },
                                                        )}{' '}
                                                        AED
                                                    </span>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        (Applied as flat B/L charge)
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Ton-Based Expenses */}
                                        {tonExpenses.map((exp, index) => {
                                            return (
                                                <div
                                                    key={`ton-${index}`}
                                                    className="flex flex-col rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm shadow-sm dark:border-green-800 dark:bg-green-900/30 sm:flex-row sm:items-center sm:justify-between"
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-green-800 dark:text-green-400">
                                                            {exp.name}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            Type: Per Ton
                                                        </span>
                                                    </div>

                                                    <div className="mt-1 text-right sm:mt-0">
                                                        <span className="font-semibold text-green-700 dark:text-green-300">
                                                            {exp.amount} AED × {weigthInTon} tons ={' '}
                                                            {exp.amount * weigthInTon} AED
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

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
                                                                        items={expenses}
                                                                        itemKey="name"
                                                                        valueKey="name"
                                                                        Placeholder="Select Container Expense"
                                                                        Clearable={true}
                                                                        className="w-full"
                                                                        Value={
                                                                            item?.extra_charges_expenses?.map(
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
                                                <tr>
                                                    <td
                                                        colSpan="3"
                                                        className="px-6 py-3 text-right text-sm font-semibold text-gray-800 dark:text-gray-200"
                                                    >
                                                        Total (Dubai Expense):
                                                    </td>
                                                    <td className="px-6 py-3 text-right text-sm font-bold text-green-500 dark:text-green-400">
                                                        {parseFloat(totalAmount)} AED
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        colSpan="3"
                                                        className="px-6 py-3 text-right text-sm font-semibold text-gray-800 dark:text-gray-200"
                                                    >
                                                        Total (After Extra Charges):
                                                    </td>
                                                    <td className="px-6 py-3 text-right text-sm font-bold text-blue-500 dark:text-blue-400">
                                                        {parseFloat(totalAmountAfterExtraCharges)}{' '}
                                                        AED
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

// NEW VERSION JUST INCASE IF  CHANGE NEEDED

// import Card from '@/Components/Card';
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// import BreadCrumb from '@/Components/BreadCrumb';
// import { Head, router, usePage } from '@inertiajs/react';
// import Input from '@/Components/Input';
// import PrimaryButton from '@/Components/PrimaryButton';
// import axios from 'axios';
// import { useEffect, useRef, useState } from 'react';
// import Swal from 'sweetalert2';

// export default function index({ expenses = [] }) {
//     const [viewModalOpen, setViewModalOpen] = useState(false);
//     const [blNo, setBlNo] = useState('');
//     const [processing, setProcessing] = useState(false);
//     const [bl_results, setBlResults] = useState({});

//     const [totalAmount, setTotalAmount] = useState(0);
//     const [totalAmountAfterExtraCharges, setTotalAmountAfterExtraCharges] = useState(0);

//     const [containerExpenses, setContainerExpenses] = useState({
//         containers: [],
//         bl_no: '',
//         bl_date: '',
//         containers_count: 0,
//         weight_in_tons: 0,
//         total_amount: 0,
//         total_amount_after_extra_charges: 0,
//         all_expenses: [],
//     });

//     const findContainers = (e) => {
//         e.preventDefault();
//         setTotalAmountAfterExtraCharges(0);
//         setProcessing(true);
//         axios
//             .post(route('transactions.extra-charges-expense-transactions.find-containers'), {
//                 bl_no: blNo,
//             })
//             .then((response) => {
//                 if (response.data.status) {
//                     const dubai_expense_transactions_total_amount =
//                         response?.data?.total_amount ?? 0;

//                     setBlResults(response.data.data);
//                     setTotalAmount(parseFloat(dubai_expense_transactions_total_amount) || 0);
//                 } else {
//                     Swal.fire({
//                         icon: 'error',
//                         title: 'Error',
//                         text: 'No containers found for the provided B/L No.',
//                     });
//                 }
//             })
//             .catch((error) => {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Error',
//                     text: 'There was an error! ' + error.response.data.error,
//                 });
//             })
//             .finally(() => {
//                 setProcessing(false);
//             });
//     };

//     useEffect(() => {
//         if (Object.values(bl_results).length > 0 && Array.isArray(expenses)) {
//             const containersWithBase = bl_results.containers.map((c) => ({
//                 ...c,
//                 base_amount: parseFloat(c.total_amount || 0),
//             }));

//             // Initialize all expenses from expenses prop
//             const initialAllExpenses = expenses.map((exp) => ({
//                 id: exp.id,
//                 name: exp.name,
//                 type: exp.type,
//                 amount: exp.amount ? parseFloat(exp.amount) : null,
//                 has_preset_amount: exp.amount !== null,
//             }));

//             const initialState = {
//                 bl_no: bl_results.bl_no,
//                 bl_date: bl_results.bl_date,
//                 containers_count: bl_results.containers_count,
//                 weight_in_tons: bl_results.weight_in_tons,
//                 containers: containersWithBase,
//                 total_amount: parseFloat(totalAmount),
//                 all_expenses: initialAllExpenses,
//             };

//             const { extraChargesTotal } = recalculateTotal(initialState);

//             // Initial total after extra charges = Dubai expense + extra charges
//             const initialTotalAfterExtra = parseFloat(totalAmount) + extraChargesTotal;

//             setContainerExpenses({
//                 ...initialState,
//                 total_amount_after_extra_charges: initialTotalAfterExtra,
//             });

//             setTotalAmountAfterExtraCharges(initialTotalAfterExtra);
//             setViewModalOpen(true);
//         } else {
//             setContainerExpenses({
//                 containers: [],
//                 bl_no: '',
//                 bl_date: '',
//                 containers_count: 0,
//                 weight_in_tons: 0,
//                 total_amount: 0,
//                 total_amount_after_extra_charges: 0,
//                 all_expenses: [],
//             });
//             setViewModalOpen(false);
//             setTotalAmountAfterExtraCharges(0);
//         }
//     }, [bl_results, expenses, totalAmount]);

//     // Handle expense amount change
//     const handleExpenseAmountChange = (expenseId, value) => {
//         setContainerExpenses((prevState) => {
//             const updated = { ...prevState };
//             const expenseIndex = updated.all_expenses.findIndex((e) => e.id === expenseId);
//             if (expenseIndex !== -1) {
//                 // Create a new array with the updated expense
//                 updated.all_expenses = [...updated.all_expenses];
//                 updated.all_expenses[expenseIndex] = {
//                     ...updated.all_expenses[expenseIndex],
//                     amount: value ? parseFloat(value) : null,
//                 };

//                 const { extraChargesTotal } = recalculateTotal(updated);

//                 // Always add to the base total amount (Dubai expense)
//                 const newTotalAfterExtraCharges = parseFloat(totalAmount) + extraChargesTotal;

//                 updated.total_amount_after_extra_charges = newTotalAfterExtraCharges;
//                 setTotalAmountAfterExtraCharges(newTotalAfterExtraCharges);

//                 return updated;
//             }

//             return prevState;
//         });
//     };

//     const recalculateTotal = (containerData) => {
//         // Simply sum all expense amounts (no type-based logic for extra charges)
//         const extraChargesTotal =
//             containerData.all_expenses?.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0) ||
//             0;

//         return { extraChargesTotal: parseFloat(extraChargesTotal.toFixed(2)) };
//     };

//     const [submitProcessing, setSubmitProcessing] = useState(false);
//     const submit = () => {
//         setSubmitProcessing(true);

//         router.post(
//             route('transactions.extra-charges-expense-transactions.store'),
//             {
//                 data: containerExpenses,
//                 bl_no: blNo,
//             },
//             {
//                 onFinish: () => setSubmitProcessing(false),
//             },
//         );
//     };

//     return (
//         <>
//             <AuthenticatedLayout>
//                 <Head title="Transactions - Extra Charges Expense" />

//                 <BreadCrumb
//                     header={'Transactions - Extra Charges Expense'}
//                     parent={'Dashboard'}
//                     parent_link={route('dashboard')}
//                     child={'Transactions - Extra Charges Expense'}
//                 />

//                 <Card
//                     Content={
//                         <>
//                             <form onSubmit={findContainers}>
//                                 <div className="flex items-center gap-2 px-10 mx-auto mt-4">
//                                     <Input
//                                         InputName={'B/L No'}
//                                         Id={'bl_no'}
//                                         Name={'bl_no'}
//                                         Type={'text'}
//                                         Placeholder={'Enter B/L No'}
//                                         Required={true}
//                                         Value={blNo}
//                                         Action={(e) => setBlNo(e.target.value)}
//                                     />
//                                 </div>
//                                 <PrimaryButton
//                                     Disabled={processing || blNo === ''}
//                                     Spinner={processing}
//                                     CustomClass={'mx-auto mt-0 flex items-center gap-2'}
//                                     Text={'Find Containers'}
//                                     Type={'submit'}
//                                     Icon={
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                             strokeWidth={1.5}
//                                             stroke="currentColor"
//                                             className="size-6"
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
//                                             />
//                                         </svg>
//                                     }
//                                 />
//                             </form>
//                         </>
//                     }
//                 />

//                 {viewModalOpen && (
//                     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto sm:p-6">
//                         <div
//                             className="fixed inset-0 backdrop-blur-[32px]"
//                             onClick={() => {
//                                 setBlResults({});
//                             }}
//                         ></div>

//                         <div className="relative z-10 w-full max-h-screen p-6 overflow-y-auto bg-white shadow-xl max-w-screen-2xl rounded-2xl dark:bg-gray-800 sm:p-8">
//                             <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
//                                 Extra Charges Expense
//                             </h3>

//                             <div className="mb-6 border-b border-gray-200 dark:border-gray-700"></div>

//                             <div className="space-y-8">
//                                 {/* Header Info Section */}
//                                 <div className="grid grid-cols-1 gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50 dark:border-gray-700 dark:bg-gray-900/30 sm:grid-cols-2 lg:grid-cols-4">
//                                     <div>
//                                         <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
//                                             B/L No
//                                         </p>
//                                         <p className="text-base font-semibold text-gray-900 dark:text-white">
//                                             {containerExpenses.bl_no || '—'}
//                                         </p>
//                                     </div>
//                                     <div>
//                                         <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
//                                             B/L Date
//                                         </p>
//                                         <p className="text-base font-semibold text-gray-900 dark:text-white">
//                                             {containerExpenses.bl_date || '—'}
//                                         </p>
//                                     </div>
//                                     <div>
//                                         <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
//                                             Containers in B/L
//                                         </p>
//                                         <p className="text-base font-semibold text-gray-900 dark:text-white">
//                                             {containerExpenses.containers_count || 0}
//                                         </p>
//                                     </div>
//                                     <div>
//                                         <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
//                                             Total Tonnage
//                                         </p>
//                                         <p className="text-base font-semibold text-gray-900 dark:text-white">
//                                             {containerExpenses.weight_in_tons || 0}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 {/* All Extra Charges Expenses Table */}
//                                 <div>
//                                     <h4 className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
//                                         All Extra Charges
//                                     </h4>
//                                     <div className="overflow-hidden border border-gray-200 rounded-lg dark:border-gray-700">
//                                         <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
//                                             <thead className="bg-gray-100 dark:bg-gray-700">
//                                                 <tr>
//                                                     <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
//                                                         #
//                                                     </th>
//                                                     <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
//                                                         Expense Name
//                                                     </th>
//                                                     <th className="px-4 py-3 font-semibold text-right text-gray-900 dark:text-gray-100">
//                                                         Amount (AED)
//                                                     </th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                                                 {containerExpenses.all_expenses?.map(
//                                                     (expense, index) => {
//                                                         const isDisabled =
//                                                             expense.has_preset_amount === true;
//                                                         return (
//                                                             <tr
//                                                                 key={expense.id}
//                                                                 className="transition hover:bg-gray-50 dark:hover:bg-gray-800"
//                                                             >
//                                                                 <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
//                                                                     {index + 1}
//                                                                 </td>
//                                                                 <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
//                                                                     {expense.name}
//                                                                 </td>
//                                                                 <td className="px-4 py-3 text-right">
//                                                                     <input
//                                                                         type="number"
//                                                                         step="0.01"
//                                                                         min="0"
//                                                                         onKeyDown={(e) => {
//                                                                             if (
//                                                                                 e.key === 'e' ||
//                                                                                 e.key === 'E' ||
//                                                                                 e.key === '+' ||
//                                                                                 e.key === '-'
//                                                                             ) {
//                                                                                 e.preventDefault();
//                                                                             }
//                                                                         }}
//                                                                         placeholder="Enter amount"
//                                                                         value={expense.amount || ''}
//                                                                         disabled={isDisabled}
//                                                                         onChange={(e) =>
//                                                                             handleExpenseAmountChange(
//                                                                                 expense.id,
//                                                                                 e.target.value,
//                                                                             )
//                                                                         }
//                                                                         className={`dark:bg-dark-900 shadow-theme-xs focus:ring-3 focus:outline-hidden mb-2 w-full max-w-[150px] rounded-lg border border-gray-300 bg-transparent px-3 py-2.5 text-right text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-300 focus:ring-1 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-800 ${
//                                                                             isDisabled
//                                                                                 ? 'cursor-not-allowed opacity-25 dark:opacity-40'
//                                                                                 : ''
//                                                                         }`}
//                                                                     />
//                                                                 </td>
//                                                             </tr>
//                                                         );
//                                                     },
//                                                 )}
//                                             </tbody>
//                                             <tfoot className="bg-gray-50 dark:bg-gray-800">
//                                                 {/* Dubai Expense Total Row */}
//                                                 <tr className="border-t border-gray-200 dark:border-gray-700">
//                                                     <td
//                                                         colSpan="2"
//                                                         className="px-4 py-3 text-sm font-semibold text-right text-gray-800 dark:text-gray-200"
//                                                     >
//                                                         Total (Dubai Expense):
//                                                     </td>
//                                                     <td className="px-4 py-3 text-sm font-bold text-right text-green-600 dark:text-green-400">
//                                                         {parseFloat(totalAmount || 0).toFixed(2)}{' '}
//                                                         AED
//                                                     </td>
//                                                 </tr>

//                                                 {/* Grand Total After Extra Charges Row */}
//                                                 <tr className="border-t-2 border-gray-300 dark:border-gray-600">
//                                                     <td
//                                                         colSpan="2"
//                                                         className="px-4 py-3 text-sm font-semibold text-right text-gray-800 dark:text-gray-200"
//                                                     >
//                                                         Total (After Extra Charges):
//                                                     </td>
//                                                     <td className="px-4 py-3 text-sm font-bold text-right text-blue-600 dark:text-blue-400">
//                                                         {parseFloat(
//                                                             totalAmountAfterExtraCharges || 0,
//                                                         ).toFixed(2)}{' '}
//                                                         AED
//                                                     </td>
//                                                 </tr>
//                                             </tfoot>
//                                         </table>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="flex flex-col-reverse items-center justify-end gap-4 mt-8 sm:flex-row">
//                                 <PrimaryButton
//                                     Action={() => setBlResults({})}
//                                     Text="Close"
//                                     Type="button"
//                                     CustomClass="bg-red-500 hover:bg-red-600 w-full "
//                                 />

//                                 <PrimaryButton
//                                     Action={() => submit()}
//                                     Text="Save"
//                                     Disabled={submitProcessing}
//                                     Spinner={submitProcessing}
//                                     Type="button"
//                                     CustomClass="w-full "
//                                     Icon={
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                             strokeWidth={1.5}
//                                             stroke="currentColor"
//                                             className="size-6"
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
//                                             />
//                                         </svg>
//                                     }
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </AuthenticatedLayout>
//         </>
//     );
// }
