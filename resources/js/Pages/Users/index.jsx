import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BreadCrumb from '@/Components/BreadCrumb';
import { Head, useForm, usePage } from '@inertiajs/react';
import Table from '@/Components/Table';
import { useEffect, useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import Input from '@/Components/Input';

export default function index({ users }) {
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
        password: '',
        password_confirmation: '',
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
        password: '',
        password_confirmation: '',
    });

    const [columns, setColumns] = useState([]);
    const [customActions, setCustomActions] = useState([]);

    //    Create Modal  State
    const [CreateModalOpen, setCreateModalOpen] = useState(false);

    //  Edit Modal State
    const [EditModalOpen, setEditModalOpen] = useState(false);

    // Password Input Toggles
    const [showPasswordToggle, setShowPasswordToggle] = useState(false);
    const [showConfirmPasswordToggle, setShowConfirmPasswordToggle] = useState(false);

    useEffect(() => {
        const columns = [{ key: 'name', label: 'Name' }];

        const actions = [
            {
                label: 'Edit',
                type: 'button',
                onClick: (item) => {
                    setEditModalOpen(true);
                    setEditData('id', item.id);
                    setEditData('name', item.name);
                    setEditData('password', '');
                    setEditData('password_confirmation', '');
                },
            },
        ];

        setCustomActions(actions);
        setColumns(columns);
    }, []);

    // CreateMethod
    const CreateMethod = (e) => {
        e.preventDefault();

        createPost(route('users.store'), {
            onSuccess: () => {
                setCreateModalOpen(false);
                setCreateData('name', '');
                setCreateData('password', '');
                setCreateData('password_confirmation', '');
            },
        });
    };

    // EditMethod
    const EditMethod = (e) => {
        e.preventDefault();
        editPut(route('users.update', editData.id), {
            onSuccess: () => {
                setEditModalOpen(false);
                setEditData('id', '');
                setEditData('name', '');
                setEditData('password', '');
                setEditData('password_confirmation', '');
            },
        });
    };

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Users" />

                <BreadCrumb
                    header={'Users'}
                    parent={'Dashboard'}
                    parent_link={route('dashboard')}
                    child={'Users'}
                />

                <Card
                    Content={
                        <>
                            <div className="my-3 flex flex-wrap justify-end">
                                <PrimaryButton
                                    CustomClass={'mix-w-[200px]'}
                                    Text={'Create User'}
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
                                BulkDeleteRoute={'users.destroybyselection'}
                                SingleDeleteRoute={'users.destroy'}
                                items={users}
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
                                                        Create User
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

                                                {createData.password != '' &&
                                                    createData.password_confirmation != '' &&
                                                    createData.password !=
                                                        createData.password_confirmation && (
                                                        <div className="col-span-2 mb-2 w-full rounded-xl border border-blue-300 bg-blue-50 px-5 py-4 text-sm text-blue-800 shadow-sm">
                                                            <div className="mb-1 text-base font-bold text-blue-700">
                                                                ℹ️ Info
                                                            </div>
                                                            <p>
                                                                Password And Confirm Password Does
                                                                Not Match
                                                            </p>
                                                        </div>
                                                    )}

                                                <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                                        InputName={'Password'}
                                                        Id={'password'}
                                                        Name={'password'}
                                                        Type={'password'}
                                                        Placeholder={'Enter Password'}
                                                        Required={true}
                                                        Error={createErrors.password}
                                                        Value={createData.password}
                                                        Action={(e) =>
                                                            setCreateData(
                                                                'password',
                                                                e.target.value,
                                                            )
                                                        }
                                                        ShowPasswordToggle={showPasswordToggle}
                                                        setShowPasswordToggle={
                                                            setShowPasswordToggle
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Confirm Password'}
                                                        Id={'password_confirmation'}
                                                        Name={'password_confirmation'}
                                                        Type={'password'}
                                                        Placeholder={'Enter Confirm Password'}
                                                        Required={true}
                                                        Error={createErrors.password_confirmation}
                                                        Value={createData.password_confirmation}
                                                        Action={(e) =>
                                                            setCreateData(
                                                                'password_confirmation',
                                                                e.target.value,
                                                            )
                                                        }
                                                        ShowPasswordToggle={
                                                            showConfirmPasswordToggle
                                                        }
                                                        setShowPasswordToggle={
                                                            setShowConfirmPasswordToggle
                                                        }
                                                    />
                                                </div>

                                                {/* Buttons */}
                                                <div className="col-span-2 mt-4 flex items-center justify-center gap-4">
                                                    <PrimaryButton
                                                        Action={() => {
                                                            setCreateModalOpen(false);
                                                            setCreateData('name', '');

                                                            setCreateData('password', '');
                                                            setCreateData(
                                                                'password_confirmation',
                                                                '',
                                                            );
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
                                                        Text="Create User"
                                                        Spinner={createProcessing}
                                                        Disabled={
                                                            createProcessing ||
                                                            createData.name === '' ||
                                                            createData.password === '' ||
                                                            createData.password_confirmation ===
                                                                '' ||
                                                            createData.password !==
                                                                createData.password_confirmation
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
                                                        Edit User
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

                                                {editData.password != '' &&
                                                    editData.password_confirmation != '' &&
                                                    editData.password !=
                                                        editData.password_confirmation && (
                                                        <div className="col-span-2 mb-2 w-full rounded-xl border border-blue-300 bg-blue-50 px-5 py-4 text-sm text-blue-800 shadow-sm">
                                                            <div className="mb-1 text-base font-bold text-blue-700">
                                                                ℹ️ Info
                                                            </div>
                                                            <p>
                                                                Password And Confirm Password Does
                                                                Not Match
                                                            </p>
                                                        </div>
                                                    )}

                                                <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                                        InputName={'Password'}
                                                        Id={'password'}
                                                        Name={'password'}
                                                        Type={'password'}
                                                        Placeholder={'Enter Password'}
                                                        Required={false}
                                                        Error={editErrors.password}
                                                        Value={editData.password}
                                                        Action={(e) =>
                                                            setEditData('password', e.target.value)
                                                        }
                                                        ShowPasswordToggle={showPasswordToggle}
                                                        setShowPasswordToggle={
                                                            setShowPasswordToggle
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Confirm Password'}
                                                        Id={'password_confirmation'}
                                                        Name={'password_confirmation'}
                                                        Type={'password'}
                                                        Placeholder={'Enter Confirm Password'}
                                                        Required={false}
                                                        Error={editErrors.password_confirmation}
                                                        Value={editData.password_confirmation}
                                                        Action={(e) =>
                                                            setEditData(
                                                                'password_confirmation',
                                                                e.target.value,
                                                            )
                                                        }
                                                        ShowPasswordToggle={
                                                            showConfirmPasswordToggle
                                                        }
                                                        setShowPasswordToggle={
                                                            setShowConfirmPasswordToggle
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

                                                            setEditData('password', '');
                                                            setEditData(
                                                                'password_confirmation',
                                                                '',
                                                            );
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
                                                        Text="Update User"
                                                        Spinner={editProcessing}
                                                        Disabled={
                                                            editProcessing ||
                                                            editData.name === '' ||
                                                            (editData.password != '' &&
                                                                editData.password_confirmation ===
                                                                    '') ||
                                                            editData.password !=
                                                                editData.password_confirmation
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
