import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BreadCrumb from '@/Components/BreadCrumb';
import { Head, useForm, usePage } from '@inertiajs/react';
import Table from '@/Components/Table';
import { useEffect, useState } from 'react';
import LinkButton from '@/Components/LinkButton';
import PrimaryButton from '@/Components/PrimaryButton';

export default function index({ units }) {
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

    const [columns, setColumns] = useState([]);

    useEffect(() => {
        const columns = [
            { key: 'name', label: 'Unit Name' },
            { key: 'added_at', label: 'Created At' },
        ];

        setColumns(columns);
    }, []);

    //   Unit Creation Modal  State
    const [CreateModalOpen, setCreateModalOpen] = useState(false);

    // Create Unit Request
    const {
        data: createUnit,
        setData: createUnitData,
        post: createUnitPost,
        processing: createUnitProcessing,
        errors: createUnitErrors,
        reset: createUnitReset,
    } = useForm({
        name: '',
    });

    // CreateUnitMethod
    const CreateUnitMethod = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Setups - Units" />

                <BreadCrumb
                    header={'Setups - Units'}
                    parent={'Dashboard'}
                    parent_link={route('dashboard')}
                    child={'Setups - Units'}
                />

                <Card
                    Content={
                        <>
                            <div className="my-3 flex flex-wrap justify-end">
                                <PrimaryButton
                                    CustomClass={'w-[200px]'}
                                    Text={'Create Unit'}
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
                                BulkDeleteRoute={'setups.units.deletebyselection'}
                                SingleDeleteRoute={'setups.units.destroy'}
                                items={units}
                                props={props}
                                columns={columns}
                                Search={false}
                            />

                            {/* Create Modal */}
                            <div className="border-t border-gray-100 p-6 dark:border-gray-800">
                                {CreateModalOpen && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 backdrop-blur-[32px]"
                                            onClick={() =>
                                                !createUnitProcessing && setCreateModalOpen(false)
                                            }
                                        ></div>

                                        {/* Modal content */}
                                        <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 sm:p-8">
                                            <div className="text-center">
                                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                                    Are You Sure?
                                                </h2>
                                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                    You won't be able to revert this action.
                                                </p>

                                                <div className="mt-6 flex items-center justify-center gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setCreateModalOpen(false);
                                                            createUnitReset();
                                                        }}
                                                        disabled={createUnitProcessing}
                                                        className={`inline-flex h-[50px] items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/10 ${createUnitProcessing ? 'cursor-not-allowed opacity-50' : ''}`}
                                                    >
                                                        Close
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
                                                    </button>

                                                    <PrimaryButton
                                                        Type="button"
                                                        Text="Yes Delete it!"
                                                        Spinner={createUnitProcessing}
                                                        Disabled={createUnitProcessing}
                                                        Action={CreateUnitMethod}
                                                        Icon={
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth="1.5"
                                                                stroke="currentColor"
                                                                className="size-6"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                                />
                                                            </svg>
                                                        }
                                                    />
                                                </div>
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
