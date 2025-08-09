import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BreadCrumb from '@/Components/BreadCrumb';
import { Head, useForm, usePage } from '@inertiajs/react';
import Table from '@/Components/Table';
import { useEffect, useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import Input from '@/Components/Input';
import SelectInput from '@/Components/SelectInput';

export default function index({ subsidaries, controls }) {
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
        control_id: '',
    });

    // Edit Form Data
    const {
        data: editData,
        setData: setEditData,
        put: editPut,
        processing: editProcessing,
        errors: editErrors,
    } = useForm({
        name: '',
        control_id: '',
    });

    const [columns, setColumns] = useState([]);
    const [customActions, setCustomActions] = useState([]);

    //    Create Modal  State
    const [CreateModalOpen, setCreateModalOpen] = useState(false);

    //  Edit Modal State
    const [EditModalOpen, setEditModalOpen] = useState(false);

    useEffect(() => {
        const columns = [
            { key: 'name', label: 'Subsidary Name' },
            {
                key: 'account_code',
                label: 'Subsidary Code',
                badge: (value) => 'bg-blue-500 text-white p-3',
            },

            { key: 'control.name', label: 'Control Name' },
        ];

        const actions = [
            {
                label: 'Edit',
                type: 'button',
                onClick: (item) => {
                    setEditModalOpen(true);
                    setEditData('id', item.id);
                    setEditData('name', item.name);
                },
            },
        ];

        setCustomActions(actions);
        setColumns(columns);
    }, []);

    // CreateMethod
    const CreateMethod = (e) => {
        e.preventDefault();

        createPost(route('accounts.subsidaries.store'), {
            onSuccess: () => {
                setCreateModalOpen(false);
                setCreateData('name', '');
                setCreateData('control_id', '');
            },
        });
    };

    // EditMethod
    const EditMethod = (e) => {
        e.preventDefault();
        editPut(route('accounts.subsidaries.update', editData.id), {
            onSuccess: () => {
                setEditModalOpen(false);
                setEditData('id', '');
                setEditData('name', '');
            },
        });
    };

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Subsidaries" />

                <BreadCrumb
                    header={'Subsidaries'}
                    parent={'Dashboard'}
                    parent_link={route('dashboard')}
                    child={'Subsidaries'}
                />

                <Card
                    Content={
                        <>
                            <div className="my-3 flex flex-wrap justify-end">
                                <PrimaryButton
                                    CustomClass={'mix-w-[200px]'}
                                    Text={'Create Subsidary'}
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
                                BulkDeleteRoute={'accounts.subsidaries.destroybyselection'}
                                SingleDeleteRoute={'accounts.subsidaries.destroy'}
                                items={subsidaries}
                                props={props}
                                columns={columns}
                                Search={false}
                                customActions={customActions}
                            />

                            {/* Create Modal */}
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
                                        <div className="relative z-10 max-h-screen w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 sm:p-8">
                                            <form
                                                onSubmit={CreateMethod}
                                                className="grid grid-cols-1 items-start gap-6 md:grid-cols-2"
                                            >
                                                <div className="col-span-2">
                                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                        Create Subsidary
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

                                                <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-1">
                                                    <Input
                                                        InputName={'Subsidary Name'}
                                                        Id={'name'}
                                                        Name={'name'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Subsidary Name'}
                                                        Required={true}
                                                        Error={createErrors.name}
                                                        Value={createData.name}
                                                        Action={(e) =>
                                                            setCreateData('name', e.target.value)
                                                        }
                                                    />

                                                    <SelectInput
                                                        InputName={'Control'}
                                                        Name={'control_id'}
                                                        Error={createErrors.control_id}
                                                        Id={'control_id'}
                                                        Value={createData.control_id}
                                                        items={controls}
                                                        itemKey={'name'}
                                                        Placeholder={'Select Subsidary Control'}
                                                        Required={true}
                                                        Action={(value) =>
                                                            setCreateData('control_id', value)
                                                        }
                                                    />
                                                </div>

                                                {/* Buttons */}
                                                <div className="col-span-2 mt-4 flex items-center justify-center gap-4">
                                                    <PrimaryButton
                                                        Action={() => {
                                                            setCreateModalOpen(false);
                                                            setCreateData('name', '');
                                                            setCreateData('control_id', '');
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
                                                            'bg-red-500 hover:bg-red-600 w-full'
                                                        }
                                                    />

                                                    <PrimaryButton
                                                        Type="submit"
                                                        Text="Save Control"
                                                        Spinner={createProcessing}
                                                        Disabled={
                                                            createProcessing ||
                                                            createData.name.trim() === '' ||
                                                            createData.control_id === ''
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
                                        <div className="relative z-10 max-h-screen w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 sm:p-8">
                                            <form
                                                onSubmit={EditMethod}
                                                className="grid grid-cols-1 items-start gap-6 md:grid-cols-2"
                                            >
                                                <div className="col-span-2">
                                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                        Edit Control
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

                                                <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-1">
                                                    <Input
                                                        InputName={'Subsidary Name'}
                                                        Id={'name'}
                                                        Name={'name'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Subsidary Name'}
                                                        Required={true}
                                                        Error={editErrors.name}
                                                        Value={editData.name}
                                                        Action={(e) =>
                                                            setEditData('name', e.target.value)
                                                        }
                                                    />
                                                </div>

                                                {/* Buttons */}
                                                <div className="col-span-2 mt-4 flex items-center justify-center gap-4">
                                                    <PrimaryButton
                                                        Action={() => {
                                                            setEditModalOpen(false);
                                                            setEditData('id', '');
                                                            setEditData('name', '');
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
                                                        CustomClass={
                                                            'bg-red-500 hover:bg-red-600 w-full'
                                                        }
                                                        Text={'Close'}
                                                    />

                                                    <PrimaryButton
                                                        Type="submit"
                                                        Text="Update Subsidary"
                                                        Spinner={editProcessing}
                                                        Disabled={
                                                            editProcessing ||
                                                            editData.name.trim() === ''
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
