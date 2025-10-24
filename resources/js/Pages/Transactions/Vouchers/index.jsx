import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BreadCrumb from '@/Components/BreadCrumb';
import { Head, useForm, usePage } from '@inertiajs/react';
import Table from '@/Components/Table';
import { useEffect, useRef, useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import Input from '@/Components/Input';
import SelectInput from '@/Components/SelectInput';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function index({ vouchers, account_details, currencies }) {
    const { props } = usePage();
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
        payment_date: '',
        paid_to: '',
        payment_details: '',
        payment_by: '',
        bank_details: {
            bank_id: '',
            cheque_no: '',
            cheque_date: '',
        },
        cash_details: {
            chequebook_id: '',
        },
        detail_id: '',
        currency_id: 1,
        amount: '',
        exchange_rate: 1,
        total_amount: '',
    });

    // Edit Form Data
    const {
        data: editData,
        setData: setEditData,
        put: editPut,
        processing: editProcessing,
        errors: editErrors,
    } = useForm({
        id: '',
        payment_date: '',
        paid_to: '',
        payment_details: '',
        payment_by: '',
        bank_details: {
            bank_id: '',
            cheque_no: '',
            cheque_date: '',
        },
        cash_details: {
            chequebook_id: '',
        },
        detail_id: '',
        currency_id: '',
        amount: '',
        exchange_rate: '',
        total_amount: '',
    });

    const [columns, setColumns] = useState([]);
    const [customActions, setCustomActions] = useState([]);

    //    Create Modal  State
    const [CreateModalOpen, setCreateModalOpen] = useState(false);

    //  Edit Modal State
    const [EditModalOpen, setEditModalOpen] = useState(false);

    // View Modal State
    const [viewModalOpen, setViewModalOpen] = useState(false);

    // View Modal Data
    const [viewData, setViewData] = useState(null);

    // Bank Details
    const [bankDetails, setBankDetails] = useState([]);

    // Cash Details
    const [checkbookDetails, setCheckBookDetails] = useState([]);

    // Flatpicker Ref
    const flatpickerForCreateForm = useRef(null);
    const flatpickerForEditForm = useRef(null);
    const flatpickerForCreateFormChequeDate = useRef(null);
    const flatpickerForEditFormChequeDate = useRef(null);
    const initialCurrencyId = useRef(null);
    // flatpicker init useEffect
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (flatpickerForCreateForm.current) {
                flatpickr(flatpickerForCreateForm.current, {
                    dateFormat: 'd-m-Y',
                    disableMobile: true,
                    onChange: function (selectedDates, dateStr) {
                        if (selectedDates[0]) {
                            setCreateData('payment_date', dateStr);
                        }
                    },
                });
            }

            if (flatpickerForEditForm.current) {
                flatpickr(flatpickerForEditForm.current, {
                    dateFormat: 'd-m-Y',
                    disableMobile: true,
                    onChange: function (selectedDates, dateStr) {
                        if (selectedDates[0]) {
                            setEditData('payment_date', dateStr);
                        }
                    },
                });
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [CreateModalOpen, EditModalOpen]);

    // Flatpicker Init For Conditional Inputs
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (createData.payment_by === 'bank' && flatpickerForCreateFormChequeDate.current) {
                flatpickr(flatpickerForCreateFormChequeDate.current, {
                    dateFormat: 'd-m-Y',
                    disableMobile: true,
                    onChange: function (selectedDates, dateStr) {
                        if (selectedDates[0]) {
                            setCreateData('bank_details.cheque_date', dateStr);
                        }
                    },
                });
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [createData.payment_by, flatpickerForCreateFormChequeDate.current]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (editData.payment_by === 'bank' && flatpickerForEditFormChequeDate.current) {
                flatpickr(flatpickerForEditFormChequeDate.current, {
                    dateFormat: 'd-m-Y',
                    disableMobile: true,
                    onChange: function (selectedDates, dateStr) {
                        if (selectedDates[0]) {
                            setEditData('bank_details.cheque_date', dateStr);
                        }
                    },
                });
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [editData.payment_by, flatpickerForEditFormChequeDate.current]);

    // Handling Total Amount Calculation For Create
    useEffect(() => {
        setCreateData('total_amount', '');
        if (createData.currency_id && createData.amount && createData.exchange_rate) {
            const totalAmount = (createData.amount * createData.exchange_rate).toFixed(2);
            setCreateData('total_amount', totalAmount);
        }
    }, [createData.currency_id, createData.amount, createData.exchange_rate]);

    // Handling Total Amount Calculation For Edit
    useEffect(() => {
        setEditData('total_amount', '');

        if (editData.currency_id && editData.amount && editData.exchange_rate) {
            const totalAmount = (editData.amount * editData.exchange_rate).toFixed(2);
            setEditData('total_amount', totalAmount);
        }
    }, [editData.currency_id, editData.amount, editData.exchange_rate]);

    // Handling Currency Change For Exchange Rate Create Form
    useEffect(() => {
        if (createData.currency_id != 1) {
            setCreateData('exchange_rate', '');
        } else {
            setCreateData('exchange_rate', 1);
        }
    }, [createData.currency_id]);

    // Handling Currency Change For Exchange Rate Edit Form
    const [exchangeRateDisabled, setExchangeRateDisabled] = useState(false);
    const firstLoad = useRef(true);
    useEffect(() => {
        // First load after modal open
        if (firstLoad.current) {
            if (editData.currency_id == 1) {
                setExchangeRateDisabled(true);
                setEditData('exchange_rate', 1);
            } else {
                setExchangeRateDisabled(false);
                // DO NOT clear exchange rate here — keep DB value
            }
            firstLoad.current = false;
            return;
        }

        // After first load → user changed currency
        if (editData.currency_id == 1) {
            setExchangeRateDisabled(true);
            setEditData('exchange_rate', 1);
        } else {
            setExchangeRateDisabled(false);
            setEditData('exchange_rate', '');
        }
    }, [editData.currency_id]);

    useEffect(() => {
        const columns = [
            {
                label: 'Payment No',
                render: (item) => {
                    return (
                        <div
                            className="cursor-pointer"
                            onClick={() => {
                                setViewModalOpen(true);
                                setViewData(item);
                            }}
                        >
                            <p className="text-sm font-semibold text-blue-500 underline">
                                {item.payment_no}
                            </p>
                        </div>
                    );
                },
            },
            { key: 'payment_date', label: 'Payment Date' },
            { key: 'paid_to', label: 'Paid To' },
            { key: 'account_detail.account_code', label: 'Account Code' },
            { key: 'currency.name', label: 'Currency' },
            { key: 'amount', label: 'Amount' },
            { key: 'exchange_rate', label: 'Exchange Rate' },
            { key: 'total_amount', label: 'Amount PAID' },
        ];

        const actions = [
            {
                label: 'Edit',
                type: 'button',
                onClick: (item) => {
                    setEditModalOpen(true);
                    setEditData('id', item.id);
                    setEditData('payment_date', item.payment_date);
                    setEditData('paid_to', item.paid_to);
                    setEditData('payment_details', item.payment_details);
                    setEditData('payment_by', item.payment_by);
                    setEditData('bank_details', item.bank_details);
                    setEditData('cash_details', item.cash_details);
                    setEditData('detail_id', item.detail_id);
                    setEditData('currency_id', item.currency_id);
                    setEditData('amount', item.amount);
                    setEditData('exchange_rate', item.exchange_rate);
                    setEditData('total_amount', item.total_amount);
                    initialCurrencyId.current = item.currency_id;
                    firstLoad.current = true;
                },
            },
            {
                label: 'View',
                type: 'button',
                onClick: (item) => {
                    setViewModalOpen(true);
                    setViewData(item);
                },
            },
        ];

        setCustomActions(actions);
        setColumns(columns);
    }, []);

    // CreateMethod
    const CreateMethod = (e) => {
        e.preventDefault();

        createPost(route('transactions.vouchers.store'), {
            onSuccess: () => {
                setCreateData('payment_date', '');
                setCreateData('paid_to', '');
                setCreateData('payment_details', '');
                setCreateData('payment_by', '');
                setCreateData('bank_details', {
                    bank_id: '',
                    cheque_no: '',
                    cheque_date: '',
                });
                setCreateData('cash_details', {
                    chequebook_id: '',
                });
                setCreateData('detail_id', '');
                setCreateData('currency_id', 1);
                setCreateData('amount', '');
                setCreateData('exchange_rate', 1);
                setCreateData('total_amount', '');
            },
        });
    };

    // EditMethod
    const EditMethod = (e) => {
        e.preventDefault();
        editPut(route('transactions.vouchers.update', editData.id), {
            onSuccess: () => {
                setEditModalOpen(false);
                setEditData('id', '');
                setEditData('payment_date', '');
                setEditData('paid_to', '');
                setEditData('payment_details', '');
                setEditData('payment_by', '');
                setEditData('bank_details', {
                    bank_id: '',
                    cheque_no: '',
                    cheque_date: '',
                });
                setEditData('cash_details', {
                    chequebook_id: '',
                });
                setEditData('detail_id', '');
                setEditData('currency_id', '');
                setEditData('amount', '');
                setEditData('exchange_rate', '');
                setEditData('total_amount', '');
            },
        });
    };

    // Get Records by Payment By Type
    const getRecordByType = (type) => {
        setCreateData('bank_details', {
            bank_id: '',
            cheque_no: '',
            cheque_date: '',
        });

        setCreateData('cash_details', {
            chequebook_id: '',
        });
        if (type != '') {
            axios
                .get(route('transactions.vouchers.getaccountdetailsbytype', type))
                .then((response) => {
                    if (response.data.status) {
                        setBankDetails([]);
                        setCheckBookDetails([]);
                        if (response.data.type == 'bank') {
                            setBankDetails(response.data.data);
                        } else {
                            setCheckBookDetails(response.data.data);
                        }
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.data.message,
                        });
                    }
                })
                .catch((error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.message,
                    });
                });
        } else {
            setBankDetails([]);
            setCheckBookDetails([]);
        }
    };

    useEffect(() => {
        if (createData.payment_by != '') {
            getRecordByType(createData.payment_by);
        }

        if (editData.payment_by != '') {
            getRecordByType(editData.payment_by);
        }
    }, [createData.payment_by, editData.payment_by]);

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Payment Vouchers" />

                <BreadCrumb
                    header={'Payment Vouchers'}
                    parent={'Dashboard'}
                    parent_link={route('dashboard')}
                    child={'Payment Vouchers'}
                />

                <Card
                    Content={
                        <>
                            <div className="flex flex-wrap justify-end my-3">
                                <PrimaryButton
                                    CustomClass={'mix-w-[200px]'}
                                    Text={'Create Voucher'}
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
                                BulkDeleteRoute={'transactions.vouchers.destroybyselection'}
                                SingleDeleteRoute={'transactions.vouchers.destroy'}
                                items={vouchers}
                                props={props}
                                columns={columns}
                                Search={false}
                                customActions={customActions}
                            />

                            {/* Create Modal */}
                            <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                                {CreateModalOpen && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto sm:p-6">
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 backdrop-blur-[32px]"
                                            onClick={() =>
                                                !createProcessing && setCreateModalOpen(false)
                                            }
                                        ></div>

                                        {/* Modal content */}
                                        <div className="relative z-10 w-full max-w-5xl max-h-screen p-6 overflow-y-auto bg-white shadow-xl rounded-2xl dark:bg-gray-800 sm:p-8">
                                            <form
                                                onSubmit={CreateMethod}
                                                className="grid items-start grid-cols-1 gap-6 md:grid-cols-2"
                                            >
                                                <div className="col-span-2">
                                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                        Create Payment Voucher
                                                    </h3>
                                                </div>

                                                {/* Divider */}
                                                <div className="col-span-2 mb-6 border-b border-gray-200 dark:border-gray-700"></div>

                                                {createErrors?.server && (
                                                    <div className="w-full col-span-2 px-5 py-4 mb-2 text-sm text-red-800 border border-red-300 shadow-sm rounded-xl bg-red-50">
                                                        <div className="mb-1 text-base font-bold text-red-700">
                                                            ⚠️ Error
                                                        </div>
                                                        <p>{createErrors.server}</p>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 col-span-2 gap-4 md:grid-cols-3">
                                                    <Input
                                                        InputName={'Payment Date'}
                                                        InputRef={flatpickerForCreateForm}
                                                        Id={'payment_date'}
                                                        Name={'payment_date'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Payment Date'}
                                                        Required={true}
                                                        Error={createErrors.payment_date}
                                                        Value={createData.payment_date}
                                                        Action={(e) =>
                                                            setCreateData(
                                                                'payment_date',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Paid To'}
                                                        Id={'paid_to'}
                                                        Name={'paid_to'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Paid To'}
                                                        Required={false}
                                                        Error={createErrors.paid_to}
                                                        Value={createData.paid_to}
                                                        Action={(e) =>
                                                            setCreateData('paid_to', e.target.value)
                                                        }
                                                    />

                                                    <div>
                                                        <label
                                                            htmlFor="payment_details"
                                                            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                                                        >
                                                            Payment Details
                                                        </label>
                                                        <textarea
                                                            id="payment_details"
                                                            rows="1"
                                                            className="dark:bg-dark-900 shadow-theme-xs focus:ring-3 focus:outline-hidden mb-2 h-[42px] w-full min-w-0 max-w-full rounded-lg border border-gray-300 bg-transparent py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-300 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-800"
                                                            placeholder="Enter Other Details here..."
                                                            value={createData.payment_details}
                                                            onChange={(e) =>
                                                                setCreateData(
                                                                    'payment_details',
                                                                    e.target.value,
                                                                )
                                                            }
                                                        ></textarea>
                                                        {createErrors.payment_details && (
                                                            <span className="ml-2 text-red-500 dark:text-white">
                                                                {createErrors.payment_details}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <SelectInput
                                                        InputName={'Payment By'}
                                                        Id={'payment_by'}
                                                        Name={'payment_by'}
                                                        Error={createErrors.payment_by}
                                                        Value={createData.payment_by}
                                                        items={[{ name: 'cash' }, { name: 'bank' }]}
                                                        itemKey={'name'}
                                                        Placeholder={'Select Payment By'}
                                                        Required={true}
                                                        Action={(value) => {
                                                            setCreateData('payment_by', value);
                                                        }}
                                                    />

                                                    {/* Bank Details Section */}
                                                    {createData.payment_by === 'bank' &&
                                                        bankDetails?.length > 0 && (
                                                            <>
                                                                <SelectInput
                                                                    InputName={'Select Bank Name'}
                                                                    Id={'bank_id'}
                                                                    Name={'bank_id'}
                                                                    Value={
                                                                        createData?.bank_details
                                                                            ?.bank_id
                                                                    }
                                                                    Error={
                                                                        createErrors?.bank_details
                                                                            ?.bank_id
                                                                    }
                                                                    items={bankDetails}
                                                                    itemKey={'title'}
                                                                    Action={(value) =>
                                                                        setCreateData(
                                                                            'bank_details.bank_id',
                                                                            value,
                                                                        )
                                                                    }
                                                                    Required={true}
                                                                />

                                                                <Input
                                                                    InputName={'Cheque No'}
                                                                    Id={'cheque_no'}
                                                                    Name={'cheque_no'}
                                                                    Type={'text'}
                                                                    Placeholder={'Enter Cheque No'}
                                                                    Required={false}
                                                                    Error={
                                                                        createErrors?.bank_details
                                                                            ?.cheque_no
                                                                    }
                                                                    Value={
                                                                        createData?.bank_details
                                                                            ?.cheque_no
                                                                    }
                                                                    Action={(e) =>
                                                                        setCreateData(
                                                                            'bank_details.cheque_no',
                                                                            e.target.value,
                                                                        )
                                                                    }
                                                                />

                                                                <Input
                                                                    InputName={'Cheque Date'}
                                                                    Id={'cheque_date'}
                                                                    Name={'cheque_date'}
                                                                    InputRef={
                                                                        flatpickerForCreateFormChequeDate
                                                                    }
                                                                    Type={'text'}
                                                                    Placeholder={
                                                                        'Enter Cheque Date'
                                                                    }
                                                                    Required={false}
                                                                    Error={
                                                                        createErrors?.bank_details
                                                                            ?.cheque_date
                                                                    }
                                                                    Value={
                                                                        createData?.bank_details
                                                                            ?.cheque_date
                                                                    }
                                                                    Action={(e) =>
                                                                        setCreateData(
                                                                            'bank_details.cheque_date',
                                                                            e.target.value,
                                                                        )
                                                                    }
                                                                />
                                                            </>
                                                        )}

                                                    {createData.payment_by === 'cash' &&
                                                        checkbookDetails?.length > 0 && (
                                                            <>
                                                                <SelectInput
                                                                    InputName={
                                                                        'Select Cash Book Name'
                                                                    }
                                                                    Id={'chequebook_id'}
                                                                    Name={'chequebook_id'}
                                                                    Error={
                                                                        createErrors?.cash_details
                                                                            ?.chequebook_id
                                                                    }
                                                                    Value={
                                                                        createData?.cash_details
                                                                            ?.chequebook_id
                                                                    }
                                                                    Type={'text'}
                                                                    items={checkbookDetails}
                                                                    itemKey={'title'}
                                                                    Required={true}
                                                                    Action={(value) =>
                                                                        setCreateData(
                                                                            'cash_details.chequebook_id',
                                                                            value,
                                                                        )
                                                                    }
                                                                />
                                                            </>
                                                        )}

                                                    <SelectInput
                                                        InputName={'Account Code'}
                                                        Id={'detail_id'}
                                                        Name={'detail_id'}
                                                        Error={createErrors.detail_id}
                                                        Value={createData.detail_id}
                                                        items={account_details}
                                                        itemKey={'name'}
                                                        Required={true}
                                                        Action={(value) =>
                                                            setCreateData('detail_id', value)
                                                        }
                                                    />

                                                    <SelectInput
                                                        InputName={'Currency'}
                                                        Id={'currency_id'}
                                                        Name={'currency_id'}
                                                        Error={createErrors.currency_id}
                                                        Value={createData.currency_id}
                                                        items={currencies}
                                                        itemKey={'name'}
                                                        Required={true}
                                                        Action={(value) =>
                                                            setCreateData('currency_id', value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Amount'}
                                                        Id={'amount'}
                                                        Name={'amount'}
                                                        Type={'number'}
                                                        Placeholder={'Enter Amount'}
                                                        Required={true}
                                                        Error={createErrors.amount}
                                                        Value={createData.amount}
                                                        onKeyDown={(e) => {
                                                            if (
                                                                ['e', 'E', '+', '-'].includes(e.key)
                                                            ) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        Action={(e) => {
                                                            const value = e.target.value;
                                                            setCreateData('amount', value);
                                                        }}
                                                    />

                                                    <Input
                                                        InputName={'Exchange Rate'}
                                                        Id={'exchange_rate'}
                                                        Name={'exchange_rate'}
                                                        Type={'number'}
                                                        Placeholder={'Enter Exchange Rate'}
                                                        Required={true}
                                                        Error={createErrors.exchange_rate}
                                                        Disabled={
                                                            createData.currency_id == 1 &&
                                                            createData.exchange_rate == 1
                                                        }
                                                        Value={createData.exchange_rate}
                                                        onKeyDown={(e) => {
                                                            if (
                                                                ['e', 'E', '+', '-'].includes(e.key)
                                                            ) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        Action={(e) => {
                                                            const value = e.target.value;
                                                            setCreateData('exchange_rate', value);
                                                        }}
                                                    />

                                                    <Input
                                                        InputName={'Amount PAID'}
                                                        Id={'total_amount'}
                                                        Name={'total_amount'}
                                                        Type={'number'}
                                                        Required={false}
                                                        Error={createErrors.total_amount}
                                                        Value={createData.total_amount}
                                                        Placeholder={'Amount PAID'}
                                                        readOnly={true}
                                                    />
                                                </div>

                                                {/* Buttons */}
                                                <div className="flex items-center justify-center col-span-2 gap-4 mt-4">
                                                    <PrimaryButton
                                                        Action={() => {
                                                            setCreateModalOpen(false);
                                                            setCreateData('payment_date', '');
                                                            setCreateData('paid_to', '');
                                                            setCreateData('payment_details', '');
                                                            setCreateData('payment_by', '');
                                                            setCreateData('bank_details', {
                                                                bank_id: '',
                                                                cheque_no: '',
                                                                cheque_date: '',
                                                            });
                                                            setCreateData('cash_details', {
                                                                chequebook_id: '',
                                                            });
                                                            setCreateData('detail_id', '');
                                                            setCreateData('currency_id', 1);
                                                            setCreateData('amount', '');
                                                            setCreateData('exchange_rate', 1);
                                                            setCreateData('total_amount', '');
                                                        }}
                                                        Disabled={createProcessing}
                                                        Icon={
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="w-5 h-5"
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
                                                            'bg-red-500 hover:bg-red-600 w-full'
                                                        }
                                                    />

                                                    <PrimaryButton
                                                        Type="submit"
                                                        Text="Save Payment Voucher"
                                                        Spinner={createProcessing}
                                                        Disabled={
                                                            createProcessing ||
                                                            createData.payment_date === '' ||
                                                            createData.payment_by === '' ||
                                                            createData.detail_id === '' ||
                                                            createData.currency_id === '' ||
                                                            createData.amount === '' ||
                                                            createData.exchange_rate === '' ||
                                                            (createData.payment_by === 'bank' &&
                                                                createData?.bank_details
                                                                    ?.bank_id === '') ||
                                                            (createData.payment_by === 'cash' &&
                                                                createData?.cash_details
                                                                    ?.chequebook_id === '')
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
                                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto sm:p-6">
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 backdrop-blur-[32px]"
                                            onClick={() =>
                                                !editProcessing && setEditModalOpen(false)
                                            }
                                        ></div>

                                        {/* Modal content */}
                                        <div className="relative z-10 w-full max-w-5xl max-h-screen p-6 overflow-y-auto bg-white shadow-xl rounded-2xl dark:bg-gray-800 sm:p-8">
                                            <form
                                                onSubmit={EditMethod}
                                                className="grid items-start grid-cols-1 gap-6 md:grid-cols-2"
                                            >
                                                <div className="col-span-2">
                                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                        Edit Payment Voucher
                                                    </h3>
                                                </div>

                                                {/* Divider */}
                                                <div className="col-span-2 mb-6 border-b border-gray-200 dark:border-gray-700"></div>

                                                {editErrors?.server && (
                                                    <div className="w-full col-span-2 px-5 py-4 mb-2 text-sm text-red-800 border border-red-300 shadow-sm rounded-xl bg-red-50">
                                                        <div className="mb-1 text-base font-bold text-red-700">
                                                            ⚠️ Error
                                                        </div>
                                                        <p>{editErrors.server}</p>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 col-span-2 gap-4 md:grid-cols-3">
                                                    <Input
                                                        InputName={'Payment Date'}
                                                        InputRef={flatpickerForEditForm}
                                                        Id={'payment_date'}
                                                        Name={'payment_date'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Payment Date'}
                                                        Required={true}
                                                        Error={editErrors.payment_date}
                                                        Value={editData.payment_date}
                                                        Action={(e) =>
                                                            setEditData(
                                                                'payment_date',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Paid To'}
                                                        Id={'paid_to'}
                                                        Name={'paid_to'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Paid To'}
                                                        Required={false}
                                                        Error={editErrors.paid_to}
                                                        Value={editData.paid_to}
                                                        Action={(e) =>
                                                            setEditData('paid_to', e.target.value)
                                                        }
                                                    />

                                                    <div>
                                                        <label
                                                            htmlFor="payment_details"
                                                            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                                                        >
                                                            Payment Details
                                                        </label>
                                                        <textarea
                                                            id="payment_details"
                                                            rows="1"
                                                            className="dark:bg-dark-900 shadow-theme-xs focus:ring-3 focus:outline-hidden mb-2 h-[42px] w-full min-w-0 max-w-full rounded-lg border border-gray-300 bg-transparent py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-300 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-800"
                                                            placeholder="Enter Other Details here..."
                                                            value={editData.payment_details ?? ''}
                                                            onChange={(e) =>
                                                                setEditData(
                                                                    'payment_details',
                                                                    e.target.value,
                                                                )
                                                            }
                                                        ></textarea>
                                                        {editErrors.payment_details && (
                                                            <span className="ml-2 text-red-500 dark:text-white">
                                                                {editErrors.payment_details}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <SelectInput
                                                        InputName={'Payment By'}
                                                        Id={'payment_by'}
                                                        Name={'payment_by'}
                                                        Error={editErrors.payment_by}
                                                        Value={editData.payment_by}
                                                        items={[{ name: 'cash' }, { name: 'bank' }]}
                                                        itemKey={'name'}
                                                        Placeholder={'Select Payment By'}
                                                        Required={true}
                                                        Action={(value) => {
                                                            setEditData('bank_details', {
                                                                bank_id: '',
                                                                cheque_no: '',
                                                                cheque_date: '',
                                                            });

                                                            setEditData('cash_details', {
                                                                chequebook_id: '',
                                                            });
                                                            setEditData('payment_by', value);
                                                        }}
                                                    />

                                                    {/* Bank Details Section */}
                                                    {editData.payment_by === 'bank' &&
                                                        bankDetails?.length > 0 && (
                                                            <>
                                                                <SelectInput
                                                                    InputName={'Select Bank Name'}
                                                                    Id={'bank_id'}
                                                                    Name={'bank_id'}
                                                                    Value={
                                                                        editData?.bank_details
                                                                            ?.bank_id
                                                                    }
                                                                    Error={
                                                                        editErrors?.bank_details
                                                                            ?.bank_id
                                                                    }
                                                                    items={bankDetails}
                                                                    itemKey={'title'}
                                                                    Action={(value) =>
                                                                        setEditData(
                                                                            'bank_details.bank_id',
                                                                            value,
                                                                        )
                                                                    }
                                                                    Required={true}
                                                                />

                                                                <Input
                                                                    InputName={'Cheque No'}
                                                                    Id={'cheque_no'}
                                                                    Name={'cheque_no'}
                                                                    Type={'text'}
                                                                    Placeholder={'Enter Cheque No'}
                                                                    Required={false}
                                                                    Error={
                                                                        editErrors?.bank_details
                                                                            ?.cheque_no
                                                                    }
                                                                    Value={
                                                                        editData?.bank_details
                                                                            ?.cheque_no
                                                                    }
                                                                    Action={(e) =>
                                                                        setEditData(
                                                                            'bank_details.cheque_no',
                                                                            e.target.value,
                                                                        )
                                                                    }
                                                                />

                                                                <Input
                                                                    InputName={'Cheque Date'}
                                                                    Id={'cheque_date'}
                                                                    Name={'cheque_date'}
                                                                    InputRef={
                                                                        flatpickerForEditFormChequeDate
                                                                    }
                                                                    Type={'text'}
                                                                    Placeholder={
                                                                        'Enter Cheque Date'
                                                                    }
                                                                    Required={false}
                                                                    Error={
                                                                        editErrors?.bank_details
                                                                            ?.cheque_date
                                                                    }
                                                                    Value={
                                                                        editData?.bank_details
                                                                            ?.cheque_date
                                                                    }
                                                                    Action={(e) =>
                                                                        setEditData(
                                                                            'bank_details.cheque_date',
                                                                            e.target.value,
                                                                        )
                                                                    }
                                                                />
                                                            </>
                                                        )}

                                                    {editData.payment_by === 'cash' &&
                                                        checkbookDetails?.length > 0 && (
                                                            <>
                                                                <SelectInput
                                                                    InputName={
                                                                        'Select Cash Book Name'
                                                                    }
                                                                    Id={'chequebook_id'}
                                                                    Name={'chequebook_id'}
                                                                    Error={
                                                                        editErrors?.cash_details
                                                                            ?.chequebook_id
                                                                    }
                                                                    Type={'text'}
                                                                    items={checkbookDetails}
                                                                    itemKey={'title'}
                                                                    Value={
                                                                        editData?.cash_details
                                                                            ?.chequebook_id
                                                                    }
                                                                    Required={true}
                                                                    Action={(value) =>
                                                                        setEditData(
                                                                            'cash_details.chequebook_id',
                                                                            value,
                                                                        )
                                                                    }
                                                                />
                                                            </>
                                                        )}

                                                    <SelectInput
                                                        InputName={'Account Code'}
                                                        Id={'detail_id'}
                                                        Name={'detail_id'}
                                                        Error={editErrors.detail_id}
                                                        Value={editData.detail_id}
                                                        items={account_details}
                                                        itemKey={'name'}
                                                        Required={true}
                                                        Action={(value) =>
                                                            setEditData('detail_id', value)
                                                        }
                                                    />

                                                    <SelectInput
                                                        InputName={'Currency'}
                                                        Id={'currency_id'}
                                                        Name={'currency_id'}
                                                        Error={editErrors.currency_id}
                                                        Value={editData.currency_id}
                                                        items={currencies}
                                                        itemKey={'name'}
                                                        Required={true}
                                                        Action={(value) => {
                                                            initialCurrencyId.current = value;
                                                            setEditData('currency_id', value);
                                                        }}
                                                    />

                                                    <Input
                                                        InputName={'Amount'}
                                                        Id={'amount'}
                                                        Name={'amount'}
                                                        Type={'number'}
                                                        Placeholder={'Enter Amount'}
                                                        Required={true}
                                                        Error={editErrors.amount}
                                                        Value={editData.amount}
                                                        onKeyDown={(e) => {
                                                            if (
                                                                ['e', 'E', '+', '-'].includes(e.key)
                                                            ) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        Action={(e) => {
                                                            const value = e.target.value;
                                                            setEditData('amount', value);
                                                        }}
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
                                                        Disabled={exchangeRateDisabled}
                                                        onKeyDown={(e) => {
                                                            if (
                                                                ['e', 'E', '+', '-'].includes(e.key)
                                                            ) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        Action={(e) => {
                                                            const value = e.target.value;
                                                            setEditData('exchange_rate', value);
                                                        }}
                                                    />

                                                    <Input
                                                        InputName={'Amount PAID'}
                                                        Id={'total_amount'}
                                                        Name={'total_amount'}
                                                        Type={'number'}
                                                        Required={false}
                                                        Error={editErrors.total_amount}
                                                        Value={editData.total_amount}
                                                        Placeholder={'Amount PAID'}
                                                        readOnly={true}
                                                    />
                                                </div>

                                                {/* Buttons */}
                                                <div className="flex items-center justify-center col-span-2 gap-4 mt-4">
                                                    <PrimaryButton
                                                        Action={() => {
                                                            setEditModalOpen(false);
                                                            setEditData('id', '');
                                                            setEditData('payment_date', '');
                                                            setEditData('paid_to', '');
                                                            setEditData('payment_details', '');
                                                            setEditData('payment_by', '');
                                                            setEditData('bank_details', {
                                                                bank_id: '',
                                                                cheque_no: '',
                                                                cheque_date: '',
                                                            });
                                                            setEditData('cash_details', {
                                                                chequebook_id: '',
                                                            });
                                                            setEditData('detail_id', '');
                                                            setEditData('currency_id', '');
                                                            setEditData('amount', '');
                                                            setEditData('exchange_rate', '');
                                                            setEditData('total_amount', '');
                                                        }}
                                                        Disabled={editProcessing}
                                                        Icon={
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="w-5 h-5"
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
                                                            'bg-red-500 hover:bg-red-600 w-full'
                                                        }
                                                    />

                                                    <PrimaryButton
                                                        Type="submit"
                                                        Text="Update Payment Voucher"
                                                        Spinner={editProcessing}
                                                        Disabled={
                                                            editProcessing ||
                                                            editData.payment_date === '' ||
                                                            editData.payment_by === '' ||
                                                            editData.detail_id === '' ||
                                                            editData.currency_id === '' ||
                                                            editData.amount === '' ||
                                                            editData.exchange_rate === '' ||
                                                            (editData.payment_by === 'bank' &&
                                                                editData?.bank_details?.bank_id ===
                                                                    '') ||
                                                            (editData.payment_by === 'cash' &&
                                                                editData?.cash_details
                                                                    ?.chequebook_id === '')
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
                            </div>
                        </>
                    }
                />

                {viewModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto sm:p-6">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 backdrop-blur-[32px]"
                            onClick={() => setViewModalOpen(false)}
                        ></div>

                        {/* Modal content */}
                        <div className="relative z-10 w-full max-h-screen p-6 overflow-y-auto bg-white shadow-xl max-w-screen-2xl rounded-2xl dark:bg-gray-800 sm:p-8">
                            <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                                View Payment Voucher
                            </h3>

                            {/* Divider */}
                            <div className="mb-6 border-b border-gray-200 dark:border-gray-700"></div>
                            {/* <div className="flex items-center justify-end">
                                <PrimaryButton
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
                                                d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
                                            />
                                        </svg>
                                    }
                                    Type={'button'}
                                    Action={() => {}}
                                    CustomClass={'w-[100px]'}
                                />
                            </div> */}

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Payment No
                                    </label>
                                    <div className="px-4 py-2 text-gray-800 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-white">
                                        <p className="break-words">
                                            {viewData?.payment_no || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Payment Date
                                    </label>
                                    <div className="px-4 py-2 text-gray-800 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-white">
                                        <p className="break-words">
                                            {viewData?.payment_date || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Paid To
                                    </label>
                                    <div className="px-4 py-2 text-gray-800 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-white">
                                        <p className="break-words">{viewData?.paid_to || 'N/A'}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Account Code
                                    </label>
                                    <div className="px-4 py-2 text-gray-800 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-white">
                                        <p className="break-words">
                                            {viewData?.account_detail?.account_code || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Payment Details
                                    </label>
                                    <div className="px-4 py-2 text-gray-800 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-white">
                                        <p className="break-words">
                                            {viewData?.payment_details || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Payment By
                                    </label>
                                    <div className="px-4 py-2 text-gray-800 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-white">
                                        <p className="break-words">
                                            {viewData?.payment_by || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {viewData.payment_by === 'bank' && (
                                    <>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Bank Name
                                            </label>
                                            <div className="px-4 py-2 text-gray-800 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-white">
                                                <p className="break-words">
                                                    {viewData?.formated_bank_details?.bank_name ||
                                                        'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Cheque No
                                            </label>
                                            <div className="px-4 py-2 text-gray-800 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-white">
                                                <p className="break-words">
                                                    {viewData?.formated_bank_details?.cheque_no ||
                                                        'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Cheque Date
                                            </label>
                                            <div className="px-4 py-2 text-gray-800 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-white">
                                                <p className="break-words">
                                                    {viewData?.formated_bank_details?.cheque_date ||
                                                        'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {viewData.payment_by === 'cash' && (
                                    <>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Cheque Book Name
                                            </label>
                                            <div className="px-4 py-2 text-gray-800 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-white">
                                                <p className="break-words">
                                                    {viewData?.formated_cash_details
                                                        ?.chequebook_name || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Currency
                                    </label>
                                    <div className="px-4 py-2 text-gray-800 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-white">
                                        <p className="break-words">
                                            {viewData?.currency?.name || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Amount
                                    </label>
                                    <div className="px-4 py-2 text-gray-800 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-white">
                                        <p className="break-words">{viewData?.amount || 'N/A'}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Exchange Rate
                                    </label>
                                    <div className="px-4 py-2 text-gray-800 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-white">
                                        <p className="break-words">
                                            {viewData?.exchange_rate || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Amount PAID
                                    </label>
                                    <div className="px-4 py-2 text-gray-800 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-white">
                                        <p className="break-words">
                                            {viewData?.total_amount || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col-reverse items-center justify-end gap-4 mt-8 sm:flex-row">
                                <PrimaryButton
                                    Action={() => {
                                        setViewModalOpen(false);
                                        setViewData(null);
                                    }}
                                    Icon={
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5"
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
                                    Text="Edit Voucher"
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
            </AuthenticatedLayout>
        </>
    );
}
