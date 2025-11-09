import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BreadCrumb from '@/Components/BreadCrumb';
import { Head, router, usePage } from '@inertiajs/react';
import Input from '@/Components/Input';
import PrimaryButton from '@/Components/PrimaryButton';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function index({ expenses = {}, expense_setting }) {
    const { props } = usePage();

    const [allExpenses, setAllExpenses] = useState([]);

    useEffect(() => {
        if (Array.isArray(expenses) && expenses.length > 0) {
            setAllExpenses(expenses);
        } else {
            setAllExpenses([]);
        }
    }, [expenses]);

    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [blNo, setBlNo] = useState('');
    const [processing, setProcessing] = useState(false);
    const [bl_results, setBlResults] = useState({});

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
        all_expenses: [],
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

            const initialAllExpenses = allExpenses.map((exp) => ({
                id: exp.id,
                name: exp.name,
                type: exp.type,
                amount: exp.amount ? parseFloat(exp.amount) : null,
                has_preset_amount: exp.amount !== null,
            }));

            const initialState = {
                bl_no: bl_results.bl_no,
                bl_date: bl_results.bl_date,
                containers_count: bl_results.containers_count,
                weight_in_tons: bl_results.weight_in_tons,
                containers: containersWithBase,
                mofa_amount: expense_setting?.amount || 0,
                all_expenses: initialAllExpenses,
            };

            const { grandTotal, mofaAmount, vatAmount } = recalculateTotal(initialState);

            setContainerExpenses({
                ...initialState,
                total_amount: grandTotal,
                applied_mofa: mofaAmount,
                applied_vat: vatAmount,
            });

            setTotalAmount(grandTotal);
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
                all_expenses: [],
            });
            setViewModalOpen(false);
            setTotalAmount(0);
        }
    }, [bl_results, allExpenses, expense_setting]);

    const handleExpenseAmountChange = (expenseId, value) => {
        const updated = structuredClone(containerExpenses);
        const expenseIndex = updated.all_expenses.findIndex((e) => e.id === expenseId);

        if (expenseIndex !== -1) {
            updated.all_expenses[expenseIndex].amount = value ? parseFloat(value) : null;

            const { grandTotal, mofaAmount, vatAmount } = recalculateTotal(updated);

            setContainerExpenses({
                ...updated,
                total_amount: grandTotal,
                applied_mofa: mofaAmount,
                applied_vat: vatAmount,
            });
            setTotalAmount(grandTotal);
        }
    };

    const recalculateTotal = (containerData) => {
        // Container totals (base amounts only)
        const containerTotal = containerData.containers.reduce(
            (sum, c) => sum + parseFloat(c.base_amount || 0),
            0,
        );

        const totalTonnage = parseFloat(containerData.weight_in_tons || 0);
        const containerCount = parseInt(containerData.containers_count || 0);

        // Separate expenses by type
        const containerExpenses =
            containerData.all_expenses?.filter((e) => e.type === 'container') || [];
        const blExpenses = containerData.all_expenses?.filter((e) => e.type === 'bl') || [];
        const tonExpenses = containerData.all_expenses?.filter((e) => e.type === 'ton') || [];
        const nullExpenses = containerData.all_expenses?.filter((e) => e.type === null) || [];

        // ✅ Container expenses: multiply amount by number of containers
        // Example: If DP WORLD = 1414 AED and there are 2 containers → 1414 × 2 = 2828 AED
        const containerExpenseTotal = containerExpenses.reduce(
            (sum, e) => sum + (parseFloat(e.amount) || 0) * containerCount,
            0,
        );

        // ✅ BL expenses: flat amounts (applied once per BL)
        // Example: BP WORLD = 55 AED → just add 55 AED
        const blTotal = blExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

        // ✅ Ton expenses: amount per ton × total tonnage
        // Example: CUSTOM DUTY = 100 AED per ton, tonnage = 25 → 100 × 25 = 2500 AED
        const tonTotal = tonExpenses.reduce(
            (sum, e) => sum + totalTonnage * (parseFloat(e.amount) || 0),
            0,
        );

        // ✅ Null type expenses: flat amounts
        const nullTotal = nullExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

        // MOFA calculation
        const usdRate = 3.6795;
        const usdPerTon = parseFloat(containerData.mofa_amount || 0);
        const mofaPrice = totalTonnage * usdPerTon * usdRate;
        const mofaAmount = mofaPrice > 10000 ? mofaPrice : 0;

        // VAT calculation
        const vatAmount = totalTonnage * usdPerTon * usdRate * 0.05;

        // Grand total
        const grandTotal = parseFloat(
            (
                containerTotal +
                containerExpenseTotal +
                blTotal +
                tonTotal +
                nullTotal +
                mofaAmount +
                vatAmount
            ).toFixed(2),
        );

        return { grandTotal, mofaAmount, vatAmount };
    };

    useEffect(() => {
        if (!containerExpenses?.containers?.length) return;

        const { grandTotal, mofaAmount, vatAmount } = recalculateTotal(containerExpenses);

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
    }, [containerExpenses.all_expenses]);

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
                <Head title="Transactions - Dubai Expense" />

                <BreadCrumb
                    header={'Transactions - Dubai Expense'}
                    parent={'Dashboard'}
                    parent_link={route('dashboard')}
                    child={'Transactions - Dubai Expense'}
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
                        <div
                            className="fixed inset-0 backdrop-blur-[32px]"
                            onClick={() => {
                                setBlResults({});
                            }}
                        ></div>

                        <div className="relative z-10 max-h-screen w-full max-w-screen-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 sm:p-8">
                            <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                                Dubai Expense
                            </h3>

                            <div className="mb-6 border-b border-gray-200 dark:border-gray-700"></div>

                            <div className="space-y-8">
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

                                <div>
                                    <h4 className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        All Expenses
                                    </h4>
                                    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                                        <table className="min-w-full text-left text-sm text-gray-700 dark:text-gray-300">
                                            <thead className="bg-gray-100 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
                                                        #
                                                    </th>
                                                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
                                                        Expense Name
                                                    </th>
                                                    <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">
                                                        Amount (AED)
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {containerExpenses.all_expenses?.map(
                                                    (expense, index) => {
                                                        const isDisabled =
                                                            expense.has_preset_amount === true;
                                                        return (
                                                            <tr
                                                                key={expense.id}
                                                                className="transition hover:bg-gray-50 dark:hover:bg-gray-800"
                                                            >
                                                                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                                                    {index + 1}
                                                                </td>
                                                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                                                                    {expense.name}
                                                                </td>
                                                                <td className="px-4 py-3 text-right">
                                                                    <input
                                                                        type="number"
                                                                        step="0.01"
                                                                        min="0"
                                                                        onKeyDown={(e) => {
                                                                            if (
                                                                                e.key === 'e' ||
                                                                                e.key === 'E' ||
                                                                                e.key === '+' ||
                                                                                e.key === '-'
                                                                            ) {
                                                                                e.preventDefault();
                                                                            }
                                                                        }}
                                                                        placeholder="Enter amount"
                                                                        value={expense.amount || ''}
                                                                        disabled={isDisabled}
                                                                        onChange={(e) =>
                                                                            handleExpenseAmountChange(
                                                                                expense.id,
                                                                                e.target.value,
                                                                            )
                                                                        }
                                                                        className={`dark:bg-dark-900 shadow-theme-xs focus:ring-3 focus:outline-hidden mb-2 w-full max-w-[150px] rounded-lg border border-gray-300 bg-transparent px-3 py-2.5 text-right text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-300 focus:ring-1 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-800 ${
                                                                            isDisabled
                                                                                ? 'cursor-not-allowed opacity-25 dark:opacity-40'
                                                                                : ''
                                                                        }`}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                    },
                                                )}
                                            </tbody>
                                            <tfoot className="bg-gray-50 dark:bg-gray-800">
                                                <tr className="border-t border-gray-200 dark:border-gray-700">
                                                    <td
                                                        colSpan="2"
                                                        className="px-4 py-3 text-right text-sm font-semibold text-gray-800 dark:text-gray-200"
                                                    >
                                                        MOFA:
                                                    </td>
                                                    <td
                                                        className={`px-4 py-3 text-right text-sm font-bold ${
                                                            containerExpenses.applied_mofa > 0
                                                                ? 'text-blue-600 dark:text-blue-400'
                                                                : 'text-gray-500 dark:text-gray-400'
                                                        }`}
                                                    >
                                                        {containerExpenses.applied_mofa > 0
                                                            ? `${parseFloat(
                                                                  containerExpenses.applied_mofa,
                                                              ).toFixed(2)} AED`
                                                            : 'Not Applicable'}
                                                    </td>
                                                </tr>

                                                <tr className="border-t border-gray-200 dark:border-gray-700">
                                                    <td
                                                        colSpan="2"
                                                        className="px-4 py-3 text-right text-sm font-semibold text-gray-800 dark:text-gray-200"
                                                    >
                                                        VAT (5%):
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm font-bold text-yellow-600 dark:text-yellow-400">
                                                        {parseFloat(
                                                            containerExpenses.applied_vat || 0,
                                                        ).toFixed(2)}{' '}
                                                        AED
                                                    </td>
                                                </tr>

                                                <tr className="border-t-2 border-gray-300 dark:border-gray-600">
                                                    <td
                                                        colSpan="2"
                                                        className="px-4 py-3 text-right text-sm font-semibold text-gray-800 dark:text-gray-200"
                                                    >
                                                        Grand Total:
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm font-bold text-green-600 dark:text-green-400">
                                                        {parseFloat(totalAmount || 0).toFixed(2)}{' '}
                                                        AED
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col-reverse items-center justify-end gap-4 sm:flex-row">
                                <PrimaryButton
                                    Action={() => setBlResults({})}
                                    Text="Close"
                                    Type="button"
                                    CustomClass="bg-red-500 hover:bg-red-600 w-full "
                                />

                                <PrimaryButton
                                    Action={() => submit()}
                                    Text="Save"
                                    Disabled={submitProcessing}
                                    Spinner={submitProcessing}
                                    Type="button"
                                    CustomClass="w-full"
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
