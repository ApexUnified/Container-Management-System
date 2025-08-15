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

export default function index({
    stock_ins,
    vendors,
    products,
    units,
    transporters,
    custom_clearances,
    shipping_lines,
    currencies,
    cros,
}) {
    const { props } = usePage();

    const [searchErrors, setSearchErrors] = useState({});

    useEffect(() => {
        const errors = props.errors;

        if (errors.container_no || errors.entry_date || errors.s_cro_no) {
            setSearchErrors({
                container_no: errors?.container_no ?? '',
                entry_date: errors?.entry_date ?? '',
                cro_no: errors?.s_cro_no ?? '',
            });
        }

        const timeout = setTimeout(() => {
            setSearchErrors({});
        }, 3000);

        return () => clearTimeout(timeout);
    }, [props.errors.container_no, props.errors.entry_date, props.errors.s_cro_no]);

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
        entry_date: '',
        container_no: '',
        vehicle_no: '',
        cro_id: '',
        port_location: '',
        vendor_id: '',
        product_id: '',
        product_weight: 0,
        product_unit_id: '',
        product_weight_in_man: 0,
        product_no_of_bundles: '',
        product_rate: 0,
        product_total_amount: 0,
        transporter_id: '',
        transporter_rate: 0,
        custom_clearance_id: '',
        custom_clearance_rate: 0,
        shipping_line_id: '',
        shipping_line_rate: 0,
        fc_amount: 0,
        exchange_rate: 0,
        currency_id: '',
        all_in_one: false,
        total_amount: 0,
        note: '',
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
        entry_date: '',
        container_no: '',
        vehicle_no: '',
        cro_id: '',
        port_location: '',
        vendor_id: '',
        product_id: '',
        product_weight: 0,
        product_unit_id: '',
        product_weight_in_man: 0,
        product_no_of_bundles: '',
        product_rate: 0,
        product_total_amount: 0,
        transporter_id: '',
        transporter_rate: 0,
        custom_clearance_id: '',
        custom_clearance_rate: 0,
        shipping_line_id: '',
        shipping_line_rate: 0,
        fc_amount: 0,
        exchange_rate: 0,
        currency_id: '',
        all_in_one: false,
        total_amount: 0,
        note: '',
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

    // View CRO Model State
    const [viewCroModalOpen, setViewCroModalOpen] = useState(false);

    // View CRO Model Data
    const [viewCroData, setViewCroData] = useState(null);

    // Flatpicker Ref
    const flatpickerForCreateForm = useRef(null);
    const flatpickerForEditForm = useRef(null);
    const flatpickerForEntryDateSearch = useRef(null);

    const [container_no, setContainerNo] = useState(props.container_no ?? '');
    const [entry_date, setEntryDate] = useState(props.entry_date ?? '');
    const [s_cro_no, setSCroNo] = useState(props.s_cro_no ?? '');
    const [parent_searched, setParentSearched] = useState(false);

    // flatpicker init useEffect
    useEffect(() => {
        setTimeout(() => {
            if (flatpickerForCreateForm.current) {
                flatpickr(flatpickerForCreateForm.current, {
                    dateFormat: 'Y-m-d',
                    disableMobile: true,
                    onChange: function (selectedDates, dateStr) {
                        if (selectedDates[0]) {
                            setCreateData('entry_date', dateStr);
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
                            setEditData('entry_date', dateStr);
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
                    mode: 'range',
                    dateFormat: 'Y-m-d',
                    disableMobile: true,
                    onChange: function (selectedDates, dateStr) {
                        if (selectedDates.length === 2) {
                            const fromDate = this.formatDate(selectedDates[0], 'Y-m-d');
                            const toDate = this.formatDate(selectedDates[1], 'Y-m-d');
                            setEntryDate(`${fromDate} to ${toDate}`);
                        } else if (selectedDates.length === 1) {
                            setEntryDate('');
                        } else {
                            setEntryDate('');
                        }
                    },
                });
            }
        }, 500);
    }, []);

    // Create Data Changes Tracker
    // Calculating Weight In Man If Weight Is Not Empty Or Null
    useEffect(() => {
        if (createData.product_weight !== null && createData.product_weight !== '') {
            const weight = Number(createData.product_weight);
            setCreateData('product_weight_in_man', weight / 40);
        } else {
            setCreateData('product_weight_in_man', 0);
        }
    }, [createData.product_weight]);

    const calculateCreateTotalAmount = () => {
        const productTotal = Number(createData.product_total_amount) || 0;
        const shippingLine = Number(createData.shipping_line_rate) || 0;

        const transporterRate = createData.all_in_one
            ? 0
            : Number(createData.transporter_rate) || 0;
        const clearanceRate = createData.all_in_one
            ? 0
            : Number(createData.custom_clearance_rate) || 0;

        const total = productTotal + shippingLine + transporterRate + clearanceRate;
        setCreateData('total_amount', total);
    };

    // Product total:
    useEffect(() => {
        const man = Number(createData.product_weight_in_man);
        const rate = Number(createData.product_rate);

        if (!isNaN(man) && !isNaN(rate)) {
            const total = man * rate;
            setCreateData('product_total_amount', total);
        } else {
            setCreateData('product_total_amount', 0);
        }
    }, [createData.product_weight_in_man, createData.product_rate]);

    // Shipping line rate:
    useEffect(() => {
        const exchangeRate = Number(createData.exchange_rate);
        const fcAmount = Number(createData.fc_amount);

        if (createData.currency_id && !isNaN(exchangeRate) && !isNaN(fcAmount)) {
            setCreateData('shipping_line_rate', exchangeRate * fcAmount);
        } else {
            setCreateData('shipping_line_rate', 0);
        }
    }, [createData.currency_id, createData.exchange_rate, createData.fc_amount]);

    // All-in-one effect (resets rates):
    useEffect(() => {
        if (createData.all_in_one) {
            setCreateData('transporter_id', '');
            setCreateData('transporter_rate', 0);
            setCreateData('custom_clearance_id', '');
            setCreateData('custom_clearance_rate', 0);
        }
    }, [createData.all_in_one]);

    // Recalculate total when any amount-related value changes
    useEffect(() => {
        calculateCreateTotalAmount();
    }, [
        createData.product_total_amount,
        createData.shipping_line_rate,
        createData.transporter_rate,
        createData.custom_clearance_rate,
        createData.all_in_one,
    ]);
    // Create Data Changes Tracker

    // divider

    // Edit Data Changes Tracker
    // Calculating Weight In Man If Weight Is Not Empty Or Null
    useEffect(() => {
        if (editData.product_weight !== null && editData.product_weight !== '') {
            const weight = Number(editData.product_weight);
            setEditData('product_weight_in_man', weight / 40);
        } else {
            setEditData('product_weight_in_man', 0);
        }
    }, [editData.product_weight]);

    const calculateEditTotalAmount = () => {
        const productTotal = Number(editData.product_total_amount) || 0;
        const shippingLine = Number(editData.shipping_line_rate) || 0;

        const transporterRate = editData.all_in_one ? 0 : Number(editData.transporter_rate) || 0;
        const clearanceRate = editData.all_in_one ? 0 : Number(editData.custom_clearance_rate) || 0;

        const total = productTotal + shippingLine + transporterRate + clearanceRate;
        setEditData('total_amount', total);
    };

    // Product total:
    useEffect(() => {
        const man = Number(editData.product_weight_in_man);
        const rate = Number(editData.product_rate);

        if (!isNaN(man) && !isNaN(rate)) {
            const total = man * rate;
            setEditData('product_total_amount', total);
        } else {
            setEditData('product_total_amount', 0);
        }
    }, [editData.product_weight_in_man, editData.product_rate]);

    // Shipping line rate:
    useEffect(() => {
        const exchangeRate = Number(editData.exchange_rate);
        const fcAmount = Number(editData.fc_amount);

        if (editData.currency_id && !isNaN(exchangeRate) && !isNaN(fcAmount)) {
            setEditData('shipping_line_rate', exchangeRate * fcAmount);
        } else {
            setEditData('shipping_line_rate', 0);
        }
    }, [editData.currency_id, editData.exchange_rate, editData.fc_amount]);

    // All-in-one effect (resets rates):
    useEffect(() => {
        if (editData.all_in_one) {
            setEditData('transporter_id', '');
            setEditData('transporter_rate', 0);
            setEditData('custom_clearance_id', '');
            setEditData('custom_clearance_rate', 0);
        }
    }, [editData.all_in_one]);

    // Recalculate total when any amount-related value changes
    useEffect(() => {
        calculateEditTotalAmount();
    }, [
        editData.product_total_amount,
        editData.shipping_line_rate,
        editData.transporter_rate,
        editData.custom_clearance_rate,
        editData.all_in_one,
    ]);
    // Edit Data Changes Tracker

    const [selectedCroId, setSelectedCroId] = useState(null);
    useEffect(() => {
        if (selectedCroId && cros.length) {
            const updated = cros.find((cro) => cro.id === selectedCroId);
            if (updated) {
                setViewCroData(updated);
                setViewCroModalOpen(true);
                setSelectedCroId(null);
            }
        }
    }, [cros]);

    // Columns
    useEffect(() => {
        const columns = [
            {
                label: 'Container No',
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
                                {item.container_no}
                            </p>
                        </div>
                    );
                },
            },
            { key: 'entry_date', label: 'Entry Date' },
            { key: 'vehicle_no', label: 'Vehicle No' },
            {
                label: 'CRO No',
                render: (item) => {
                    return (
                        <div
                            className="cursor-pointer"
                            onClick={() => {
                                setSelectedCroId(item.cro_id);
                                router.reload({ only: ['cros'] });
                            }}
                        >
                            <p className="text-sm font-semibold text-blue-500 underline">
                                {item?.cro?.cro_no}
                            </p>
                        </div>
                    );
                },
            },
            { key: 'port_location', label: 'Port Location' },
            { key: 'vendor.name', label: 'Vendor Name' },
            { key: 'product.name', label: 'Product Name' },
            { key: 'unit.name', label: 'Product Unit' },
            { key: 'product_weight', label: 'Product Weight' },
            { key: 'product_weight_in_man', label: 'Product Weight (Mann)' },
            { key: 'product_rate', label: 'Product Rate' },
            { key: 'product_total_amount', label: 'Product Total Amount' },
            {
                label: 'All in One Package',
                render: (item) => {
                    if (item.all_in_one) {
                        return <span className="rounded-lg bg-blue-500 p-2 text-white">Yes</span>;
                    }

                    return <span className="rounded-lg bg-red-500 p-2 text-white">No</span>;
                },
            },
        ];

        const actions = [
            {
                label: 'View',
                type: 'button',
                onClick: (item) => {
                    setViewModalOpen(true);
                    setViewData(item);
                },
            },

            {
                label: 'Edit',
                type: 'button',
                onClick: (item) => {
                    setEditModalOpen(true);
                    setEditData(item);
                },
            },
        ];

        setCustomActions(actions);
        setColumns(columns);
    }, []);

    // CreateMethod
    const CreateMethod = (e) => {
        e.preventDefault();

        createPost(route('transactions.stock-in.store'), {
            onSuccess: () => {
                setCreateData('entry_date', '');
                setCreateData('container_no', '');
                setCreateData('vehicle_no', '');

                setCreateData('product_weight', '');

                setCreateData('product_weight_in_man', '');
                setCreateData('product_no_of_bundles', '');
                setCreateData('product_rate', '');
                setCreateData('product_total_amount', '');

                setCreateData('transporter_rate', '');

                setCreateData('custom_clearance_rate', '');

                setCreateData('shipping_line_rate', '');
                setCreateData('fc_amount', '');
                setCreateData('exchange_rate', '');

                setCreateData('all_in_one', false);
                setCreateData('total_amount', '');
                setCreateData('note', '');
            },
        });
    };

    // EditMethod
    const EditMethod = (e) => {
        e.preventDefault();
        editPut(route('transactions.stock-in.update', editData.id), {
            onSuccess: () => {
                setEditModalOpen(false);
                setEditData('id', '');
                setEditData('entry_date', '');
                setEditData('container_no', '');
                setEditData('vehicle_no', '');
                setEditData('cro_id', '');
                setEditData('port_location', '');
                setEditData('vendor_id', '');
                setEditData('product_id', '');
                setEditData('product_weight', '');
                setEditData('product_unit_id', '');
                setEditData('product_weight_in_man', '');
                setEditData('product_no_of_bundles', '');
                setEditData('product_rate', '');
                setEditData('product_total_amount', '');
                setEditData('transporter_id', '');
                setEditData('transporter_rate', '');
                setEditData('custom_clearance_id', '');
                setEditData('custom_clearance_rate', '');
                setEditData('shipping_line_id', '');
                setEditData('shipping_line_rate', '');
                setEditData('fc_amount', '');
                setEditData('exchange_rate', '');
                setEditData('currency_id', '');
                setEditData('all_in_one', false);
                setEditData('total_amount', '');
                setEditData('note', '');
            },
        });
    };

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Transactions - Stock In" />

                <BreadCrumb
                    header={'Transactions - Stock In'}
                    parent={'Dashboard'}
                    parent_link={route('dashboard')}
                    child={'Transactions - Stock In'}
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
                                    Text={'Create Stock In'}
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
                                BulkDeleteRoute={'transactions.stock-in.destroybyselection'}
                                SingleDeleteRoute={'transactions.stock-in.destroy'}
                                SearchRoute={'transactions.stock-in.index'}
                                items={stock_ins}
                                props={props}
                                columns={columns}
                                Search={true}
                                customActions={customActions}
                                ParentSearched={parent_searched}
                                DefaultSearchInput={false}
                                searchProps={{
                                    entry_date: entry_date,
                                    container_no: container_no,
                                    s_cro_no: s_cro_no,
                                }}
                                customSearch={
                                    <>
                                        <div className="relative">
                                            <Input
                                                InputName={'Entry Date'}
                                                InputRef={flatpickerForEntryDateSearch}
                                                Id={'entry_date'}
                                                Name={'entry_date'}
                                                Type={'text'}
                                                Value={entry_date}
                                                Placeholder={'Add Entry Date To Search'}
                                            />
                                        </div>

                                        <div className="relative">
                                            <Input
                                                InputName={'Container No'}
                                                Id={'container_no'}
                                                Name={'container_no'}
                                                Type={'text'}
                                                Value={container_no}
                                                Placeholder={'Add Container No To Search'}
                                                Action={(e) => {
                                                    const value = e.target.value;
                                                    setContainerNo(value);
                                                }}
                                            />
                                        </div>

                                        <div className="relative">
                                            <Input
                                                InputName={'CRO No'}
                                                Id={'search_cro_no'}
                                                Name={'search_cro_no'}
                                                Type={'text'}
                                                Value={s_cro_no}
                                                Placeholder={'Add CRO No To Search Containers'}
                                                Action={(e) => {
                                                    const value = e.target.value;
                                                    setSCroNo(value);
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
                                                        Create Stock In
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

                                                <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-5">
                                                    <Input
                                                        InputName={'Entry Date'}
                                                        InputRef={flatpickerForCreateForm}
                                                        Id={'entry_date'}
                                                        Name={'entry_date'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Entry Date'}
                                                        Required={true}
                                                        Error={createErrors.entry_date}
                                                        Value={createData.entry_date}
                                                        Action={(e) =>
                                                            setCreateData(
                                                                'entry_date',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Container No'}
                                                        Id={'container_no'}
                                                        Name={'container_no'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Container No'}
                                                        Required={true}
                                                        Error={createErrors.container_no}
                                                        Value={createData.container_no}
                                                        Action={(e) =>
                                                            setCreateData(
                                                                'container_no',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Vehicle No'}
                                                        Id={'vehicle_no'}
                                                        Name={'vehicle_no'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Vehicle No'}
                                                        Required={false}
                                                        Error={createErrors.vehicle_no}
                                                        Value={createData.vehicle_no}
                                                        Action={(e) =>
                                                            setCreateData(
                                                                'vehicle_no',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />

                                                    <SelectInput
                                                        InputName={'CRO No'}
                                                        Id={'cro_id'}
                                                        Name={'cro_id'}
                                                        items={cros}
                                                        itemKey={'cro_no'}
                                                        Required={true}
                                                        Error={createErrors.cro_id}
                                                        Value={createData.cro_id}
                                                        Action={(value) =>
                                                            setCreateData('cro_id', value)
                                                        }
                                                    />

                                                    <SelectInput
                                                        InputName={'Port Location'}
                                                        Id={'port_location'}
                                                        Name={'port_location'}
                                                        items={[{ name: 'KTGL' }, { name: 'KICT' }]}
                                                        itemKey={'name'}
                                                        Required={true}
                                                        Error={createErrors.port_location}
                                                        Value={createData.port_location}
                                                        Action={(value) =>
                                                            setCreateData('port_location', value)
                                                        }
                                                    />

                                                    <SelectInput
                                                        InputName={'Vendor'}
                                                        Id={'vendor_id'}
                                                        Name={'vendor_id'}
                                                        items={vendors}
                                                        itemKey={'name'}
                                                        Required={true}
                                                        Error={createErrors.vendor_id}
                                                        Value={createData.vendor_id}
                                                        Action={(value) =>
                                                            setCreateData('vendor_id', value)
                                                        }
                                                    />

                                                    <SelectInput
                                                        InputName={'Product'}
                                                        Id={'product_id'}
                                                        Name={'product_id'}
                                                        items={products}
                                                        itemKey={'name'}
                                                        Required={true}
                                                        Error={createErrors.product_id}
                                                        Value={createData.product_id}
                                                        Action={(value) =>
                                                            setCreateData('product_id', value)
                                                        }
                                                    />

                                                    <SelectInput
                                                        InputName={'Product Unit'}
                                                        Id={'product_unit_id'}
                                                        Name={'product_unit_id'}
                                                        items={units}
                                                        itemKey={'name'}
                                                        Required={true}
                                                        Error={createErrors.product_unit_id}
                                                        Value={createData.product_unit_id}
                                                        Action={(value) => {
                                                            setCreateData('product_unit_id', value);
                                                        }}
                                                    />

                                                    <Input
                                                        InputName={'Product Weight'}
                                                        Id={'product_weight'}
                                                        Name={'product_weight'}
                                                        Type={'number'}
                                                        Placeholder={'Enter Product Weight'}
                                                        Required={true}
                                                        Error={createErrors.product_weight}
                                                        Value={createData.product_weight}
                                                        Action={(e) => {
                                                            setCreateData(
                                                                'product_weight',
                                                                e.target.value,
                                                            );
                                                        }}
                                                    />
                                                    <Input
                                                        InputName={'Product Weight In Mann'}
                                                        Id={'product_weight_in_man'}
                                                        Name={'product_weight_in_man'}
                                                        Type={'number'}
                                                        Placeholder={'Product Weight in Mann'}
                                                        CustomCss={'pointer-events-none'}
                                                        Required={true}
                                                        Error={createErrors.product_weight_in_man}
                                                        Value={createData.product_weight_in_man}
                                                        readOnly={true}
                                                    />

                                                    <Input
                                                        InputName={'Product No Of Bundles'}
                                                        Id={'product_no_of_bundles'}
                                                        Name={'product_no_of_bundles'}
                                                        Type={'number'}
                                                        Placeholder={'Enter No Of Bundles'}
                                                        Required={true}
                                                        Error={createErrors.product_no_of_bundles}
                                                        Value={createData.product_no_of_bundles}
                                                        Action={(e) => {
                                                            setCreateData(
                                                                'product_no_of_bundles',
                                                                e.target.value,
                                                            );
                                                        }}
                                                    />

                                                    <Input
                                                        InputName={'Product Rate'}
                                                        Id={'product_rate'}
                                                        Name={'product_rate'}
                                                        Type={'number'}
                                                        Placeholder={'Enter Product Rate'}
                                                        Required={true}
                                                        Error={createErrors.product_rate}
                                                        Value={createData.product_rate}
                                                        Action={(e) => {
                                                            setCreateData(
                                                                'product_rate',
                                                                e.target.value,
                                                            );
                                                        }}
                                                    />

                                                    <Input
                                                        InputName={'Product Total Amount'}
                                                        Id={'product_total_amount'}
                                                        Name={'product_total_amount'}
                                                        Type={'number'}
                                                        Placeholder={'Product Total Amount'}
                                                        CustomCss={'pointer-events-none'}
                                                        Required={true}
                                                        Error={createErrors.product_total_amount}
                                                        Value={createData.product_total_amount}
                                                        readOnly={true}
                                                    />

                                                    <Input
                                                        InputName={'Note'}
                                                        Id={'note'}
                                                        Name={'note'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Note'}
                                                        Required={false}
                                                        Error={createErrors.note}
                                                        Value={createData.note}
                                                        Action={(e) => {
                                                            setCreateData('note', e.target.value);
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-span-2 grid grid-cols-1 justify-items-end gap-4 md:grid-cols-1">
                                                    <div className="me-4">
                                                        <label
                                                            htmlFor="all_in_one"
                                                            className="me-2 cursor-pointer text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            All in One
                                                        </label>
                                                        <input
                                                            onChange={() =>
                                                                setCreateData(
                                                                    'all_in_one',
                                                                    !createData.all_in_one,
                                                                )
                                                            }
                                                            type="checkbox"
                                                            id="all_in_one"
                                                            value=""
                                                            className="mx-2 h-6 w-6 cursor-pointer rounded-lg border-slate-300 bg-slate-50 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-white"
                                                            checked={createData.all_in_one}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-4">
                                                    <SelectInput
                                                        InputName={'Transporter'}
                                                        Id={'transporter_id'}
                                                        Name={'transporter_id'}
                                                        items={transporters}
                                                        itemKey={'name'}
                                                        Required={
                                                            createData.all_in_one ? false : true
                                                        }
                                                        Error={createErrors.transporter_id}
                                                        Value={createData.transporter_id}
                                                        isDisabled={createData.all_in_one}
                                                        Action={(value) =>
                                                            setCreateData('transporter_id', value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Amount'}
                                                        Id={'transporter_rate'}
                                                        Name={'transporter_rate'}
                                                        Type={'number'}
                                                        Placeholder={'Enter Transporter Amount'}
                                                        Required={
                                                            createData.all_in_one ? false : true
                                                        }
                                                        Disabled={createData.all_in_one}
                                                        Error={createErrors.transporter_rate}
                                                        Value={createData.transporter_rate}
                                                        readOnly={
                                                            createData.all_in_one ||
                                                            createData.transporter_id == ''
                                                        }
                                                        Action={(e) => {
                                                            setCreateData(
                                                                'transporter_rate',
                                                                e.target.value,
                                                            );
                                                        }}
                                                    />

                                                    <SelectInput
                                                        InputName={'Custom Clearance'}
                                                        Id={'custom_clearance_id'}
                                                        Name={'custom_clearance_id'}
                                                        items={custom_clearances}
                                                        itemKey={'name'}
                                                        Required={
                                                            createData.all_in_one ? false : true
                                                        }
                                                        Error={createErrors.custom_clearance_id}
                                                        Value={createData.custom_clearance_id}
                                                        isDisabled={createData.all_in_one}
                                                        Action={(value) =>
                                                            setCreateData(
                                                                'custom_clearance_id',
                                                                value,
                                                            )
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Amount'}
                                                        Id={'custom_clearance_rate'}
                                                        Name={'custom_clearance_rate'}
                                                        Type={'number'}
                                                        Placeholder={
                                                            'Enter Custom Clearance Amount'
                                                        }
                                                        Required={
                                                            createData.all_in_one ? false : true
                                                        }
                                                        Disabled={createData.all_in_one}
                                                        Error={createErrors.custom_clearance_rate}
                                                        Value={createData.custom_clearance_rate}
                                                        readOnly={
                                                            createData.all_in_one ||
                                                            createData.custom_clearance_id == ''
                                                        }
                                                        Action={(e) => {
                                                            setCreateData(
                                                                'custom_clearance_rate',
                                                                e.target.value,
                                                            );
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-3">
                                                    <SelectInput
                                                        InputName={'Shipping Line'}
                                                        Id={'shipping_line_id'}
                                                        Name={'shipping_line_id'}
                                                        items={shipping_lines}
                                                        itemKey={'name'}
                                                        Required={true}
                                                        Error={createErrors.shipping_line_id}
                                                        Value={createData.shipping_line_id}
                                                        Action={(value) =>
                                                            setCreateData('shipping_line_id', value)
                                                        }
                                                    />

                                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2">
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
                                                            InputName={'F/C Amount'}
                                                            Id={'fc_amount'}
                                                            Name={'fc_amount'}
                                                            Type={'number'}
                                                            Placeholder={'Enter F/C Amount'}
                                                            Required={true}
                                                            Error={createErrors.fc_amount}
                                                            Value={createData.fc_amount}
                                                            Action={(e) =>
                                                                setCreateData(
                                                                    'fc_amount',
                                                                    e.target.value,
                                                                )
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

                                                    <Input
                                                        InputName={'Amount'}
                                                        Id={'shipping_line_rate'}
                                                        Name={'shipping_line_rate'}
                                                        Type={'number'}
                                                        Placeholder={'Shipping Line Amount'}
                                                        Required={true}
                                                        Error={createErrors.shipping_line_rate}
                                                        Value={createData.shipping_line_rate}
                                                        readOnly={true}
                                                    />
                                                </div>

                                                <div className="col-span-2 grid grid-cols-1 justify-items-end gap-4 md:grid-cols-1">
                                                    <div className="me-4">
                                                        <p className="text-2xl font-semibold dark:text-white/85">
                                                            Total Amount: {createData.total_amount}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Buttons */}
                                                <div className="col-span-2 mt-4 flex items-center justify-center gap-4">
                                                    <PrimaryButton
                                                        Action={() => {
                                                            setCreateModalOpen(false);
                                                            setCreateData('entry_date', '');
                                                            setCreateData('container_no', '');
                                                            setCreateData('vehicle_no', '');
                                                            setCreateData('cro_id', '');
                                                            setCreateData('port_location', '');
                                                            setCreateData('vendor_id', '');
                                                            setCreateData('product_id', '');
                                                            setCreateData('product_weight', '');
                                                            setCreateData('product_unit_id', '');
                                                            setCreateData(
                                                                'product_weight_in_man',
                                                                '',
                                                            );
                                                            setCreateData(
                                                                'product_no_of_bundles',
                                                                '',
                                                            );
                                                            setCreateData('product_rate', '');
                                                            setCreateData(
                                                                'product_total_amount',
                                                                '',
                                                            );
                                                            setCreateData('transporter_id', '');
                                                            setCreateData('transporter_rate', '');
                                                            setCreateData(
                                                                'custom_clearance_id',
                                                                '',
                                                            );
                                                            setCreateData(
                                                                'custom_clearance_rate',
                                                                '',
                                                            );
                                                            setCreateData('shipping_line_id', '');
                                                            setCreateData('shipping_line_rate', '');
                                                            setCreateData('fc_amount', '');
                                                            setCreateData('exchange_rate', '');
                                                            setCreateData('currency_id', '');
                                                            setCreateData('all_in_one', false);
                                                            setCreateData('total_amount', '');
                                                            setCreateData('note', '');
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
                                                        Text="Save Stock In"
                                                        Spinner={createProcessing}
                                                        Disabled={
                                                            createProcessing ||
                                                            createData.entry_date == '' ||
                                                            createData.container_no.trim() == '' ||
                                                            createData.cro_id == '' ||
                                                            createData.port_location == '' ||
                                                            createData.vendor_id == '' ||
                                                            createData.product_id == '' ||
                                                            createData.product_weight == '' ||
                                                            createData.product_unit_id == '' ||
                                                            createData.product_no_of_bundles ==
                                                                '' ||
                                                            createData.product_rate == '' ||
                                                            createData.product_total_amount == '' ||
                                                            (!createData.all_in_one &&
                                                                (createData.transporter_id == '' ||
                                                                    createData.transporter_rate ==
                                                                        '' ||
                                                                    createData.custom_clearance_id ==
                                                                        '' ||
                                                                    createData.custom_clearance_rate ==
                                                                        '')) ||
                                                            createData.shipping_line_id == '' ||
                                                            createData.shipping_line_rate == '' ||
                                                            createData.fc_amount == '' ||
                                                            createData.exchange_rate == '' ||
                                                            createData.currency_id == ''
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
                                                        Edit Stock In
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

                                                <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-5">
                                                    <Input
                                                        InputName={'Entry Date'}
                                                        InputRef={flatpickerForEditForm}
                                                        Id={'entry_date'}
                                                        Name={'entry_date'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Entry Date'}
                                                        Required={true}
                                                        Error={editErrors.entry_date}
                                                        Value={editData.entry_date}
                                                        Action={(e) =>
                                                            setEditData(
                                                                'entry_date',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Container No'}
                                                        Id={'container_no'}
                                                        Name={'container_no'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Container No'}
                                                        Required={true}
                                                        Error={editErrors.container_no}
                                                        Value={editData.container_no}
                                                        Action={(e) =>
                                                            setEditData(
                                                                'container_no',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Vehicle No'}
                                                        Id={'vehicle_no'}
                                                        Name={'vehicle_no'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Vehicle No'}
                                                        Required={false}
                                                        Error={editErrors.vehicle_no}
                                                        Value={editData.vehicle_no}
                                                        Action={(e) =>
                                                            setEditData(
                                                                'vehicle_no',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />

                                                    <SelectInput
                                                        InputName={'CRO No'}
                                                        Id={'cro_id'}
                                                        Name={'cro_id'}
                                                        items={cros}
                                                        itemKey={'cro_no'}
                                                        Required={true}
                                                        Error={editErrors.cro_id}
                                                        Value={editData.cro_id}
                                                        Action={(value) =>
                                                            setEditData('cro_id', value)
                                                        }
                                                    />

                                                    <SelectInput
                                                        InputName={'Port Location'}
                                                        Id={'port_location'}
                                                        Name={'port_location'}
                                                        items={[{ name: 'KTGL' }, { name: 'KICT' }]}
                                                        itemKey={'name'}
                                                        Required={true}
                                                        Error={editErrors.port_location}
                                                        Value={editData.port_location}
                                                        Action={(value) =>
                                                            setEditData('port_location', value)
                                                        }
                                                    />

                                                    <SelectInput
                                                        InputName={'Vendor'}
                                                        Id={'vendor_id'}
                                                        Name={'vendor_id'}
                                                        items={vendors}
                                                        itemKey={'name'}
                                                        Required={true}
                                                        Error={editErrors.vendor_id}
                                                        Value={editData.vendor_id}
                                                        Action={(value) =>
                                                            setEditData('vendor_id', value)
                                                        }
                                                    />

                                                    <SelectInput
                                                        InputName={'Product'}
                                                        Id={'product_id'}
                                                        Name={'product_id'}
                                                        items={products}
                                                        itemKey={'name'}
                                                        Required={true}
                                                        Error={editErrors.product_id}
                                                        Value={editData.product_id}
                                                        Action={(value) =>
                                                            setEditData('product_id', value)
                                                        }
                                                    />

                                                    <SelectInput
                                                        InputName={'Product Unit'}
                                                        Id={'product_unit_id'}
                                                        Name={'product_unit_id'}
                                                        items={units}
                                                        itemKey={'name'}
                                                        Required={true}
                                                        Error={editErrors.product_unit_id}
                                                        Value={editData.product_unit_id}
                                                        Action={(value) => {
                                                            setEditData('product_unit_id', value);
                                                        }}
                                                    />

                                                    <Input
                                                        InputName={'Product Weight'}
                                                        Id={'product_weight'}
                                                        Name={'product_weight'}
                                                        Type={'number'}
                                                        Placeholder={'Enter Product Weight'}
                                                        Required={true}
                                                        Error={editErrors.product_weight}
                                                        Value={editData.product_weight}
                                                        Action={(e) => {
                                                            setEditData(
                                                                'product_weight',
                                                                e.target.value,
                                                            );
                                                        }}
                                                    />
                                                    <Input
                                                        InputName={'Product Weight In Mann'}
                                                        Id={'product_weight_in_man'}
                                                        Name={'product_weight_in_man'}
                                                        Type={'number'}
                                                        Placeholder={'Product Weight in Mann'}
                                                        CustomCss={'pointer-events-none'}
                                                        Required={true}
                                                        Error={editErrors.product_weight_in_man}
                                                        Value={editData.product_weight_in_man}
                                                        readOnly={true}
                                                    />

                                                    <Input
                                                        InputName={'Product No Of Bundles'}
                                                        Id={'product_no_of_bundles'}
                                                        Name={'product_no_of_bundles'}
                                                        Type={'number'}
                                                        Placeholder={'Enter No Of Bundles'}
                                                        Required={true}
                                                        Error={editErrors.product_no_of_bundles}
                                                        Value={editData.product_no_of_bundles}
                                                        Action={(e) => {
                                                            setEditData(
                                                                'product_no_of_bundles',
                                                                e.target.value,
                                                            );
                                                        }}
                                                    />

                                                    <Input
                                                        InputName={'Product Rate'}
                                                        Id={'product_rate'}
                                                        Name={'product_rate'}
                                                        Type={'number'}
                                                        Placeholder={'Enter Product Rate'}
                                                        Required={true}
                                                        Error={editErrors.product_rate}
                                                        Value={editData.product_rate}
                                                        Action={(e) => {
                                                            setEditData(
                                                                'product_rate',
                                                                e.target.value,
                                                            );
                                                        }}
                                                    />

                                                    <Input
                                                        InputName={'Product Total Amount'}
                                                        Id={'product_total_amount'}
                                                        Name={'product_total_amount'}
                                                        Type={'number'}
                                                        Placeholder={'Product Total Amount'}
                                                        CustomCss={'pointer-events-none'}
                                                        Required={true}
                                                        Error={editErrors.product_total_amount}
                                                        Value={editData.product_total_amount}
                                                        readOnly={true}
                                                    />

                                                    <Input
                                                        InputName={'Note'}
                                                        Id={'note'}
                                                        Name={'note'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Note'}
                                                        Required={false}
                                                        Error={editErrors.note}
                                                        Value={editData.note}
                                                        Action={(e) => {
                                                            setEditData('note', e.target.value);
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-span-2 grid grid-cols-1 justify-items-end gap-4 md:grid-cols-1">
                                                    <div className="me-4">
                                                        <label
                                                            htmlFor="all_in_one"
                                                            className="me-2 cursor-pointer text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            All in One
                                                        </label>
                                                        <input
                                                            onChange={() =>
                                                                setEditData(
                                                                    'all_in_one',
                                                                    !editData.all_in_one,
                                                                )
                                                            }
                                                            type="checkbox"
                                                            id="all_in_one"
                                                            value=""
                                                            className="mx-2 h-6 w-6 cursor-pointer rounded-lg border-slate-300 bg-slate-50 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-white"
                                                            checked={editData.all_in_one}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-4">
                                                    <SelectInput
                                                        InputName={'Transporter'}
                                                        Id={'transporter_id'}
                                                        Name={'transporter_id'}
                                                        items={transporters}
                                                        itemKey={'name'}
                                                        Required={
                                                            editData.all_in_one ? false : true
                                                        }
                                                        Error={editErrors.transporter_id}
                                                        Value={editData.transporter_id}
                                                        isDisabled={editData.all_in_one}
                                                        Action={(value) =>
                                                            setEditData('transporter_id', value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Amount'}
                                                        Id={'transporter_rate'}
                                                        Name={'transporter_rate'}
                                                        Type={'number'}
                                                        Placeholder={'Enter Transporter Amount'}
                                                        Disabled={editData.all_in_one}
                                                        Required={
                                                            editData.all_in_one ? false : true
                                                        }
                                                        Error={editErrors.transporter_rate}
                                                        Value={editData.transporter_rate}
                                                        readOnly={
                                                            editData.all_in_one ||
                                                            editData.transporter_id == ''
                                                        }
                                                        Action={(e) => {
                                                            setEditData(
                                                                'transporter_rate',
                                                                e.target.value,
                                                            );
                                                        }}
                                                    />

                                                    <SelectInput
                                                        InputName={'Custom Clearance'}
                                                        Id={'custom_clearance_id'}
                                                        Name={'custom_clearance_id'}
                                                        items={custom_clearances}
                                                        itemKey={'name'}
                                                        Required={
                                                            editData.all_in_one ? false : true
                                                        }
                                                        Error={editErrors.custom_clearance_id}
                                                        Value={editData.custom_clearance_id}
                                                        isDisabled={editData.all_in_one}
                                                        Action={(value) =>
                                                            setEditData(
                                                                'custom_clearance_id',
                                                                value,
                                                            )
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Amount'}
                                                        Id={'custom_clearance_rate'}
                                                        Name={'custom_clearance_rate'}
                                                        Type={'number'}
                                                        Placeholder={
                                                            'Enter Custom Clearance Amount'
                                                        }
                                                        Disabled={editData.all_in_one}
                                                        Required={
                                                            editData.all_in_one ? false : true
                                                        }
                                                        Error={editErrors.custom_clearance_rate}
                                                        Value={editData.custom_clearance_rate}
                                                        readOnly={
                                                            editData.all_in_one ||
                                                            editData.custom_clearance_id == ''
                                                        }
                                                        Action={(e) => {
                                                            setEditData(
                                                                'custom_clearance_rate',
                                                                e.target.value,
                                                            );
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-3">
                                                    <SelectInput
                                                        InputName={'Shipping Line'}
                                                        Id={'shipping_line_id'}
                                                        Name={'shipping_line_id'}
                                                        items={shipping_lines}
                                                        itemKey={'name'}
                                                        Required={true}
                                                        Error={editErrors.shipping_line_id}
                                                        Value={editData.shipping_line_id}
                                                        Action={(value) =>
                                                            setEditData('shipping_line_id', value)
                                                        }
                                                    />

                                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2">
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
                                                            InputName={'F/C Amount'}
                                                            Id={'fc_amount'}
                                                            Name={'fc_amount'}
                                                            Type={'number'}
                                                            Placeholder={'Enter F/C Amount'}
                                                            Required={true}
                                                            Error={editErrors.fc_amount}
                                                            Value={editData.fc_amount}
                                                            Action={(e) =>
                                                                setEditData(
                                                                    'fc_amount',
                                                                    e.target.value,
                                                                )
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

                                                    <Input
                                                        InputName={'Amount'}
                                                        Id={'shipping_line_rate'}
                                                        Name={'shipping_line_rate'}
                                                        Type={'number'}
                                                        Placeholder={'Shipping Line Amount'}
                                                        Required={true}
                                                        Error={editErrors.shipping_line_rate}
                                                        Value={editData.shipping_line_rate}
                                                        readOnly={true}
                                                    />
                                                </div>

                                                <div className="col-span-2 grid grid-cols-1 justify-items-end gap-4 md:grid-cols-1">
                                                    <div className="me-4">
                                                        <p className="text-2xl font-semibold dark:text-white/85">
                                                            Total Amount: {editData.total_amount}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Buttons */}
                                                <div className="col-span-2 mt-4 flex items-center justify-center gap-4">
                                                    <PrimaryButton
                                                        Action={() => {
                                                            setEditModalOpen(false);
                                                            setEditData('entry_date', '');
                                                            setEditData('container_no', '');
                                                            setEditData('vehicle_no', '');
                                                            setEditData('cro_no', '');
                                                            setEditData('port_location', '');
                                                            setEditData('vendor_id', '');
                                                            setEditData('product_id', '');
                                                            setEditData('product_weight', '');
                                                            setEditData('product_unit_id', '');
                                                            setEditData(
                                                                'product_weight_in_man',
                                                                '',
                                                            );
                                                            setEditData(
                                                                'product_no_of_bundles',
                                                                '',
                                                            );
                                                            setEditData('product_rate', '');
                                                            setEditData('product_total_amount', '');
                                                            setEditData('transporter_id', '');
                                                            setEditData('transporter_rate', '');
                                                            setEditData('custom_clearance_id', '');
                                                            setEditData(
                                                                'custom_clearance_rate',
                                                                '',
                                                            );
                                                            setEditData('shipping_line_id', '');
                                                            setEditData('shipping_line_rate', '');
                                                            setEditData('fc_amount', '');
                                                            setEditData('exchange_rate', '');
                                                            setEditData('currency_id', '');
                                                            setEditData('all_in_one', false);
                                                            setEditData('total_amount', '');
                                                            setEditData('note', '');
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
                                                        Text="Update Stock In"
                                                        Spinner={editProcessing}
                                                        Disabled={
                                                            editProcessing ||
                                                            editData.entry_date == '' ||
                                                            editData.container_no.trim() == '' ||
                                                            editData.vendor_id == '' ||
                                                            editData.cro_no == '' ||
                                                            editData.port_location == '' ||
                                                            editData.product_id == '' ||
                                                            editData.product_weight == '' ||
                                                            editData.product_unit_id == '' ||
                                                            editData.product_no_of_bundles == '' ||
                                                            editData.product_rate == '' ||
                                                            editData.product_total_amount == '' ||
                                                            (!editData.all_in_one &&
                                                                (editData.transporter_id == '' ||
                                                                    editData.transporter_rate ==
                                                                        '' ||
                                                                    editData.custom_clearance_id ==
                                                                        '' ||
                                                                    editData.custom_clearance_rate ==
                                                                        '')) ||
                                                            editData.shipping_line_id == '' ||
                                                            editData.shipping_line_rate == '' ||
                                                            editData.fc_amount == '' ||
                                                            editData.exchange_rate == '' ||
                                                            editData.currency_id == ''
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
                                                View Stock In
                                            </h3>

                                            {/* Divider */}
                                            <div className="mb-6 border-b border-gray-200 dark:border-gray-700"></div>

                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Entry Date
                                                    </label>
                                                    <div className="rounded-md bg-gray-100 px-4 py-2 text-gray-800 dark:bg-gray-700 dark:text-white">
                                                        <p className="break-words">
                                                            {viewData?.entry_date || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Container No
                                                    </label>
                                                    <div className="rounded-md bg-gray-100 px-4 py-2 text-gray-800 dark:bg-gray-700 dark:text-white">
                                                        <p className="break-words">
                                                            {viewData?.container_no || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Vehicle No
                                                    </label>
                                                    <div className="rounded-md bg-gray-100 px-4 py-2 text-gray-800 dark:bg-gray-700 dark:text-white">
                                                        <p className="break-words">
                                                            {viewData?.vehicle_no || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        CRO No
                                                    </label>
                                                    <div className="rounded-md bg-gray-100 px-4 py-2 text-gray-800 dark:bg-gray-700 dark:text-white">
                                                        <p className="break-words">
                                                            {viewData?.cro?.cro_no || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Port Location
                                                    </label>
                                                    <div className="rounded-md bg-gray-100 px-4 py-2 text-gray-800 dark:bg-gray-700 dark:text-white">
                                                        <p className="break-words">
                                                            {viewData?.port_location || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Vendor
                                                    </label>
                                                    <div className="rounded-md bg-gray-100 px-4 py-2 text-gray-800 dark:bg-gray-700 dark:text-white">
                                                        <p className="break-words">
                                                            {viewData?.vendor?.name || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Transporter
                                                    </label>
                                                    <div className="rounded-md bg-gray-100 px-4 py-2 text-gray-800 dark:bg-gray-700 dark:text-white">
                                                        <p className="break-words">
                                                            {viewData?.transporter?.name || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Transporter Rate
                                                    </label>
                                                    <div className="rounded-md bg-gray-100 px-4 py-2 text-gray-800 dark:bg-gray-700 dark:text-white">
                                                        <p className="break-words">
                                                            {viewData?.transporter_rate || 0}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Custom Clearance
                                                    </label>
                                                    <div className="rounded-md bg-gray-100 px-4 py-2 text-gray-800 dark:bg-gray-700 dark:text-white">
                                                        <p className="break-words">
                                                            {viewData?.custom_clearance?.name ||
                                                                'N/A'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Custom Clearance Rate
                                                    </label>
                                                    <div className="rounded-md bg-gray-100 px-4 py-2 text-gray-800 dark:bg-gray-700 dark:text-white">
                                                        <p className="break-words">
                                                            {viewData?.custom_clearance_rate || 0}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Shipping Line
                                                    </label>
                                                    <div className="rounded-md bg-gray-100 px-4 py-2 text-gray-800 dark:bg-gray-700 dark:text-white">
                                                        <p className="break-words">
                                                            {viewData?.shipping_line?.name || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Shipping Line Rate
                                                    </label>
                                                    <div className="rounded-md bg-gray-100 px-4 py-2 text-gray-800 dark:bg-gray-700 dark:text-white">
                                                        <p className="break-words">
                                                            {viewData?.shipping_line_rate || 0}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        FC Amount
                                                    </label>
                                                    <div className="rounded-md bg-gray-100 px-4 py-2 text-gray-800 dark:bg-gray-700 dark:text-white">
                                                        <p className="break-words">
                                                            {viewData?.fc_amount || 0}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Exchange Rate
                                                    </label>
                                                    <div className="rounded-md bg-gray-100 px-4 py-2 text-gray-800 dark:bg-gray-700 dark:text-white">
                                                        <p className="break-words">
                                                            {viewData?.exchange_rate || 0}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Currency
                                                    </label>
                                                    <div className="rounded-md bg-gray-100 px-4 py-2 text-gray-800 dark:bg-gray-700 dark:text-white">
                                                        <p className="break-words">
                                                            {viewData?.currency?.name || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Note
                                                    </label>
                                                    <div className="rounded-md bg-gray-100 px-4 py-2 text-gray-800 dark:bg-gray-700 dark:text-white">
                                                        <p className="break-words">
                                                            {viewData?.note || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        All in One
                                                    </label>
                                                    <div className="rounded-md bg-gray-100 px-4 py-2 text-gray-800 dark:bg-gray-700 dark:text-white">
                                                        {viewData?.all_in_one ? 'Yes' : 'No'}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Total Amount
                                                    </label>
                                                    <div className="rounded-md bg-gray-100 px-4 py-2 text-gray-800 dark:bg-gray-700 dark:text-white">
                                                        <p className="break-words">
                                                            {viewData?.total_amount || 0}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Product Table Section */}
                                            <div className="mt-6 overflow-x-auto">
                                                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                                                    Product Details
                                                </h3>
                                                <table className="min-w-full divide-y divide-gray-200 border dark:divide-gray-600">
                                                    <thead className="bg-gray-100 dark:bg-gray-700">
                                                        <tr>
                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                                                                Product
                                                            </th>
                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                                                                Unit
                                                            </th>
                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                                                                Weight
                                                            </th>
                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                                                                Weight (Mann)
                                                            </th>
                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                                                                Bundles
                                                            </th>
                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                                                                Rate
                                                            </th>
                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                                                                Total Amount
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white dark:bg-gray-800">
                                                        <tr>
                                                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                                                                {viewData?.product?.name || 'N/A'}
                                                            </td>
                                                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                                                                {viewData?.unit?.name || 'N/A'}
                                                            </td>
                                                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                                                                {viewData?.product_weight || 0}
                                                            </td>
                                                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                                                                {viewData?.product_weight_in_man ||
                                                                    0}
                                                            </td>
                                                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                                                                {viewData?.product_no_of_bundles ||
                                                                    0}
                                                            </td>
                                                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                                                                {viewData?.product_rate || 0}
                                                            </td>
                                                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                                                                {viewData?.product_total_amount ||
                                                                    0}
                                                            </td>
                                                        </tr>
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
                                                    Text="Edit Stock In"
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

                                {viewCroModalOpen && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 backdrop-blur-[32px]"
                                            onClick={() => setViewCroModalOpen(false)}
                                        ></div>

                                        {/* Modal content */}
                                        <div className="relative z-10 max-h-screen w-full max-w-screen-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 sm:p-8">
                                            <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                                                Containers In CRO
                                            </h3>

                                            {/* Divider */}
                                            <div className="mb-6 border-b border-gray-200 dark:border-gray-700"></div>

                                            {/* Product Table Section */}
                                            <div className="mt-6 overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200 border dark:divide-gray-600">
                                                    <thead className="bg-gray-100 dark:bg-gray-700">
                                                        <tr>
                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                                                                SN
                                                            </th>

                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                                                                CRO No
                                                            </th>

                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                                                                Entry Date
                                                            </th>

                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                                                                Container No
                                                            </th>

                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                                                                Vehicle No
                                                            </th>

                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                                                                Total Amount
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white dark:bg-gray-800">
                                                        {Array.from(
                                                            {
                                                                length:
                                                                    viewCroData?.containers_count ||
                                                                    0,
                                                            },
                                                            (_, index) => {
                                                                const container =
                                                                    viewCroData?.containers?.[
                                                                        index
                                                                    ] || {};

                                                                return (
                                                                    <tr
                                                                        key={
                                                                            container.id ||
                                                                            `empty-${index}`
                                                                        }
                                                                    >
                                                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-white">
                                                                            {index + 1}
                                                                        </td>

                                                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-white">
                                                                            {viewCroData?.cro_no ||
                                                                                'N/A'}
                                                                        </td>

                                                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-white">
                                                                            {container.entry_date ||
                                                                                'N/A'}
                                                                        </td>

                                                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-white">
                                                                            {container.container_no ||
                                                                                'N/A'}
                                                                        </td>

                                                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-white">
                                                                            {container.vehicle_no ||
                                                                                'N/A'}
                                                                        </td>

                                                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-white">
                                                                            {container.total_amount ||
                                                                                'N/A'}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            },
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Buttons */}
                                            <div className="mt-8 flex flex-col-reverse items-center justify-end gap-4 sm:flex-row">
                                                <PrimaryButton
                                                    Action={() => {
                                                        setViewCroModalOpen(false);
                                                        setViewCroData(null);
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
                                                    CustomClass="bg-red-500 hover:bg-red-600 w-[100px]"
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
