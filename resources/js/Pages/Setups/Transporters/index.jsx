import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BreadCrumb from '@/Components/BreadCrumb';
import { Head, useForm, usePage } from '@inertiajs/react';
import Table from '@/Components/Table';
import { useEffect, useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import Input from '@/Components/Input';

export default function index({ transporters }) {
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
        name: '',
        email: '',
        contact_person: '',
        address: '',
        tel_no: '',
        mobile_no: '',
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
        name: '',
        email: '',
        contact_person: '',
        address: '',
        tel_no: '',
        mobile_no: '',
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

    useEffect(() => {
        const columns = [
            {
                label: 'Name',
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
                                {item.name.length > 30 ? item.name.slice(0, 30) + '...' : item.name}
                            </p>
                        </div>
                    );
                },
            },
            { key: 'email', label: 'Email' },
            { key: 'contact_person', label: 'Contact Person' },
            { key: 'address', label: 'Address' },
            { key: 'tel_no', label: 'Tel No' },
            { key: 'mobile_no', label: 'Mobile No' },
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

        createPost(route('setups.transporters.store'), {
            onSuccess: () => {
                setCreateModalOpen(false);
                setCreateData('name', '');
                setCreateData('email', '');
                setCreateData('contact_person', '');
                setCreateData('address', '');
                setCreateData('tel_no', '');
                setCreateData('mobile_no', '');
            },
        });
    };

    // EditMethod
    const EditMethod = (e) => {
        e.preventDefault();
        editPut(route('setups.transporters.update', editData.id), {
            onSuccess: () => {
                setEditModalOpen(false);
                setEditData('id', '');
                setEditData('name', '');
                setEditData('email', '');
                setEditData('contact_person', '');
                setEditData('address', '');
                setEditData('tel_no', '');
                setEditData('mobile_no', '');
            },
        });
    };

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Setups - Transporters" />

                <BreadCrumb
                    header={'Setups - Transporters'}
                    parent={'Dashboard'}
                    parent_link={route('dashboard')}
                    child={'Setups - Transporters'}
                />

                <Card
                    Content={
                        <>
                            <div className="flex flex-wrap justify-end my-3">
                                <PrimaryButton
                                    CustomClass={'mix-w-[200px]'}
                                    Text={'Create Transporter'}
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
                                BulkDeleteRoute={'setups.transporters.destroybyselection'}
                                SingleDeleteRoute={'setups.transporters.destroy'}
                                items={transporters}
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
                                                        Create Transporter
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

                                                <div className="grid grid-cols-1 col-span-2 gap-4 md:grid-cols-2">
                                                    <Input
                                                        InputName={'Name'}
                                                        Id={'name'}
                                                        Name={'name'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Name'}
                                                        Required={true}
                                                        Error={createErrors.name}
                                                        Value={createData.name}
                                                        Action={(e) =>
                                                            setCreateData('name', e.target.value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Email'}
                                                        Id={'email'}
                                                        Name={'email'}
                                                        Type={'email'}
                                                        Placeholder={'Enter Email'}
                                                        Required={false}
                                                        Error={createErrors.email}
                                                        Value={createData.email}
                                                        Action={(e) =>
                                                            setCreateData('email', e.target.value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Contact Person'}
                                                        Id={'contact_person'}
                                                        Name={'contact_person'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Contact Person'}
                                                        Required={false}
                                                        Error={createErrors.contact_person}
                                                        Value={createData.contact_person}
                                                        Action={(e) =>
                                                            setCreateData(
                                                                'contact_person',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Mobile No'}
                                                        Id={'mobile_no'}
                                                        Name={'mobile_no'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Mobile Number'}
                                                        Required={false}
                                                        Error={createErrors.mobile_no}
                                                        Value={createData.mobile_no}
                                                        Action={(e) =>
                                                            setCreateData(
                                                                'mobile_no',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Tel No'}
                                                        Id={'tel_no'}
                                                        Name={'tel_no'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Telephone Number'}
                                                        Required={false}
                                                        Error={createErrors.tel_no}
                                                        Value={createData.tel_no}
                                                        Action={(e) =>
                                                            setCreateData('tel_no', e.target.value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Address'}
                                                        Id={'address'}
                                                        Name={'address'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Address'}
                                                        Required={false}
                                                        Error={createErrors.address}
                                                        Value={createData.address}
                                                        Action={(e) =>
                                                            setCreateData('address', e.target.value)
                                                        }
                                                    />
                                                </div>

                                                {/* Buttons */}
                                                <div className="flex items-center justify-center col-span-2 gap-4 mt-4">
                                                    <PrimaryButton
                                                        Action={() => {
                                                            setCreateModalOpen(false);
                                                            setCreateData('name', '');
                                                            setCreateData('email', '');
                                                            setCreateData('contact_person', '');
                                                            setCreateData('address', '');
                                                            setCreateData('tel_no', '');
                                                            setCreateData('mobile_no', '');
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
                                                            'bg-red-500 hover:bg-red-600 w-full '
                                                        }
                                                    />

                                                    <PrimaryButton
                                                        Type="submit"
                                                        Text="Save Transporter"
                                                        Spinner={createProcessing}
                                                        Disabled={
                                                            createProcessing ||
                                                            createData.name === ''
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
                                                        Edit Transporter
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

                                                <div className="grid grid-cols-1 col-span-2 gap-4 md:grid-cols-2">
                                                    <Input
                                                        InputName={'Name'}
                                                        Id={'name'}
                                                        Name={'name'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Name'}
                                                        Required={true}
                                                        Error={editErrors.name}
                                                        Value={editData.name}
                                                        Action={(e) =>
                                                            setEditData('name', e.target.value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Email'}
                                                        Id={'email'}
                                                        Name={'email'}
                                                        Type={'email'}
                                                        Placeholder={'Enter Email'}
                                                        Required={false}
                                                        Error={editErrors.email}
                                                        Value={editData.email}
                                                        Action={(e) =>
                                                            setEditData('email', e.target.value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Contact Person'}
                                                        Id={'contact_person'}
                                                        Name={'contact_person'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Contact Person'}
                                                        Required={false}
                                                        Error={editErrors.contact_person}
                                                        Value={editData.contact_person}
                                                        Action={(e) =>
                                                            setEditData(
                                                                'contact_person',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Mobile No'}
                                                        Id={'mobile_no'}
                                                        Name={'mobile_no'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Mobile Number'}
                                                        Required={false}
                                                        Error={editErrors.mobile_no}
                                                        Value={editData.mobile_no}
                                                        Action={(e) =>
                                                            setEditData('mobile_no', e.target.value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Tel No'}
                                                        Id={'tel_no'}
                                                        Name={'tel_no'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Telephone Number'}
                                                        Required={false}
                                                        Error={editErrors.tel_no}
                                                        Value={editData.tel_no}
                                                        Action={(e) =>
                                                            setEditData('tel_no', e.target.value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Address'}
                                                        Id={'address'}
                                                        Name={'address'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Address'}
                                                        Required={false}
                                                        Error={editErrors.address}
                                                        Value={editData.address}
                                                        Action={(e) =>
                                                            setEditData('address', e.target.value)
                                                        }
                                                    />
                                                </div>

                                                {/* Buttons */}
                                                <div className="flex items-center justify-center col-span-2 gap-4 mt-4">
                                                    <PrimaryButton
                                                        Action={() => {
                                                            setEditModalOpen(false);
                                                            setEditData('id', '');
                                                            setEditData('name', '');
                                                            setEditData('email', '');
                                                            setEditData('contact_person', '');
                                                            setEditData('address', '');
                                                            setEditData('tel_no', '');
                                                            setEditData('mobile_no', '');
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
                                                        CustomClass={
                                                            'bg-red-500 hover:bg-red-600 w-full'
                                                        }
                                                        Text={'Close'}
                                                    />

                                                    <PrimaryButton
                                                        Type="submit"
                                                        Text="Update Transporter"
                                                        Spinner={editProcessing}
                                                        Disabled={
                                                            editProcessing || editData.name === ''
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
                                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto sm:p-6">
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 backdrop-blur-[32px]"
                                            onClick={() => setViewModalOpen(false)}
                                        ></div>

                                        {/* Modal content */}
                                        <div className="relative z-10 w-full max-w-4xl max-h-screen p-6 overflow-y-auto bg-white shadow-xl rounded-2xl dark:bg-gray-800 sm:p-8">
                                            <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                                                View Transporter
                                            </h3>

                                            {/* Divider */}
                                            <div className="mb-6 border-b border-gray-200 dark:border-gray-700"></div>

                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Name
                                                    </label>
                                                    <div className="px-4 py-2 text-gray-800 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-white">
                                                        {viewData?.name || 'N/A'}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Email
                                                    </label>
                                                    <div className="px-4 py-2 text-gray-800 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-white">
                                                        {viewData?.email || 'N/A'}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Address
                                                    </label>
                                                    <div className="px-4 py-2 text-gray-800 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-white">
                                                        {viewData?.address || 'N/A'}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Contact Person
                                                    </label>
                                                    <div className="px-4 py-2 text-gray-800 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-white">
                                                        {viewData?.contact_person || 'N/A'}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Mobile No
                                                    </label>
                                                    <div className="px-4 py-2 text-gray-800 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-white">
                                                        {viewData?.mobile_no || 'N/A'}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Tel No
                                                    </label>
                                                    <div className="px-4 py-2 text-gray-800 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-white">
                                                        {viewData?.tel_no || 'N/A'}
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
                                                    Text="Edit Transporter"
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
