import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BreadCrumb from '@/Components/BreadCrumb';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import Table from '@/Components/Table';
import { useEffect, useRef, useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import Input from '@/Components/Input';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import SelectInput from '@/Components/SelectInput';
import Toast from '@/Components/Toast';

export default function index({ stock_ins, stock_outs, currencies, container_collection }) {
    const { props } = usePage();

    const [searchErrors, setSearchErrors] = useState({});

    useEffect(() => {
        const errors = props.errors;

        if (errors.bl_no || errors.bl_date) {
            setSearchErrors({
                bl_no: errors?.bl_no ?? '',
                bl_date: errors?.bl_date ?? '',
            });
        }

        const timeout = setTimeout(() => {
            setSearchErrors({});
        }, 3000);

        return () => clearTimeout(timeout);
    }, [props.errors.bl_no, props.errors.bl_date]);

    const {
        data: BulkselectedIds,
        setData: setBulkSelectedIds,
        delete: BulkDelete,
        reset: resetBulkSelectedIds,
    } = useForm({
        ids: [],
    });

    const {
        data: SingleSelectedId,
        setData: setSingleSelectedId,
        delete: SingleDelete,
        reset: resetSingleSelectedId,
    } = useForm({
        id: null,
    });

    // Create Request
    const {
        data: createData,
        setData: setCreateData,
        post: createPost,
        processing: createProcessing,
        errors: createErrors,
    } = useForm({
        bl_date: '',
        bl_no: '',
        exchange_rate: 0,
        currency_id: '',
        containers: [],
    });

    // Edit Form Data
    const {
        data: editData,
        setData: setEditData,
        put: editPut,
        processing: editProcessing,
        errors: editErrors,
    } = useForm({
        bl_date: '',
        bl_no: '',
        exchange_rate: 0,
        currency_id: '',
        containers: [],
    });

    const [columns, setColumns] = useState([]);
    const [customActions, setCustomActions] = useState([]);

    //  Create Modal  State
    const [CreateModalOpen, setCreateModalOpen] = useState(false);

    //  Edit Modal State
    const [EditModalOpen, setEditModalOpen] = useState(false);

    // View Modal State
    const [viewModalOpen, setViewModalOpen] = useState(false);

    // View Modal Data
    const [viewData, setViewData] = useState({
        bl_date: '',
        bl_no: '',
        exchange_rate: 0,
        currency_id: '',
        currency: '',
        containers: [],
    });

    const [bl_no, setBlNo] = useState(props.bl_no ?? '');
    const [bl_date, setBlDate] = useState(props.bl_date ?? '');
    const [parent_searched, setParentSearched] = useState(false);

    const [ActualData, setActualData] = useState(null);

    // Flatpicker Ref
    const flatpickerForCreateForm = useRef(null);
    const flatpickerForEditForm = useRef(null);
    const flatpickerForEntryDateSearch = useRef(null);

    // flatpicker init useEffect
    useEffect(() => {
        setTimeout(() => {
            if (flatpickerForCreateForm.current) {
                flatpickr(flatpickerForCreateForm.current, {
                    dateFormat: 'Y-m-d',
                    disableMobile: true,
                    onChange: function (selectedDates, dateStr) {
                        if (selectedDates[0]) {
                            setCreateData('bl_date', dateStr);
                        }
                    },
                });
            }

            if (flatpickerForEditForm.current) {
                flatpickr(flatpickerForEditForm.current, {
                    dateFormat: 'Y-m-d',
                    disableMobile: true,
                    onChange: function (selectedDates, dateStr) {
                        if (selectedDates[0]) {
                            setEditData('bl_date', dateStr);
                        }
                    },
                });
            }
        }, 500);
    }, [CreateModalOpen, EditModalOpen]);

    // Init Flatpicker For Entry Date Search Input
    useEffect(() => {
        setTimeout(() => {
            if (flatpickerForEntryDateSearch.current) {
                flatpickr(flatpickerForEntryDateSearch.current, {
                    dateFormat: 'Y-m-d',
                    disableMobile: true,
                    onChange: function (selectedDates, dateStr) {
                        if (selectedDates.length > 0) {
                            setBlDate(dateStr);
                        } else {
                            setBlDate('');
                        }
                    },
                });
            }
        }, 500);
    }, []);

    // Columns
    useEffect(() => {
        const columns = [
            {
                label: "Container No's",
                render: (item) => {
                    return (
                        <div
                            className="cursor-pointer"
                            onClick={() => {
                                setViewModalOpen(true);
                                setViewData(item);
                            }}
                        >
                            {item.containers.map((item, index) => {
                                return (
                                    <p
                                        key={index}
                                        className="text-sm font-semibold text-blue-500 underline"
                                    >
                                        {item.container_no}
                                    </p>
                                );
                            })}
                        </div>
                    );
                },
            },

            { key: 'bl_date', label: 'B/L Date' },
            { key: 'bl_no', label: 'B/L No' },
            {
                key: 'currency.name',
                label: 'Currency',
                badge: (value) => 'bg-blue-500 text-white p-3',
            },
            { key: 'exchange_rate', label: 'Exchange Rate' },
            {
                label: 'Amount In FC',
                render: (item) => {
                    return (
                        <div>
                            {item.containers.map((item, index) => {
                                return (
                                    <p key={index} className="text-sm font-semibold">
                                        {item.total_amount}
                                    </p>
                                );
                            })}
                        </div>
                    );
                },
            },
        ];

        const actions = [
            {
                label: 'View',
                type: 'button',
                onClick: (item) => {
                    router.reload('stock_ins');
                    setViewModalOpen(true);
                    setActualData(item);
                    setViewData((prev) => ({
                        ...prev,
                        id: item.id,
                        bl_date: item.bl_date,
                        bl_no: item.bl_no,
                        currency_id: item.currency_id,
                        currency: item.currency,
                        exchange_rate: item.exchange_rate,
                        containers: item.containers.map((c) => ({
                            container_id: c.container_id,
                            total_amount: c.total_amount,
                            container_no: c.container_no,
                        })),
                    }));
                },
            },

            {
                label: 'Edit',
                type: 'button',
                onClick: (item) => {
                    router.reload('stock_ins');
                    setEditModalOpen(true);
                    setActualData(item);
                    setEditData('id', item.id);
                    setEditData('bl_date', item.bl_date);
                    setEditData('bl_no', item.bl_no);
                    setEditData('currency_id', item.currency_id);
                    setEditData('exchange_rate', item.exchange_rate);
                    setEditData(
                        'containers',
                        item.containers.map((item) => {
                            return {
                                container_id: item.container_id,
                                total_amount: item.total_amount,
                                container_no: item.container_no,
                            };
                        }),
                    );
                },
            },
        ];

        setCustomActions(actions);
        setColumns(columns);
    }, []);

    // For Create
    useEffect(() => {
        if (createData.exchange_rate != 0 && createData.currency_id != '') {
            setCreateData('containers', []);
        }
    }, [createData.exchange_rate, createData.currency_id]);

    const handleContainerSelectCreate = (container) => {
        const selectedContainers = createData.containers;
        const isSelected = selectedContainers.some((item) => item.container_id === container.id);

        if (isSelected) {
            const updated = selectedContainers.filter((item) => item.container_id !== container.id);
            setCreateData('containers', updated);
        } else {
            const totalAmount = Number(container?.total_amount ?? 0);
            const ExchangeRate = Number(createData.exchange_rate ?? 0);
            const fc_amount = (totalAmount / ExchangeRate).toFixed(2);

            setCreateData('containers', [
                ...selectedContainers,
                {
                    container_id: container.id,
                    total_amount: fc_amount ?? 0,
                    container_no: container.container_no,
                },
            ]);
        }
    };

    const handleContainerRemoveCreate = (container) => {
        const updated = createData.containers.filter(
            (item) => (item.container_id ?? item.id) !== container.container_id,
        );

        const fullContainer = container_collection.find((c) => c.id === container.container_id);

        if (fullContainer) {
            const alreadyExists = stock_ins.some((c) => c.id === fullContainer.id);
            if (!alreadyExists) {
                stock_ins.push(fullContainer);
            }
        }

        setCreateData('containers', updated);
    };

    // For Edit
    useEffect(() => {
        const hasExchangeRateChanged =
            editData.exchange_rate !== 0 && editData.exchange_rate !== ActualData?.exchange_rate;

        const hasCurrencyChanged =
            editData.currency_id !== '' && editData.currency_id !== ActualData?.currency_id;

        if ((hasExchangeRateChanged || hasCurrencyChanged) && EditModalOpen) {
            // Backup current containers before clearing
            if (editData.containers?.length) {
                editData.containers.forEach((containerRef) => {
                    const fullContainer = container_collection.find(
                        (c) => c.id === containerRef.container_id,
                    );
                    if (fullContainer && !stock_ins.some((c) => c.id === fullContainer.id)) {
                        stock_ins.push(fullContainer);
                    }
                });
            }

            setEditData('containers', []);
        }
    }, [editData.exchange_rate, editData.currency_id]);

    const handleContainerSelectEdit = (container) => {
        const selectedContainers = editData.containers;

        const isSelected = selectedContainers.some(
            (item) => (item.container_id ?? item.id) === container.id,
        );

        if (isSelected) {
            const updated = selectedContainers.filter(
                (item) => (item.container_id ?? item.id) !== container.id,
            );
            setEditData('containers', updated);
        } else {
            const totalAmount = Number(container?.total_amount ?? 0);
            const exchangeRate = Number(editData.exchange_rate ?? 0);
            const fc_amount = (totalAmount / exchangeRate).toFixed(2);

            setEditData('containers', [
                ...selectedContainers,
                {
                    container_id: container.id,
                    total_amount: fc_amount,
                    container_no: container.container_no,
                },
            ]);
        }
    };

    const handleContainerRemoveEdit = (container) => {
        const updated = editData.containers.filter(
            (item) => (item.container_id ?? item.id) !== container.container_id,
        );

        const fullContainer = container_collection.find((c) => c.id === container.container_id);

        if (fullContainer) {
            const alreadyExists = stock_ins.some((c) => c.id === fullContainer.id);
            if (!alreadyExists) {
                stock_ins.push(fullContainer);
            }
        }

        setEditData('containers', updated);
    };

    // CreateMethod
    const CreateMethod = (e) => {
        e.preventDefault();

        createPost(route('transactions.stock-out.store'), {
            onSuccess: () => {
                setCreateModalOpen(false);
                setCreateData('bl_date', '');
                setCreateData('bl_no', '');
                setCreateData('container_no', '');
                setCreateData('currency_id', '');
                setCreateData('exchange_rate', 0);
                setCreateData('containers', []);
            },
        });
    };

    // EditMethod
    const EditMethod = (e) => {
        e.preventDefault();
        editPut(route('transactions.stock-out.update', editData.id), {
            onSuccess: () => {
                setEditModalOpen(false);
                setEditData('id', '');
                setEditData('bl_date', '');
                setEditData('bl_no', '');
                setEditData('currency_id', '');
                setEditData('exchange_rate', 0);
                setEditData('containers', []);
            },
        });
    };

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Transactions - Stock Out" />

                <BreadCrumb
                    header={'Transactions - Stock Out'}
                    parent={'Dashboard'}
                    parent_link={route('dashboard')}
                    child={'Transactions - Stock Out'}
                />

                {searchErrors &&
                    typeof searchErrors === 'object' &&
                    Object.keys(searchErrors).length > 0 && (
                        <Toast
                            flash={{ error: Object.values(searchErrors).map((error) => error) }}
                        />
                    )}

                <Card
                    Content={
                        <>
                            <div className="my-3 flex flex-wrap justify-end">
                                <PrimaryButton
                                    CustomClass={'mix-w-[200px]'}
                                    Text={'Create Stock Out'}
                                    Action={() => setCreateModalOpen(true)}
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
                                                d="M12 4.5v15m7.5-7.5h-15"
                                            />
                                        </svg>
                                    }
                                />
                            </div>

                            <Table
                                setBulkSelectedIds={setBulkSelectedIds}
                                setSingleSelectedId={setSingleSelectedId}
                                SingleSelectedId={SingleSelectedId}
                                resetBulkSelectedIds={resetBulkSelectedIds}
                                resetSingleSelectedId={resetSingleSelectedId}
                                BulkDeleteMethod={BulkDelete}
                                SingleDeleteMethod={SingleDelete}
                                BulkDeleteRoute={'transactions.stock-out.destroybyselection'}
                                SingleDeleteRoute={'transactions.stock-out.destroy'}
                                items={stock_outs}
                                props={props}
                                columns={columns}
                                Search={true}
                                SearchRoute={'transactions.stock-out.index'}
                                customActions={customActions}
                                ParentSearched={parent_searched}
                                DefaultSearchInput={false}
                                searchProps={{ bl_date: bl_date, bl_no: bl_no }}
                                customSearch={
                                    <>
                                        <div className="relative">
                                            <Input
                                                InputName={'B/L Date'}
                                                InputRef={flatpickerForEntryDateSearch}
                                                Id={'bl_date'}
                                                Name={'bl_date'}
                                                Type={'text'}
                                                Value={bl_date}
                                                Placeholder={'Add B/L Date To Search'}
                                            />
                                        </div>

                                        <div className="relative">
                                            <Input
                                                InputName={'B/L No'}
                                                Id={'bl_no'}
                                                Name={'bl_no'}
                                                Type={'text'}
                                                Value={bl_no}
                                                Placeholder={'Add B/L No To Search'}
                                                Action={(e) => {
                                                    const value = e.target.value;
                                                    setBlNo(value);
                                                }}
                                            />
                                        </div>

                                        <div className="relative">
                                            <PrimaryButton
                                                Text={'Search'}
                                                Action={(e) => {
                                                    setParentSearched(true);
                                                }}
                                                Type={'button'}
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
                                                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                                        />
                                                    </svg>
                                                }
                                            />
                                        </div>
                                    </>
                                }
                            />

                            {/* { Modal} */}
                            <div className="border-t border-gray-100 p-6 dark:border-gray-800">
                                {CreateModalOpen && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 backdrop-blur-[32px]"
                                            onClick={() =>
                                                !createProcessing && setCreateModalOpen(false)
                                            }
                                        ></div>

                                        {/* Modal content */}
                                        <div className="relative z-10 max-h-screen w-full max-w-screen-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 sm:p-8">
                                            <form
                                                onSubmit={CreateMethod}
                                                className="grid grid-cols-1 items-start gap-6 md:grid-cols-2"
                                            >
                                                <div className="col-span-2">
                                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                        Create Stock Out
                                                    </h3>
                                                </div>

                                                {/* Divider */}
                                                <div className="col-span-2 mb-6 border-b border-gray-200 dark:border-gray-700"></div>

                                                {createErrors?.server && (
                                                    <div className="col-span-2 mb-2 w-full rounded-xl border border-red-300 bg-red-50 px-5 py-4 text-sm text-red-800 shadow-sm">
                                                        <div className="mb-1 text-base font-bold text-red-700">
                                                            ⚠️ Error
                                                        </div>
                                                        <p>{createErrors.server}</p>
                                                    </div>
                                                )}

                                                <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-3">
                                                    <Input
                                                        InputName={'Bl Date'}
                                                        InputRef={flatpickerForCreateForm}
                                                        Id={'bl_date'}
                                                        Name={'bl_date'}
                                                        Type={'text'}
                                                        Placeholder={'Enter B/L Date'}
                                                        Required={true}
                                                        Error={createErrors.bl_date}
                                                        Value={createData.bl_date}
                                                        Action={(e) =>
                                                            setCreateData('bl_date', e.target.value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Bl No'}
                                                        Id={'bl_no'}
                                                        Name={'bl_no'}
                                                        Type={'text'}
                                                        Placeholder={'Enter B/L No'}
                                                        Required={true}
                                                        Error={createErrors.bl_no}
                                                        Value={createData.bl_no}
                                                        Action={(e) =>
                                                            setCreateData('bl_no', e.target.value)
                                                        }
                                                    />

                                                    <SelectInput
                                                        InputName={'Currency'}
                                                        Id={'currency_id'}
                                                        Name={'currency_id'}
                                                        items={currencies}
                                                        itemKey={'name'}
                                                        Required={true}
                                                        Error={createErrors.currency_id}
                                                        Value={createData.currency_id}
                                                        Placeholder={false}
                                                        Action={(value) =>
                                                            setCreateData('currency_id', value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Exchange Rate'}
                                                        Id={'exchange_rate'}
                                                        Name={'exchange_rate'}
                                                        Type={'number'}
                                                        Placeholder={'Enter Exchange Rate'}
                                                        Required={true}
                                                        Error={createErrors.exchange_rate}
                                                        Value={createData.exchange_rate}
                                                        Action={(e) =>
                                                            setCreateData(
                                                                'exchange_rate',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>

                                                {stock_ins?.length < 1 && (
                                                    <div className="col-span-2 mb-2 w-full rounded-xl border border-blue-300 bg-blue-50 px-5 py-4 text-sm text-blue-800 shadow-sm">
                                                        <div className="mb-1 text-base font-bold text-blue-700">
                                                            ℹ️ Info
                                                        </div>
                                                        <p>
                                                            No Container Found Or All Containers Are
                                                            Selected Previously Please Create New
                                                            Container To Assign
                                                        </p>
                                                    </div>
                                                )}

                                                {stock_ins.length > 0 &&
                                                    createData?.currency_id !== '' &&
                                                    (createData.exchange_rate != 0 ||
                                                        createData.exchange_rate != '') && (
                                                        <>
                                                            {/* First Table: Stock Containers Selection */}

                                                            <p className="col-span-2 text-center font-outfit text-xl font-bold text-gray-800 dark:text-white/80 lg:text-2xl">
                                                                Containers
                                                            </p>

                                                            <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-1">
                                                                <table className="min-w-full divide-y divide-gray-200 border text-center dark:divide-gray-600">
                                                                    <thead className="bg-gray-100 dark:bg-gray-700">
                                                                        <tr>
                                                                            <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-white">
                                                                                Select
                                                                            </th>
                                                                            <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-white">
                                                                                Container No
                                                                            </th>
                                                                            <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-white">
                                                                                Total Amount
                                                                            </th>
                                                                        </tr>
                                                                    </thead>

                                                                    <tbody className="bg-white dark:bg-gray-800">
                                                                        {stock_ins.length > 0 &&
                                                                            stock_ins?.map(
                                                                                (item, index) => {
                                                                                    const matchedContainer =
                                                                                        createData?.containers?.find(
                                                                                            (c) =>
                                                                                                c.container_id ===
                                                                                                item.id,
                                                                                        );
                                                                                    return (
                                                                                        <tr
                                                                                            key={
                                                                                                index
                                                                                            }
                                                                                        >
                                                                                            <td className="px-4 py-2">
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    value={
                                                                                                        item.id
                                                                                                    }
                                                                                                    onChange={() =>
                                                                                                        handleContainerSelectCreate(
                                                                                                            item,
                                                                                                        )
                                                                                                    }
                                                                                                    checked={Boolean(
                                                                                                        matchedContainer,
                                                                                                    )}
                                                                                                    className="h-6 w-6 cursor-pointer rounded-lg border-slate-300 bg-slate-50 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-white"
                                                                                                />
                                                                                            </td>
                                                                                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                                                                                                {item.container_no ||
                                                                                                    'N/A'}
                                                                                            </td>
                                                                                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                                                                                                {item?.total_amount ??
                                                                                                    '-'}
                                                                                            </td>
                                                                                        </tr>
                                                                                    );
                                                                                },
                                                                            )}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                            {/* Second Table: Selected Containers Summary */}
                                                            {createData?.containers.length > 0 && (
                                                                <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-1">
                                                                    <p className="text-center font-outfit text-xl font-bold text-gray-800 dark:text-white/80 lg:text-2xl">
                                                                        Selected Containers
                                                                    </p>

                                                                    <table className="min-w-full divide-y divide-gray-200 border text-center dark:divide-gray-600">
                                                                        <thead className="bg-gray-100 dark:bg-gray-700">
                                                                            <tr>
                                                                                <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-white"></th>
                                                                                <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-white">
                                                                                    Container No
                                                                                </th>
                                                                                <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-white">
                                                                                    Total Amount In
                                                                                    FC
                                                                                </th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="bg-white dark:bg-gray-800">
                                                                            {createData?.containers.map(
                                                                                (item, index) => (
                                                                                    <tr key={index}>
                                                                                        <td
                                                                                            className="cursor-pointer px-4 py-2 text-sm text-gray-800 dark:text-white"
                                                                                            onClick={() =>
                                                                                                handleContainerRemoveCreate(
                                                                                                    item,
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <svg
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                fill="none"
                                                                                                viewBox="0 0 24 24"
                                                                                                strokeWidth={
                                                                                                    1.5
                                                                                                }
                                                                                                stroke="currentColor"
                                                                                                className="size-6 text-red-500"
                                                                                            >
                                                                                                <path
                                                                                                    strokeLinecap="round"
                                                                                                    strokeLinejoin="round"
                                                                                                    d="M6 18 18 6M6 6l12 12"
                                                                                                />
                                                                                            </svg>
                                                                                        </td>

                                                                                        <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                                                                                            {item?.container_no ||
                                                                                                'N/A'}
                                                                                        </td>
                                                                                        <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                                                                                            {item?.total_amount ||
                                                                                                0}
                                                                                        </td>
                                                                                    </tr>
                                                                                ),
                                                                            )}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}

                                                {/* Buttons */}
                                                <div className="col-span-2 mt-4 flex items-center justify-center gap-4">
                                                    <PrimaryButton
                                                        Action={() => {
                                                            setCreateModalOpen(false);
                                                            setCreateData('bl_date', '');
                                                            setCreateData('bl_no', '');
                                                            setCreateData('exchange_rate', 0);
                                                            setCreateData('currency_id', '');
                                                            setCreateData('containers', []);
                                                        }}
                                                        Disabled={createProcessing}
                                                        Icon={
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-5 w-5"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                                                                />
                                                            </svg>
                                                        }
                                                        Type={'button'}
                                                        Text={'Close'}
                                                        CustomClass={
                                                            'bg-red-500 hover:bg-red-600 w-full '
                                                        }
                                                    />

                                                    <PrimaryButton
                                                        Type="submit"
                                                        Text="Save Stock Out"
                                                        Spinner={createProcessing}
                                                        Disabled={
                                                            createProcessing ||
                                                            createData.bl_date == '' ||
                                                            createData.bl_no.trim() == '' ||
                                                            createData.exchange_rate == 0 ||
                                                            createData.exchange_rate == '' ||
                                                            createData.currency_id == '' ||
                                                            createData.containers.length == 0
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
                                                                    d="M12 4.5v15m7.5-7.5h-15"
                                                                />
                                                            </svg>
                                                        }
                                                    />
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}

                                {EditModalOpen && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 backdrop-blur-[32px]"
                                            onClick={() =>
                                                !editProcessing && setEditModalOpen(false)
                                            }
                                        ></div>

                                        {/* Modal content */}
                                        <div className="relative z-10 max-h-screen w-full max-w-screen-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 sm:p-8">
                                            <form
                                                onSubmit={EditMethod}
                                                className="grid grid-cols-1 items-start gap-6 md:grid-cols-2"
                                            >
                                                <div className="col-span-2">
                                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                        Edit Stock Out
                                                    </h3>
                                                </div>

                                                {/* Divider */}
                                                <div className="col-span-2 mb-6 border-b border-gray-200 dark:border-gray-700"></div>

                                                {editErrors?.server && (
                                                    <div className="col-span-2 mb-2 w-full rounded-xl border border-red-300 bg-red-50 px-5 py-4 text-sm text-red-800 shadow-sm">
                                                        <div className="mb-1 text-base font-bold text-red-700">
                                                            ⚠️ Error
                                                        </div>
                                                        <p>{editErrors.server}</p>
                                                    </div>
                                                )}

                                                <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-3">
                                                    <Input
                                                        InputName={'Bl Date'}
                                                        InputRef={flatpickerForEditForm}
                                                        Id={'bl_date'}
                                                        Name={'bl_date'}
                                                        Type={'text'}
                                                        Placeholder={'Enter B/L Date'}
                                                        Required={true}
                                                        Error={editErrors.bl_date}
                                                        Value={editData.bl_date}
                                                        Action={(e) =>
                                                            setEditData('bl_date', e.target.value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Bl No'}
                                                        Id={'bl_no'}
                                                        Name={'bl_no'}
                                                        Type={'text'}
                                                        Placeholder={'Enter B/L No'}
                                                        Required={true}
                                                        Error={editErrors.bl_no}
                                                        Value={editData.bl_no}
                                                        Action={(e) =>
                                                            setEditData('bl_no', e.target.value)
                                                        }
                                                    />

                                                    <SelectInput
                                                        InputName={'Currency'}
                                                        Id={'currency_id'}
                                                        Name={'currency_id'}
                                                        items={currencies}
                                                        itemKey={'name'}
                                                        Required={true}
                                                        Error={editErrors.currency_id}
                                                        Value={editData.currency_id}
                                                        Placeholder={false}
                                                        Action={(value) =>
                                                            setEditData('currency_id', value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Exchange Rate'}
                                                        Id={'exchange_rate'}
                                                        Name={'exchange_rate'}
                                                        Type={'number'}
                                                        Placeholder={'Enter Exchange Rate'}
                                                        Required={true}
                                                        Error={editErrors.exchange_rate}
                                                        Value={editData.exchange_rate}
                                                        Action={(e) =>
                                                            setEditData(
                                                                'exchange_rate',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>

                                                {stock_ins?.length < 1 && (
                                                    <div className="col-span-2 mb-2 w-full rounded-xl border border-blue-300 bg-blue-50 px-5 py-4 text-sm text-blue-800 shadow-sm">
                                                        <div className="mb-1 text-base font-bold text-blue-700">
                                                            ℹ️ Info
                                                        </div>
                                                        <p>
                                                            No Container Found Or All Containers Are
                                                            Selected Previously Please Create New
                                                            Container To Assign
                                                        </p>
                                                    </div>
                                                )}

                                                {stock_ins.length > 0 &&
                                                    editData?.currency_id !== '' &&
                                                    (editData.exchange_rate != 0 ||
                                                        editData.exchange_rate != '') && (
                                                        <>
                                                            {/* First Table: Stock Containers Selection */}

                                                            <p className="col-span-2 text-center font-outfit text-xl font-bold text-gray-800 dark:text-white/80 lg:text-2xl">
                                                                Containers
                                                            </p>

                                                            <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-1">
                                                                <table className="min-w-full divide-y divide-gray-200 border text-center dark:divide-gray-600">
                                                                    <thead className="bg-gray-100 dark:bg-gray-700">
                                                                        <tr>
                                                                            <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-white">
                                                                                Select
                                                                            </th>
                                                                            <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-white">
                                                                                Container No
                                                                            </th>
                                                                            <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-white">
                                                                                Total Amount
                                                                            </th>
                                                                        </tr>
                                                                    </thead>

                                                                    <tbody className="bg-white dark:bg-gray-800">
                                                                        {stock_ins.length > 0 &&
                                                                            stock_ins?.map(
                                                                                (item, index) => {
                                                                                    const matchedContainer =
                                                                                        editData?.containers?.find(
                                                                                            (c) =>
                                                                                                (c.container_id ??
                                                                                                    c.id) ===
                                                                                                item.id,
                                                                                        );
                                                                                    return (
                                                                                        <tr
                                                                                            key={
                                                                                                index
                                                                                            }
                                                                                        >
                                                                                            <td className="px-4 py-2">
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    value={
                                                                                                        item.id
                                                                                                    }
                                                                                                    onChange={() =>
                                                                                                        handleContainerSelectEdit(
                                                                                                            item,
                                                                                                        )
                                                                                                    }
                                                                                                    checked={Boolean(
                                                                                                        matchedContainer,
                                                                                                    )}
                                                                                                    className="h-6 w-6 cursor-pointer rounded-lg border-slate-300 bg-slate-50 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-white"
                                                                                                />
                                                                                            </td>
                                                                                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                                                                                                {item.container_no ||
                                                                                                    'N/A'}
                                                                                            </td>
                                                                                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                                                                                                {item?.total_amount ??
                                                                                                    '-'}
                                                                                            </td>
                                                                                        </tr>
                                                                                    );
                                                                                },
                                                                            )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </>
                                                    )}

                                                {/* Second Table: Selected Containers Summary */}

                                                {editData?.containers.length > 0 && (
                                                    <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-1">
                                                        <p className="text-center font-outfit text-xl font-bold text-gray-800 dark:text-white/80 lg:text-2xl">
                                                            Selected Containers
                                                        </p>

                                                        <table className="min-w-full divide-y divide-gray-200 border text-center dark:divide-gray-600">
                                                            <thead className="bg-gray-100 dark:bg-gray-700">
                                                                <tr>
                                                                    <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-white"></th>
                                                                    <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-white">
                                                                        Container No
                                                                    </th>
                                                                    <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-white">
                                                                        Total Amount In FC
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white dark:bg-gray-800">
                                                                {editData?.containers.map(
                                                                    (item, index) => (
                                                                        <tr key={index}>
                                                                            <td
                                                                                className="cursor-pointer px-4 py-2 text-sm text-gray-800 dark:text-white"
                                                                                onClick={() =>
                                                                                    handleContainerRemoveEdit(
                                                                                        item,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    fill="none"
                                                                                    viewBox="0 0 24 24"
                                                                                    strokeWidth={
                                                                                        1.5
                                                                                    }
                                                                                    stroke="currentColor"
                                                                                    className="size-6 text-red-500"
                                                                                >
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        d="M6 18 18 6M6 6l12 12"
                                                                                    />
                                                                                </svg>
                                                                            </td>
                                                                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                                                                                {item?.container_no ||
                                                                                    'N/A'}
                                                                            </td>
                                                                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                                                                                {item?.total_amount ||
                                                                                    0}
                                                                            </td>
                                                                        </tr>
                                                                    ),
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}

                                                {/* Buttons */}
                                                <div className="col-span-2 mt-4 flex items-center justify-center gap-4">
                                                    <PrimaryButton
                                                        Action={() => {
                                                            setEditModalOpen(false);
                                                            setEditData('id', '');
                                                            setEditData('bl_date', '');
                                                            setEditData('bl_no', '');
                                                            setEditData('currency_id', '');
                                                            setEditData('exchange_rate', 0);
                                                            setEditData('containers', []);
                                                        }}
                                                        Disabled={editProcessing}
                                                        Icon={
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-5 w-5"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                                                                />
                                                            </svg>
                                                        }
                                                        Type={'button'}
                                                        Text={'Close'}
                                                        CustomClass={
                                                            'bg-red-500 hover:bg-red-600 w-full '
                                                        }
                                                    />

                                                    <PrimaryButton
                                                        Type="submit"
                                                        Text="Update Stock Out"
                                                        Spinner={editProcessing}
                                                        Disabled={
                                                            editProcessing ||
                                                            editData.id == '' ||
                                                            editData.bl_date == '' ||
                                                            editData.bl_no.trim() == '' ||
                                                            editData.exchange_rate == 0 ||
                                                            editData.exchange_rate == '' ||
                                                            editData.currency_id == '' ||
                                                            editData.containers.length == 0
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
                                                                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                                                                />
                                                            </svg>
                                                        }
                                                    />
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}

                                {viewModalOpen && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 backdrop-blur-[32px]"
                                            onClick={() => setViewModalOpen(false)}
                                        ></div>

                                        {/* Modal content */}
                                        <div className="relative z-10 max-h-screen w-full max-w-screen-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 sm:p-8">
                                            <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                                                View Stock Out
                                            </h3>

                                            {/* Divider */}
                                            <div className="mb-6 border-b border-gray-200 dark:border-gray-700"></div>

                                            {/* Product Table Section */}
                                            <div className="mt-6">
                                                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                                                    Container Details
                                                </h3>
                                                <table className="min-w-full divide-y divide-gray-200 border dark:divide-gray-600">
                                                    <thead className="bg-gray-100 dark:bg-gray-700">
                                                        <tr>
                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                                                                B/L Date
                                                            </th>
                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                                                                B/L No
                                                            </th>
                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                                                                Currency
                                                            </th>
                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                                                                Exchange Rate
                                                            </th>

                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                                                                Container No
                                                            </th>

                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                                                                Total Amount In FC
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white dark:bg-gray-800">
                                                        {viewData.containers.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                                                                        {viewData.bl_date}
                                                                    </td>

                                                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                                                                        {viewData.bl_no}
                                                                    </td>

                                                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                                                                        {viewData.currency.name}
                                                                    </td>

                                                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                                                                        {viewData.exchange_rate}
                                                                    </td>

                                                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                                                                        {item.container_no}
                                                                    </td>

                                                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                                                                        {item.total_amount}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Buttons */}
                                            <div className="mt-8 flex flex-col-reverse items-center justify-end gap-4 sm:flex-row">
                                                <PrimaryButton
                                                    Action={() => {
                                                        setViewModalOpen(false);
                                                        setViewData(null);
                                                    }}
                                                    Icon={
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-5 w-5"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                                                            />
                                                        </svg>
                                                    }
                                                    Type="button"
                                                    Text="Close"
                                                    CustomClass="bg-red-500 hover:bg-red-600 w-full"
                                                />

                                                <PrimaryButton
                                                    Type="button"
                                                    Text="Edit Stock Out"
                                                    Action={() => {
                                                        setEditData(viewData);
                                                        setViewModalOpen(false);
                                                        setEditModalOpen(true);
                                                    }}
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
                                                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                                            />
                                                        </svg>
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    }
                />
            </AuthenticatedLayout>
        </>
    );
}
