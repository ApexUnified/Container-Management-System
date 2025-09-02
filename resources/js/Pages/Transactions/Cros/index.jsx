import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BreadCrumb from '@/Components/BreadCrumb';
import { Head, useForm, usePage } from '@inertiajs/react';
import Table from '@/Components/Table';
import { useEffect, useRef, useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import Input from '@/Components/Input';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
export default function index({ cros }) {
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
        cro_no: '',
        containers: '',
        date: '',
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
        cro_no: '',
        containers: '',
        date: '',
    });

    const [columns, setColumns] = useState([]);
    const [customActions, setCustomActions] = useState([]);

    //    Create Modal  State
    const [CreateModalOpen, setCreateModalOpen] = useState(false);

    //  Edit Modal State
    const [EditModalOpen, setEditModalOpen] = useState(false);

    useEffect(() => {
        const columns = [
            {
                label: 'CRO No',
                key: 'cro_no',
            },

            {
                label: 'Total Containers',
                key: 'containers_count',
            },

            {
                label: 'Date',
                key: 'date',
            },
        ];

        const actions = [
            {
                label: 'Edit',
                type: 'button',
                onClick: (item) => {
                    setEditModalOpen(true);
                    setEditData('id', item.id);
                    setEditData('cro_no', item.cro_no);
                    setEditData('containers_count', item.containers_count);
                    setEditData('date', item.date);
                },
            },
        ];

        setCustomActions(actions);
        setColumns(columns);
    }, []);

    const flatpickerForCreateForm = useRef(null);
    const flatpickerForEditForm = useRef(null);
    // flatpicker init useEffect
    useEffect(() => {
        setTimeout(() => {
            if (flatpickerForCreateForm.current) {
                flatpickr(flatpickerForCreateForm.current, {
                    dateFormat: 'Y-m-d',
                    disableMobile: true,
                    onChange: function (selectedDates, dateStr) {
                        if (selectedDates[0]) {
                            setCreateData('date', dateStr);
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
                            setEditData('date', dateStr);
                        }
                    },
                });
            }
        }, 500);
    }, [CreateModalOpen, EditModalOpen]);

    // CreateMethod
    const CreateMethod = (e) => {
        e.preventDefault();

        createPost(route('transactions.cros.store'), {
            onSuccess: () => {
                setCreateData('cro_no', '');
                setCreateData('containers_count', '');
                setCreateData('date', '');
            },
        });
    };

    // EditMethod
    const EditMethod = (e) => {
        e.preventDefault();
        editPut(route('transactions.cros.update', editData.id), {
            onSuccess: () => {
                setEditModalOpen(false);
                setEditData('id', '');
                setEditData('cro_no', '');
                setEditData('containers_count', '');
                setEditData('date', '');
            },
        });
    };

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Transactions - CRO" />

                <BreadCrumb
                    header={'Transactions - CRO'}
                    parent={'Dashboard'}
                    parent_link={route('dashboard')}
                    child={'Transactions - CRO'}
                />

                <Card
                    Content={
                        <>
                            <div className="flex flex-wrap justify-end my-3">
                                <PrimaryButton
                                    CustomClass={'mix-w-[200px]'}
                                    Text={'Create CRO'}
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
                                BulkDeleteRoute={'transactions.cros.destroybyselection'}
                                SingleDeleteRoute={'transactions.cros.destroy'}
                                items={cros}
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
                                                        Create CRO
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
                                                        InputName={'CRO No'}
                                                        Id={'cro_no'}
                                                        Name={'cro_no'}
                                                        Type={'text'}
                                                        Placeholder={'Enter CRO No'}
                                                        Required={true}
                                                        Error={createErrors.cro_no}
                                                        Value={createData.cro_no}
                                                        Action={(e) =>
                                                            setCreateData('cro_no', e.target.value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Containers'}
                                                        Id={'containers_count'}
                                                        Name={'containers_count'}
                                                        Type={'number'}
                                                        Placeholder={'Enter Containers Count'}
                                                        Required={true}
                                                        Error={createErrors.containers_count}
                                                        Value={createData.containers_count}
                                                        Action={(e) =>
                                                            setCreateData(
                                                                'containers_count',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Date'}
                                                        Id={'date'}
                                                        InputRef={flatpickerForCreateForm}
                                                        Name={'date'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Date'}
                                                        Required={true}
                                                        Error={createErrors.date}
                                                        Value={createData.date}
                                                        Action={(e) =>
                                                            setCreateData('date', e.target.value)
                                                        }
                                                    />
                                                </div>

                                                {/* Buttons */}
                                                <div className="flex items-center justify-center col-span-2 gap-4 mt-4">
                                                    <PrimaryButton
                                                        Action={() => {
                                                            setCreateModalOpen(false);
                                                            setCreateData('cro_no', '');
                                                            setCreateData('containers_count', '');
                                                            setCreateData('date', '');
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
                                                        Text="Save CRO"
                                                        Spinner={createProcessing}
                                                        Disabled={
                                                            createProcessing ||
                                                            createData.cro_no === '' ||
                                                            createData.containers_count === '' ||
                                                            createData.date === ''
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
                                                        Edit CRO
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
                                                        InputName={'CRO No'}
                                                        Id={'cro_no'}
                                                        Name={'cro_no'}
                                                        Type={'text'}
                                                        Placeholder={'Enter CRO No'}
                                                        Required={true}
                                                        Error={editErrors.cro_no}
                                                        Value={editData.cro_no}
                                                        Action={(e) =>
                                                            setEditData('cro_no', e.target.value)
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Containers'}
                                                        Id={'containers_count'}
                                                        Name={'containers_count'}
                                                        Type={'number'}
                                                        Placeholder={'Enter Containers Count'}
                                                        Required={true}
                                                        Error={editErrors.containers_count}
                                                        Value={editData.containers_count}
                                                        Action={(e) =>
                                                            setEditData(
                                                                'containers_count',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />

                                                    <Input
                                                        InputName={'Date'}
                                                        Id={'date'}
                                                        InputRef={flatpickerForEditForm}
                                                        Name={'date'}
                                                        Type={'text'}
                                                        Placeholder={'Enter Date'}
                                                        Required={true}
                                                        Error={editErrors.date}
                                                        Value={editData.date}
                                                        Action={(e) =>
                                                            setEditData('date', e.target.value)
                                                        }
                                                    />
                                                </div>

                                                {/* Buttons */}
                                                <div className="flex items-center justify-center col-span-2 gap-4 mt-4">
                                                    <PrimaryButton
                                                        Action={() => {
                                                            setEditModalOpen(false);
                                                            setEditData('id', '');
                                                            setEditData('cro_no', '');
                                                            setEditData('containers_count', '');
                                                            setEditData('date', '');
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
                                                        Text="Update CRO"
                                                        Spinner={editProcessing}
                                                        Disabled={
                                                            editProcessing ||
                                                            editData.cro_no === '' ||
                                                            editData.containers_count === '' ||
                                                            editData.date === ''
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
