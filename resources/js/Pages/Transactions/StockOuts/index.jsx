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
import axios from 'axios';
import Swal from 'sweetalert2';

export default function index({
    stock_ins,
    stock_outs,
    currencies,
    container_collection,
    accounts,
}) {
    const { props } = usePage();

    const { asset } = usePage().props;

    // Application Logo Sate
    const [ApplicationLogo, setApplicationLogo] = useState(asset + 'assets/images/Logo/Logo.png');

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
        port_name: '',
        account_id: '',
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
        port_name: '',
        account_id: '',
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
        account: '',
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
                setEditData('port_name', '');
                setEditData('currency_id', '');
                setEditData('exchange_rate', 0);
                setEditData('containers', []);
            },
        });
    };

    const [generateInvoiceModalOpen, setGenerateInvoiceModalOpen] = useState(false);
    const [invoiceData, setInvoiceData] = useState({});
    const [invoiceDataLoader, setInvoiceDataLoader] = useState(false);

    const getDataForInvoice = (stock_out_id) => {
        // setTimeout(() => {
        //     setInvoiceDataLoader(false);
        // }, 2000);

        // For Checking Just
        // router.post(route('transactions.stock-out.generate-invoice'), {
        //     stock_out_id: stock_out_id,
        // });

        axios
            .post(route('transactions.stock-out.generate-invoice'), { stock_out_id: stock_out_id })
            .then((response) => {
                if (response.data.status) {
                    setInvoiceData(response.data.data);
                    router.reload('stock_outs');
                } else {
                    setInvoiceData({});
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.data.message,
                        showConfirmButton: true,
                    });
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error fetching invoice data:' + error,
                    showConfirmButton: true,
                });
                setInvoiceData({});
            })
            .finally(() => {
                setInvoiceDataLoader(false);
            });
    };

    const invoiceRef = useRef();

    const handlePrint = () => {
        const content = invoiceRef.current.innerHTML;

        const printWindow = window.open('', '_blank');

        printWindow.document.open();
        printWindow.document.write(`
    <html>
      <head>
        <title>Invoice Print</title>
        <!-- Tailwind CSS CDN -->
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body {
            margin: 40px;
            background: #fff !important;
            color: #000 !important;
          }
          /* Hide any original print buttons from content */
          .no-print {
            display: none !important;
          }
          /* Prevent dark mode styles */
          .dark\\:bg-gray-800,
          .dark\\:border-white\\/80 {
            background-color: #fff !important;
            border-color: #000 !important;
          }
          /* Style for the manual print button */
          #print-btn {
            position: fixed;
            top: 100px;
            right: 20px;
            background: #2563eb;
            color: white;
            padding: 10px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-family: sans-serif;
            font-size: 14px;
          }
          #print-btn:hover {
            background: #1d4ed8;
          }
        </style>
      </head>
      <body>
        <button id="print-btn" class="print:hidden" onclick="window.print()">
            Print
        </button>
        <div class="p-10">
          ${content}
        </div>
      </body>
    </html>
  `);
        printWindow.document.close();
    };

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
            { key: 'port_name', label: 'Port Name' },
            {
                label: 'Account',
                render: (item) => {
                    return item?.account
                        ? item?.account?.account_code + ' - ' + item?.account?.title
                        : 'N/A';
                },
            },
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
                label: 'Generate Invoice',
                type: 'button',
                onClick: (item) => {
                    setGenerateInvoiceModalOpen(true);
                    getDataForInvoice(item.id);
                    setInvoiceDataLoader(true);
                },
            },
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
                        account: item.account,
                        port_name: item.port_name,
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

                    if (item.invoice) {
                        Swal.fire({
                            icon: 'info',
                            title: 'Info',
                            text: 'Invoice already generated for this stock out and cannot be edited.',
                        });
                    } else {
                        setEditModalOpen(true);
                        setActualData(item);
                        setEditData('id', item.id);
                        setEditData('bl_date', item.bl_date);
                        setEditData('account_id', item.account_id);
                        setEditData('bl_no', item.bl_no);
                        setEditData('port_name', item.port_name);
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
                    }
                },
            },
        ];

        setCustomActions(actions);
        setColumns(columns);
    }, []);

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

                                                <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-4">
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
                                                        InputName={'Accounts'}
                                                        Id={'account_id'}
                                                        Name={'account_id'}
                                                        items={accounts}
                                                        itemKey={'name'}
                                                        Required={true}
                                                        Error={createErrors.account_id}
                                                        Value={createData.account_id}
                                                        Placeholder={false}
                                                        Action={(value) =>
                                                            setCreateData('account_id', value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Port Name'}
                                                        Id={'port_name'}
                                                        Name={'port_name'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Port Name'}
                                                        Required={true}
                                                        Error={createErrors.port_name}
                                                        Value={createData.port_name}
                                                        Action={(e) =>
                                                            setCreateData(
                                                                'port_name',
                                                                e.target.value,
                                                            )
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
                                                            setCreateData('port_name', '');
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

                                                <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-4">
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
                                                        InputName={'Accounts'}
                                                        Id={'account_id'}
                                                        Name={'account_id'}
                                                        items={accounts}
                                                        itemKey={'name'}
                                                        Required={true}
                                                        Error={editErrors.account_id}
                                                        Value={editData.account_id}
                                                        Placeholder={false}
                                                        Action={(value) =>
                                                            setEditData('account_id', value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Port Name'}
                                                        Id={'port_name'}
                                                        Name={'port_name'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Port Name'}
                                                        Required={true}
                                                        Error={editErrors.port_name}
                                                        Value={editData.port_name}
                                                        Action={(e) =>
                                                            setEditData('port_name', e.target.value)
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
                                                            setEditData('port_name', '');
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
                                            <div className="mt-6 overflow-x-auto">
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
                                                                Account
                                                            </th>

                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                                                                Port Name
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
                                                                        {viewData.account
                                                                            ? viewData.account
                                                                                  .account_code +
                                                                              ' - ' +
                                                                              viewData.account.title
                                                                            : 'N/A'}
                                                                    </td>

                                                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                                                                        {viewData.port_name ??
                                                                            'N/A'}
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

                {/* Invoice Modal */}
                {generateInvoiceModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 backdrop-blur-[32px]"
                            onClick={() => setGenerateInvoiceModalOpen(false)}
                        ></div>

                        {/* Modal content */}
                        <div className="relative z-10 max-h-screen w-full max-w-screen-lg overflow-y-auto rounded-2xl bg-white p-6 text-gray-700 shadow-xl dark:bg-gray-800 dark:text-white/80 sm:p-8">
                            <div className="mx-auto max-w-4xl bg-white p-8 font-sans dark:bg-gray-800">
                                {invoiceDataLoader && (
                                    <div className="flex flex-col items-center justify-center gap-6 py-20">
                                        <p className="text-center text-2xl">
                                            Please Wait While We Are Generating Your Invoice
                                        </p>

                                        <div role="status">
                                            <svg
                                                aria-hidden="true"
                                                className="h-10 w-10 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                                                viewBox="0 0 100 101"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                    fill="currentFill"
                                                />
                                            </svg>
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                )}

                                {!invoiceDataLoader && Object.values(invoiceData).length > 0 && (
                                    <div ref={invoiceRef}>
                                        <button
                                            onClick={handlePrint}
                                            className="no-print mb-4 rounded-2xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 print:hidden"
                                        >
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
                                                    d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
                                                />
                                            </svg>
                                        </button>

                                        {/* Header */}
                                        <div className="mb-8 flex items-start justify-between">
                                            <div className="flex items-center gap-4">
                                                {/* Logo */}
                                                <div className="relative">
                                                    <div className="h-[100px] w-[100px] bg-white">
                                                        <img
                                                            src={ApplicationLogo}
                                                            alt="Logo"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                                <h1 className="text-3xl font-bold text-gray-800">
                                                    Hasnain Enterprises
                                                </h1>
                                            </div>
                                            <div className="text-right text-sm">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <span>📧</span>
                                                    <span>hr.enterprises5655@gmail.com</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span>📞</span>
                                                    <span>+92-21-35308637-38</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Invoice Title */}
                                        <div className="mb-8 text-center">
                                            <h2 className="text-xl font-bold">
                                                COMMERCIAL INVOICE
                                            </h2>
                                        </div>

                                        {/* Invoice Details */}
                                        <div className="mb-6 flex justify-between">
                                            <div>
                                                <div className="mb-4">
                                                    <strong>INVOICE NO:</strong>{' '}
                                                    {invoiceData?.invoice_no ?? 'N/A'}
                                                </div>
                                                <div className="mb-6">
                                                    Shipped in good order and condition per:{' '}
                                                    <strong>By Sea</strong> _____ From Karachi to:{' '}
                                                    <strong>
                                                        {invoiceData?.port_name ?? 'N/A'}
                                                    </strong>
                                                </div>

                                                <div className="mb-2">
                                                    <strong>CONSIGNEE</strong>
                                                </div>
                                                <div className="mb-1 text-lg font-bold underline decoration-2 underline-offset-2">
                                                    {invoiceData?.customer_name ?? 'N/A'}
                                                </div>
                                                <div className="mb-4">
                                                    {' '}
                                                    {invoiceData?.customer_address ?? ''}
                                                </div>

                                                <div className="mb-2">
                                                    <strong>PAYMENT TERM:</strong>{' '}
                                                    {invoiceData?.payment_term ?? 'N/A'}
                                                </div>
                                                <div>
                                                    <strong>HS CODE:</strong>{' '}
                                                    {invoiceData?.hs_code ?? 'N/A'}
                                                </div>
                                            </div>

                                            <div>
                                                <strong>Dated:</strong> {invoiceData.invoice_date}
                                            </div>
                                        </div>

                                        <div className="mb-8 overflow-x-auto">
                                            {/* Invoice Table */}
                                            <div className="hidden min-w-full sm:block">
                                                {/* Table Header */}
                                                <div className="border-b-2 border-black bg-gray-50 dark:border-white/80 dark:bg-gray-800">
                                                    <div className="grid grid-cols-9 gap-2 p-3 text-center text-xs font-bold">
                                                        <div className="border-r border-gray-300">
                                                            CONT NO.
                                                        </div>
                                                        <div className="border-r border-gray-300">
                                                            PRODUCT NAME
                                                        </div>
                                                        <div className="border-r border-gray-300">
                                                            WT. IN KGS
                                                        </div>
                                                        <div className="border-r border-gray-300">
                                                            WT IN MANN
                                                        </div>
                                                        <div className="border-r border-gray-300">
                                                            BUNDLES
                                                        </div>
                                                        <div className="border-r border-gray-300">
                                                            TOT. VALUE
                                                        </div>
                                                        <div className="border-r border-gray-300">
                                                            F/C
                                                        </div>
                                                        <div className="border-r border-gray-300">
                                                            EXCH. RATE
                                                        </div>
                                                        <div>AMT. IN AED</div>
                                                    </div>
                                                </div>

                                                {/* Table Rows */}
                                                <div className="border-b border-black">
                                                    {invoiceData.items.map((item, index) => {
                                                        return (
                                                            <div
                                                                key={index}
                                                                className="grid grid-cols-9 gap-2 border-b border-gray-200 p-3 text-center text-xs"
                                                            >
                                                                <div className="break-all border-r border-gray-200">
                                                                    {item.container_no ?? 'N/A'}
                                                                </div>
                                                                <div className="break-all border-r border-gray-200">
                                                                    {item.product_name ?? 'N/A'}
                                                                </div>
                                                                <div className="break-all border-r border-gray-200">
                                                                    {item?.weight_in_kgs ?? 'N/A'}
                                                                </div>
                                                                <div className="break-all border-r border-gray-200">
                                                                    {item?.weight_in_mann ?? 'N/A'}
                                                                </div>
                                                                <div className="break-all border-r border-gray-200">
                                                                    {item?.bundles ?? 'N/A'}
                                                                </div>
                                                                <div className="break-all border-r border-gray-200">
                                                                    {item?.total_container_amount ??
                                                                        'N/A'}
                                                                </div>
                                                                <div className="break-all border-r border-gray-200">
                                                                    {item?.fc ?? 'N/A'}
                                                                </div>
                                                                <div className="break-all border-r border-gray-200">
                                                                    {item?.exchange_rate ?? 'N/A'}
                                                                </div>
                                                                <div>
                                                                    {item?.total_amount ?? 'N/A'}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Total Row */}
                                                <div className="border-t-2 border-black bg-gray-100 dark:border-white/80 dark:bg-gray-800">
                                                    <div className="grid grid-cols-9 gap-2 p-3 text-center text-xs font-bold">
                                                        <div className="col-span-2 text-left">
                                                            TOTAL
                                                        </div>
                                                        <div className="border-r border-gray-300">
                                                            {invoiceData?.totals
                                                                ?.total_weight_kgs ?? 'N/A'}
                                                        </div>
                                                        <div className="border-r border-gray-300">
                                                            {invoiceData?.totals
                                                                ?.total_weight_mann ?? 'N/A'}
                                                        </div>
                                                        <div className="border-r border-gray-300">
                                                            {invoiceData?.totals?.total_bundles ??
                                                                'N/A'}
                                                        </div>
                                                        <div className="border-r border-gray-300">
                                                            {invoiceData?.totals
                                                                ?.total_container_amount ?? 'N/A'}
                                                        </div>
                                                        <div className="border-r border-gray-300"></div>
                                                        <div className="border-r border-gray-300"></div>
                                                        <div className="text-right font-bold">
                                                            {invoiceData?.totals?.total_fc_amount ??
                                                                'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mobile View - Alternative Table Layout */}
                                            <div className="mt-6 block sm:hidden">
                                                {invoiceData.items.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="mb-4 rounded-lg border border-gray-300 bg-gray-50 p-4"
                                                    >
                                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                                            <div>
                                                                <strong>CONT NO.:</strong>{' '}
                                                                {item.container_no ?? 'N/A'}
                                                            </div>
                                                            <div>
                                                                <strong>PRODUCT:</strong>{' '}
                                                                {item.product_name ?? 'N/A'}
                                                            </div>
                                                            <div>
                                                                <strong>WT. IN KGS:</strong>{' '}
                                                                {item.weight_in_kgs ?? 'N/A'}
                                                            </div>
                                                            <div>
                                                                <strong>WT IN MANN:</strong>{' '}
                                                                {item.weight_in_mann ?? 'N/A'}
                                                            </div>
                                                            <div>
                                                                <strong>BUNDLES:</strong>{' '}
                                                                {item.bundles ?? 'N/A'}
                                                            </div>
                                                            <div>
                                                                <strong>TOT. VALUE:</strong>{' '}
                                                                {item.total_container_amount ??
                                                                    'N/A'}
                                                            </div>
                                                            <div>
                                                                <strong>F/C:</strong>{' '}
                                                                {item.fc ?? 'N/A'}
                                                            </div>
                                                            <div>
                                                                <strong>EXCH. RATE:</strong>{' '}
                                                                {item.exchange_rate ?? 'N/A'}
                                                            </div>
                                                            <div className="col-span-2 mt-2 text-center">
                                                                <strong>
                                                                    AMT. IN AED:{' '}
                                                                    {item.total_amount ?? 'N/A'}
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                <div className="rounded-lg border-2 border-black bg-gray-100 p-4">
                                                    <div className="text-center font-bold">
                                                        <div className="mb-2">TOTAL SUMMARY</div>
                                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                                            <div>
                                                                Total Weight (KGS):{' '}
                                                                {invoiceData?.totals
                                                                    ?.total_weight_kgs ?? 'N/A'}
                                                            </div>
                                                            <div>
                                                                Total Weight (MANN):{' '}
                                                                {invoiceData?.totals
                                                                    ?.total_weight_mann ?? 'N/A'}
                                                            </div>
                                                            <div>
                                                                Total Bundles:{' '}
                                                                {invoiceData?.totals
                                                                    ?.total_bundles ?? 'N/A'}
                                                            </div>
                                                            <div>
                                                                Total Value:{' '}
                                                                {invoiceData?.totals
                                                                    ?.total_container_amount ??
                                                                    'N/A'}
                                                            </div>
                                                            <div className="col-span-2 mt-2 text-lg">
                                                                <strong>
                                                                    TOTAL: AED Value{' '}
                                                                    {invoiceData?.totals
                                                                        ?.total_fc_amount ?? 'N/A'}
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Signature Section */}
                                        {/* <div className="flex justify-end mb-8">
                                            <div className="text-center">
                                                <div className="mb-2 text-lg font-bold text-blue-600">
                                                    Hasnain Enterprises
                                                </div>
                                                <div className="mb-2 text-2xl text-blue-600 font-script">
                                                    Abdullah
                                                </div>
                                                <div className="font-bold text-blue-600">
                                                    Proprietor
                                                </div>
                                                <div className="mt-4 text-sm">
                                                    FOR: <strong>HASNAIN ENTERPRISES</strong>
                                                </div>
                                            </div>
                                        </div> */}

                                        {/* Footer Address */}
                                        <div className="mt-8 border-t-2 border-yellow-600 pt-4">
                                            <div className="text-center text-sm">
                                                The Plaza, Office No.118, Plot No. G-7, Block 9, KDA
                                                Scheme No.5,
                                                <br />
                                                Kehkashan Clifton, Karachi Central.
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </AuthenticatedLayout>
        </>
    );
}
