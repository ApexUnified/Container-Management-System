import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BreadCrumb from '@/Components/BreadCrumb';
import { Head, useForm, usePage } from '@inertiajs/react';
import Table from '@/Components/Table';
import { useEffect, useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import Input from '@/Components/Input';
import SelectInput from '@/Components/SelectInput';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function index({ controls, details }) {
    const { props } = usePage();
    const [subsidaries, setSubsidaries] = useState([]);

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
        title: '',
        control_id: '',
        subsidary_id: '',
        other_details: '',
        bank_cash: '',
        address: '',
        ntn_no: '',
        strn_no: '',
        email: '',
        mobile_no: '',
        cnic_no: '',
    });

    // Edit Form Data
    const {
        data: editData,
        setData: setEditData,
        put: editPut,
        processing: editProcessing,
        errors: editErrors,
    } = useForm({
        title: '',
        other_details: '',
        bank_cash: '',
        address: '',
        ntn_no: '',
        strn_no: '',
        email: '',
        mobile_no: '',
        cnic_no: '',
    });

    const [columns, setColumns] = useState([]);
    const [customActions, setCustomActions] = useState([]);

    //    Create Modal  State
    const [CreateModalOpen, setCreateModalOpen] = useState(false);

    //  Edit Modal State
    const [EditModalOpen, setEditModalOpen] = useState(false);

    useEffect(() => {
        const columns = [
            { key: 'control.name', label: 'Control Account Name' },
            { key: 'subsidary.name', label: 'Subsidary Account Name' },
            { key: 'title', label: 'Detail Account' },

            {
                key: 'account_code',
                label: 'Code',
                badge: (value) => 'bg-blue-500 text-white p-3',
            },
        ];

        const actions = [
            {
                label: 'Edit',
                type: 'button',
                onClick: (item) => {
                    setEditModalOpen(true);
                    setEditData('id', item.id);
                    setEditData('title', item.title);
                    setEditData('bank_cash', item.bank_cash);
                    setEditData('address', item.address);
                    setEditData('ntn_no', item.ntn_no);
                    setEditData('strn_no', item.strn_no);
                    setEditData('email', item.email);
                    setEditData('mobile_no', item.mobile_no);
                    setEditData('cnic_no', item.cnic_no);
                    setEditData('other_details', item.other_details);
                },
            },
        ];

        setCustomActions(actions);
        setColumns(columns);
    }, []);

    // CreateMethod
    const CreateMethod = (e) => {
        e.preventDefault();

        createPost(route('setups.accounts.details.store'), {
            onSuccess: () => {
                setCreateData('title', '');
                setCreateData('address', '');
                setCreateData('ntn_no', '');
                setCreateData('strn_no', '');
                setCreateData('email', '');
                setCreateData('mobile_no', '');
                setCreateData('cnic_no', '');
                setCreateData('other_details', '');
            },
        });
    };

    // EditMethod
    const EditMethod = (e) => {
        e.preventDefault();
        editPut(route('setups.accounts.details.update', editData.id), {
            onSuccess: () => {
                setEditModalOpen(false);
                setEditData('id', '');
                setEditData('title', '');
                setEditData('bank_cash', '');
                setEditData('address', '');
                setEditData('ntn_no', '');
                setEditData('strn_no', '');
                setEditData('email', '');
                setEditData('mobile_no', '');
                setEditData('cnic_no', '');
                setEditData('other_details', '');
                setSubsidaries([]);
            },
        });
    };

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Setups - Account Detail Setup" />

                <BreadCrumb
                    header={'Setups - Account Detail Setup'}
                    parent={'Dashboard'}
                    parent_link={route('dashboard')}
                    child={'Setups - Account Detail Setup'}
                />

                <Card
                    Content={
                        <>
                            <div className="flex flex-wrap justify-end my-3">
                                <PrimaryButton
                                    CustomClass={'mix-w-[200px]'}
                                    Text={'Create Account Detail'}
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
                                BulkDeleteRoute={'setups.accounts.details.destroybyselection'}
                                SingleDeleteRoute={'setups.accounts.details.destroy'}
                                items={details}
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
                                                        Create Account Detail
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

                                                <div className="grid grid-cols-1 col-span-2 gap-4 md:grid-cols-4">
                                                    <SelectInput
                                                        InputName={'Control Account'}
                                                        Name={'control_id'}
                                                        Error={createErrors.control_id}
                                                        Id={'control_id'}
                                                        Value={createData.control_id}
                                                        items={controls}
                                                        itemKey={'name'}
                                                        Placeholder={'Select Detail Control'}
                                                        Required={true}
                                                        Action={(value) => {
                                                            setCreateData('control_id', value);
                                                            setCreateData('subsidary_id', '');
                                                            setSubsidaries([]);
                                                            if (value !== '') {
                                                                axios
                                                                    .get(
                                                                        route(
                                                                            'setups.accounts.details.getsubsidarybycontrol',
                                                                            { control_id: value },
                                                                        ),
                                                                    )
                                                                    .then((res) => {
                                                                        if (res.data.status) {
                                                                            setSubsidaries(
                                                                                res.data.data,
                                                                            );
                                                                        } else {
                                                                            Swal.fire({
                                                                                icon: 'error',
                                                                                title: 'Error',
                                                                                text: res.data
                                                                                    .message,
                                                                                showConfirmButton: true,
                                                                                confirmButtonText:
                                                                                    'Close',
                                                                            });
                                                                        }
                                                                    })
                                                                    .catch((err) => {
                                                                        Swal.fire({
                                                                            icon: 'error',
                                                                            title: 'Error',
                                                                            text: err,
                                                                            showConfirmButton: true,
                                                                            confirmButtonText:
                                                                                'Close',
                                                                        });
                                                                    });
                                                            }
                                                        }}
                                                    />

                                                    <SelectInput
                                                        key={subsidaries.length}
                                                        InputName={'Subsidary Account'}
                                                        Name={'subsidary_id'}
                                                        Error={createErrors.subsidary_id}
                                                        isDisabled={subsidaries.length === 0}
                                                        Id={'subsidary_id'}
                                                        Value={createData.subsidary_id}
                                                        items={subsidaries}
                                                        itemKey={'name'}
                                                        Placeholder={'Select Detail Subsidary'}
                                                        Required={true}
                                                        Action={(value) =>
                                                            setCreateData('subsidary_id', value)
                                                        }
                                                    />

                                                    <SelectInput
                                                        InputName={'Bank/Cash'}
                                                        Name={'bank_cash'}
                                                        Error={createErrors.bank_cash}
                                                        Id={'bank_cash'}
                                                        Value={createData.bank_cash}
                                                        items={[{ name: 'cash' }, { name: 'bank' }]}
                                                        itemKey={'name'}
                                                        Placeholder={'Select Bank/Cash'}
                                                        Required={false}
                                                        Action={(value) =>
                                                            setCreateData('bank_cash', value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Detail Account'}
                                                        Id={'title'}
                                                        Name={'title'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Detail Account'}
                                                        Required={true}
                                                        Error={createErrors.title}
                                                        Value={createData.title}
                                                        Action={(e) =>
                                                            setCreateData('title', e.target.value)
                                                        }
                                                    />

                                                    <div>
                                                        <label
                                                            htmlFor="other_details"
                                                            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                                                        >
                                                            Other Details
                                                        </label>
                                                        <textarea
                                                            id="other_details"
                                                            rows="1"
                                                            className="dark:bg-dark-900 shadow-theme-xs focus:ring-3 focus:outline-hidden mb-2 h-[42px] w-full min-w-0 max-w-full rounded-lg border border-gray-300 bg-transparent py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-300 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-800"
                                                            placeholder="Enter Other Details here..."
                                                            value={createData.other_details}
                                                            onChange={(e) =>
                                                                setCreateData(
                                                                    'other_details',
                                                                    e.target.value,
                                                                )
                                                            }
                                                        ></textarea>
                                                        {createErrors.other_details && (
                                                            <span className="ml-2 text-red-500 dark:text-white">
                                                                {createErrors.other_details}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid col-span-2">
                                                    <hr />
                                                </div>

                                                <div className="grid grid-cols-1 col-span-2 gap-4 md:grid-cols-4">
                                                    <div>
                                                        <label
                                                            htmlFor="address"
                                                            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                                                        >
                                                            Address
                                                        </label>
                                                        <textarea
                                                            id="address"
                                                            rows="1"
                                                            className="dark:bg-dark-900 shadow-theme-xs focus:ring-3 focus:outline-hidden mb-2 h-[42px] w-full min-w-0 max-w-full rounded-lg border border-gray-300 bg-transparent py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-300 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-800"
                                                            placeholder="Enter Address here..."
                                                            value={createData.address}
                                                            onChange={(e) =>
                                                                setCreateData(
                                                                    'address',
                                                                    e.target.value,
                                                                )
                                                            }
                                                        ></textarea>
                                                        {createErrors.address && (
                                                            <span className="ml-2 text-red-500 dark:text-white">
                                                                {createErrors.address}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <Input
                                                        InputName={'NTN No'}
                                                        Id={'ntn_no'}
                                                        Name={'ntn_no'}
                                                        Error={createErrors.ntn_no}
                                                        Type={'text'}
                                                        Placeholder={'Enter NTN No'}
                                                        Required={false}
                                                        Value={createData.ntn_no}
                                                        Action={(e) =>
                                                            setCreateData('ntn_no', e.target.value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'STRN No'}
                                                        Id={'strn_no'}
                                                        Name={'strn_no'}
                                                        Error={createErrors.strn_no}
                                                        Type={'text'}
                                                        Placeholder={'Enter STRN No'}
                                                        Required={false}
                                                        Value={createData.strn_no}
                                                        Action={(e) =>
                                                            setCreateData('strn_no', e.target.value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Email'}
                                                        Id={'email'}
                                                        Name={'email'}
                                                        Error={createErrors.email}
                                                        Type={'email'}
                                                        Placeholder={'Enter Email'}
                                                        Required={false}
                                                        Value={createData.email}
                                                        Action={(e) =>
                                                            setCreateData('email', e.target.value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Mobile No'}
                                                        Id={'mobile_no'}
                                                        Name={'mobile_no'}
                                                        Error={createErrors.mobile_no}
                                                        Type={'text'}
                                                        Placeholder={'Enter Mobile No'}
                                                        Required={false}
                                                        Value={createData.mobile_no}
                                                        Action={(e) =>
                                                            setCreateData(
                                                                'mobile_no',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'CNIC No'}
                                                        Id={'cnic_no'}
                                                        Name={'cnic_no'}
                                                        Error={createErrors.cnic_no}
                                                        Type={'text'}
                                                        Placeholder={'Enter CNIC No'}
                                                        Required={false}
                                                        Value={createData.cnic_no}
                                                        Action={(e) =>
                                                            setCreateData('cnic_no', e.target.value)
                                                        }
                                                    />
                                                </div>

                                                {/* Buttons */}
                                                <div className="flex items-center justify-center col-span-2 gap-4 mt-4">
                                                    <PrimaryButton
                                                        Action={() => {
                                                            setCreateModalOpen(false);
                                                            setCreateData('control_id', '');
                                                            setCreateData('subsidary_id', '');
                                                            setCreateData('title', '');
                                                            setCreateData('bank_cash', '');
                                                            setCreateData('address', '');
                                                            setCreateData('ntn_no', '');
                                                            setCreateData('strn_no', '');
                                                            setCreateData('email', '');
                                                            setCreateData('mobile_no', '');
                                                            setCreateData('cnic_no', '');
                                                            setCreateData('other_details', '');
                                                            setSubsidaries([]);
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
                                                        Text="Save Account Detail"
                                                        Spinner={createProcessing}
                                                        Disabled={
                                                            createProcessing ||
                                                            createData.title.trim() === '' ||
                                                            createData.control_id === '' ||
                                                            createData.subsidary_id === ''
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
                                                        Edit Account Detail
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

                                                <div className="grid grid-cols-1 col-span-2 gap-4 md:grid-cols-4">
                                                    <SelectInput
                                                        InputName={'Bank/Cash'}
                                                        Name={'bank_cash'}
                                                        Error={editErrors.bank_cash}
                                                        Id={'bank_cash'}
                                                        Value={editData.bank_cash}
                                                        items={[{ name: 'cash' }, { name: 'bank' }]}
                                                        itemKey={'name'}
                                                        Placeholder={'Select Bank/Cash'}
                                                        Required={false}
                                                        Action={(value) => {
                                                            setEditData('bank_cash', value);
                                                        }}
                                                    />

                                                    <Input
                                                        InputName={'Detail Account'}
                                                        Id={'title'}
                                                        Name={'title'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Detail Account'}
                                                        Required={true}
                                                        Error={editErrors.title}
                                                        Value={editData.title}
                                                        Action={(e) =>
                                                            setEditData('title', e.target.value)
                                                        }
                                                    />

                                                    <div>
                                                        <label
                                                            htmlFor="other_details"
                                                            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                                                        >
                                                            Other Details
                                                        </label>
                                                        <textarea
                                                            id="other_details"
                                                            rows="1"
                                                            className="dark:bg-dark-900 shadow-theme-xs focus:ring-3 focus:outline-hidden mb-2 h-[42px] w-full min-w-0 max-w-full rounded-lg border border-gray-300 bg-transparent py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-300 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-800"
                                                            placeholder="Enter Other Details here..."
                                                            value={editData.other_details}
                                                            onChange={(e) =>
                                                                setEditData(
                                                                    'other_details',
                                                                    e.target.value,
                                                                )
                                                            }
                                                        ></textarea>
                                                        {editErrors.other_details && (
                                                            <span className="ml-2 text-red-500 dark:text-white">
                                                                {editErrors.other_details}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid col-span-2">
                                                    <hr />
                                                </div>

                                                <div className="grid grid-cols-1 col-span-2 gap-4 md:grid-cols-4">
                                                    <div>
                                                        <label
                                                            htmlFor="address"
                                                            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                                                        >
                                                            Address
                                                        </label>
                                                        <textarea
                                                            id="address"
                                                            rows="1"
                                                            className="dark:bg-dark-900 shadow-theme-xs focus:ring-3 focus:outline-hidden mb-2 h-[42px] w-full min-w-0 max-w-full rounded-lg border border-gray-300 bg-transparent py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-300 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-800"
                                                            placeholder="Enter Address here..."
                                                            value={editData.address}
                                                            onChange={(e) =>
                                                                setEditData(
                                                                    'address',
                                                                    e.target.value,
                                                                )
                                                            }
                                                        ></textarea>
                                                        {editErrors.address && (
                                                            <span className="ml-2 text-red-500 dark:text-white">
                                                                {editErrors.address}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <Input
                                                        InputName={'NTN No'}
                                                        Id={'ntn_no'}
                                                        Name={'ntn_no'}
                                                        Error={editErrors.ntn_no}
                                                        Type={'text'}
                                                        Placeholder={'Enter NTN No'}
                                                        Required={false}
                                                        Value={editData.ntn_no}
                                                        Action={(e) =>
                                                            setEditData('ntn_no', e.target.value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'STRN No'}
                                                        Id={'strn_no'}
                                                        Name={'strn_no'}
                                                        Error={editErrors.strn_no}
                                                        Type={'text'}
                                                        Placeholder={'Enter STRN No'}
                                                        Required={false}
                                                        Value={editData.strn_no}
                                                        Action={(e) =>
                                                            setEditData('strn_no', e.target.value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Email'}
                                                        Id={'email'}
                                                        Name={'email'}
                                                        Error={editErrors.email}
                                                        Type={'email'}
                                                        Placeholder={'Enter Email'}
                                                        Required={false}
                                                        Value={editData.email}
                                                        Action={(e) =>
                                                            setEditData('email', e.target.value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Mobile No'}
                                                        Id={'mobile_no'}
                                                        Name={'mobile_no'}
                                                        Error={editErrors.mobile_no}
                                                        Type={'text'}
                                                        Placeholder={'Enter Mobile No'}
                                                        Required={false}
                                                        Value={editData.mobile_no}
                                                        Action={(e) =>
                                                            setEditData('mobile_no', e.target.value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'CNIC No'}
                                                        Id={'cnic_no'}
                                                        Name={'cnic_no'}
                                                        Error={editErrors.cnic_no}
                                                        Type={'text'}
                                                        Placeholder={'Enter CNIC No'}
                                                        Required={false}
                                                        Value={editData.cnic_no}
                                                        Action={(e) =>
                                                            setEditData('cnic_no', e.target.value)
                                                        }
                                                    />
                                                </div>

                                                {/* Buttons */}
                                                <div className="flex items-center justify-center col-span-2 gap-4 mt-4">
                                                    <PrimaryButton
                                                        Action={() => {
                                                            setEditModalOpen(false);
                                                            setEditData('id', '');
                                                            setEditData('control_id', '');
                                                            setEditData('subsidary_id', '');
                                                            setEditData('title', '');
                                                            setEditData('bank_cash', '');
                                                            setEditData('address', '');
                                                            setEditData('ntn_no', '');
                                                            setEditData('strn_no', '');
                                                            setEditData('email', '');
                                                            setEditData('mobile_no', '');
                                                            setEditData('cnic_no', '');
                                                            setEditData('other_details', '');
                                                            setSubsidaries([]);
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
                                                        Text="Update Account Detail"
                                                        Spinner={editProcessing}
                                                        Disabled={
                                                            editProcessing ||
                                                            editData.title.trim() === ''
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
            </AuthenticatedLayout>
        </>
    );
}
