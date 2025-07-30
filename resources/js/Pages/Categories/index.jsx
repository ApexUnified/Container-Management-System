import Card from '@/Components/Card';
import LinkButton from '@/Components/LinkButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BreadCrumb from '@/Components/BreadCrumb';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import Table from '@/Components/Table';
import { Label } from '@headlessui/react';
import { useEffect, useState } from 'react';

export default function index({ categories }) {
    // Bulk Delete Form Data
    const { props } = usePage();
    const {
        data: BulkselectedIds,
        setData: setBulkSelectedIds,
        delete: BulkDelete,
        reset: resetBulkSelectedIds,
    } = useForm({
        ids: [],
    });

    // Single Delete Form Data
    const {
        data: SingleSelectedId,
        setData: setSingleSelectedId,
        delete: SingleDelete,
        reset: resetSingleSelectedId,
    } = useForm({
        id: null,
    });

    const [columns, setColumns] = useState([]);
    const [customActions, setCustomActions] = useState([]);

    // Also You Can Add Custom Search Inputs In The Table Via its Props Below Are The Example Of States
    // Custom Search States

    // (

    // These States Will Be Used For Selecting Values From Inputs After Search Happens So Its Good For Maintaing Previous State of Inputs
    // And Also These States Will Be Passed To Table Component As Props Of Search params that will go to backend after search happens
    // You Can Modify it By Adding New Props To Table Component

    // const [instructor_id, setInstructor_id] = useState(props.instructor_id ?? '');
    // const [category_id, setCategory_id] = useState(props.category_id ?? '');

    // )

    // This State Will Be Responsible For Triggering Search Whenever Custom Search Inputs Value Changes
    // Its By Default is False When  Input Value Changes It Will Be True  And Search Happens
    // const [ParentSearched, setParentSearched] = useState(false);

    useEffect(() => {
        const columns = [
            //  If you want to display a badge for a column, you can simply add a badge key to the column definition.
            // The badge key should be a callback function that receives the column's value and returns a string
            //     Example:
            //     {
            //    label: 'Status',
            //    key: 'status',
            //   badge: (value) => value === 'active' && 'bg-green-100 text-green-800 dark:text-white/90 dark:bg-green-900',
            // }
            // This will apply the provided classes to the badge based on the value of the column.

            { key: 'name', label: 'Category Name' },
            { key: 'added_at', label: 'Created At' },

            // This Column Can be use For Displaying Profile Image You Can Modify By your Own Need
            {
                label: 'Demo user Profile',
                profile: true,
                key: 'profile',
                default: 'Default',
            },

            {
                label: 'Demo Column',
                key: 'Demo Column',
                render: (item) => (
                    <div className="flex gap-2">
                        <span>ID: {item.id}</span>
                        <button
                            className="text-blue-500 hover:underline"
                            onClick={() => alert(`Clicked ${item.name} (ID: ${item.id})`)}
                        >
                            View Details
                        </button>
                    </div>
                ),
            },

            // If You Want to Render Custom HTML: Custom HTML with item data
            //   {
            //     label: 'Details',
            //     key: 'details',
            //     render: (item) => (
            //       <div className="flex gap-2">
            //         <span>ID: {item.id}</span>
            //         <button
            //           className="text-blue-500 hover:underline"
            //           onClick={() => alert(`Clicked ${item.name} (ID: ${item.id})`)}
            //         >
            //           View Details
            //         </button>
            //       </div>
            //     ),
            //   },
        ];

        // It Will Add Action in The Dropdown Of Action in The Table
        const customActions = [
            // Appending Button in Action Dropdon Example
            {
                label: 'Button',
                type: 'button',
                onClick: (item) => alert('it I am Button ' + item.id), //router.visit(route("courses.show", item.id))
            },

            // Appending Anchor in Action Dropdon Example
            {
                label: 'Href',
                type: 'link',
                href: (item) => route('category.index'),
            },
        ];

        setCustomActions(customActions);
        setColumns(columns);
    }, []);

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Category" />

                <BreadCrumb
                    header={'Category'}
                    parent={'Dashboard'}
                    parent_link={route('dashboard')}
                    child={'Category'}
                />

                <Card
                    Content={
                        <>
                            <div className="my-3 flex flex-wrap justify-end">
                                <LinkButton
                                    Text={'Create Category'}
                                    URL={route('category.create')}
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
                                EditRoute={'category.edit'}
                                BulkDeleteRoute={'category.deletebyselection'}
                                SearchRoute={'category.index'}
                                SingleDeleteRoute={'category.destroy'}
                                items={categories}
                                props={props}
                                customActions={customActions}
                                columns={columns}
                            />

                            {/* This Is DemoTable With More Custom Props You Can Explore All Props In Table Component */}
                            {/* <Table
                                setBulkSelectedIds={setBulkSelectedIds}
                                setSingleSelectedId={setSingleSelectedId}
                                SingleSelectedId={SingleSelectedId}
                                resetBulkSelectedIds={resetBulkSelectedIds}
                                resetSingleSelectedId={resetSingleSelectedId}
                                BulkDeleteMethod={BulkDelete}
                                SingleDeleteMethod={SingleDelete}
                                EditRoute={"courses.edit"}
                                BulkDeleteRoute={"courses.destroybyselection"}
                                SearchRoute={"courses.index"}
                                SingleDeleteRoute={"courses.destroy"}
                                ViewRoute={"courses.show"}
                                items={courses}
                                props={props}
                                columns={columns}

                                This is Responsible For Handling When Search Will Happen
                                ParentSearched={ParentSearched}

                                As I Told Earlier This Prop Will Be Use For Sending Searched Params To Search Route (Backend)
                                searchProps={{ instructor_id: instructor_id, category_id: category_id }}

                                This Prop Will Render Custom Search Inputs
                                customSearch={
                                    <>
                                        <div className="relative mb-2">
                                            <SelectInput
                                                Id={'category_id'}
                                                Name={'category_id'}
                                                InputName={'Category'}
                                                items={categories}
                                                itemKey={'name'}
                                                Value={category_id}
                                                Action={(e) => {
                                                    const value = e.target.value;
                                                    setCategory_id(value);
                                                    setParentSearched(true);
                                                }}
                                            />

                                        </div>


                                        <div className="relative mb-2">
                                            <SelectInput
                                                Id={'instructor_id'}
                                                Name={'instructor_id'}
                                                InputName={'Instructor'}
                                                items={instructors}
                                                itemKey={'name'}
                                                Value={instructor_id}
                                                Action={(e) => {
                                                    const value = e.target.value;
                                                    setInstructor_id(value);
                                                    setParentSearched(true);
                                                }}
                                            />

                                        </div>
                                    </>
                                }
                                This Will Show Custom Actions In The Table And Will Add Custom Actions In the action dropdown
                                customActions={customActions}
                            /> */}
                        </>
                    }
                />
            </AuthenticatedLayout>
        </>
    );
}
