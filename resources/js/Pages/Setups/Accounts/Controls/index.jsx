import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BreadCrumb from '@/Components/BreadCrumb';
import { Head, useForm, usePage } from '@inertiajs/react';
import Table from '@/Components/Table';
import { useEffect, useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import Input from '@/Components/Input';

export default function index({ controls }) {
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
    });

    const [columns, setColumns] = useState([]);
    const [customActions, setCustomActions] = useState([]);

    //    Create Modal  State
    const [CreateModalOpen, setCreateModalOpen] = useState(false);

    //  Edit Modal State
    const [EditModalOpen, setEditModalOpen] = useState(false);

    useEffect(() => {
        const columns = [{ key: 'name', label: 'Control Account Name' }];

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

        createPost(route('setups.accounts.controls.store'), {
            onSuccess: () => {
                setCreateModalOpen(false);
                setCreateData('name', '');
            },
        });
    };

    // EditMethod
    const EditMethod = (e) => {
        e.preventDefault();
        editPut(route('setups.accounts.controls.update', editData.id), {
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
                <Head title="Setups - Control Setup" />

                <BreadCrumb
                    header={'Setups - Control Account Setup'}
                    parent={'Dashboard'}
                    parent_link={route('dashboard')}
                    child={'Setups - Control Account Setup'}
                />

                <Card
                    Content={
                        <>
                            <div className="my-3 flex flex-wrap justify-end">
                                <PrimaryButton
                                    CustomClass={'mix-w-[200px]'}
                                    Text={'Create Control Account'}
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
                                BulkDeleteRoute={'setups.accounts.controls.destroybyselection'}
                                SingleDeleteRoute={'setups.accounts.controls.destroy'}
                                items={controls}
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
                                                        Create Control Account
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
                                                        InputName={'Account Name'}
                                                        Id={'name'}
                                                        Name={'name'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Account Name'}
                                                        Required={true}
                                                        Error={createErrors.name}
                                                        Value={createData.name}
                                                        Action={(e) =>
                                                            setCreateData('name', e.target.value)
                                                        }
                                                    />
                                                </div>

                                                {/* Buttons */}
                                                <div className="col-span-2 mt-4 flex items-center justify-center gap-4">
                                                    <PrimaryButton
                                                        Action={() => {
                                                            setCreateModalOpen(false);
                                                            setCreateData('name', '');
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
                                                        Text="Save Control Account"
                                                        Spinner={createProcessing}
                                                        Disabled={
                                                            createProcessing ||
                                                            createData.name.trim() === ''
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
                                                        Edit Control Account
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
                                                        InputName={'Account Name'}
                                                        Id={'name'}
                                                        Name={'name'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Account Name'}
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
                                                        Text="Update Control Account "
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
