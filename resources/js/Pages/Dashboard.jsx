import Card from '@/Components/Card';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';

export default function Dashboard({
    total_users,
    total_vendors,
    total_units,
    total_shipping_lines,
    total_transporters,
    total_products,
    total_custom_clearances,
}) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <Card
                Content={
                    <>
                        <div className="my-8 text-center">
                            <h3 className="font-outfit text-4xl font-bold text-gray-800 transition-colors duration-300 dark:text-white lg:text-6xl">
                                <span className="text-gray-400">H</span>
                                <span className="text-gray-600 dark:text-gray-300">
                                    asnain Enterprises
                                </span>
                            </h3>
                            <p className="mt-2 text-lg font-light text-gray-500 dark:text-gray-400 lg:text-xl">
                                Delivering Excellence with Integrity
                            </p>
                        </div>

                        <div className="my-10 grid grid-cols-1 gap-5 md:grid-cols-3">
                            <Card
                                Content={
                                    <>
                                        <div className="flex h-auto min-h-[200px] cursor-pointer flex-wrap items-center justify-between rounded-2xl bg-slate-50 p-6 shadow-md transition-all duration-500 hover:scale-105 dark:bg-gray-800">
                                            {/* Left Side: Title */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                                    Users
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Total registered Users
                                                </p>
                                            </div>

                                            {/* Right Side: Icon with Count */}
                                            <div className="flex items-center space-x-2">
                                                {/* Icon */}
                                                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="size-6 text-blue-600 dark:text-blue-300"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                                                        />
                                                    </svg>
                                                </div>
                                                {/* Count */}
                                                <span className="text-xl font-bold text-gray-800 dark:text-white">
                                                    {total_users}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                }
                            />
                            <Card
                                Content={
                                    <>
                                        <div className="flex h-auto min-h-[200px] cursor-pointer flex-wrap items-center justify-between rounded-2xl bg-slate-50 p-6 shadow-md transition-all duration-500 hover:scale-105 dark:bg-gray-800">
                                            {/* Left Side: Title */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                                    Vendors
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Total Vendors
                                                </p>
                                            </div>

                                            {/* Right Side: Icon with Count */}
                                            <div className="flex items-center space-x-2">
                                                {/* Icon */}
                                                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="size-6 text-blue-600 dark:text-blue-300"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                                                        />
                                                    </svg>
                                                </div>
                                                {/* Count */}
                                                <span className="text-xl font-bold text-gray-800 dark:text-white">
                                                    {total_vendors}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                }
                            />

                            <Card
                                Content={
                                    <>
                                        <div className="flex h-auto min-h-[200px] cursor-pointer flex-wrap items-center justify-between rounded-2xl bg-slate-50 p-6 shadow-md transition-all duration-500 hover:scale-105 dark:bg-gray-800">
                                            {/* Left Side: Title */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                                    Units
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Total Units
                                                </p>
                                            </div>

                                            {/* Right Side: Icon with Count */}
                                            <div className="flex items-center space-x-2">
                                                {/* Icon */}
                                                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="size-6 text-blue-600 dark:text-blue-300"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M20 12l-8 4-8-4m16-4l-8 4-8-4m8-4l8 4-8 4-8-4 8-4z"
                                                        />
                                                    </svg>
                                                </div>
                                                {/* Count */}
                                                <span className="text-xl font-bold text-gray-800 dark:text-white">
                                                    {total_units}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                }
                            />

                            <Card
                                Content={
                                    <>
                                        <div className="flex h-auto min-h-[200px] cursor-pointer flex-wrap items-center justify-between rounded-2xl bg-slate-50 p-6 shadow-md transition-all duration-500 hover:scale-105 dark:bg-gray-800">
                                            {/* Left Side: Title */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                                    Shipping Lines
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Total Shipping Lines
                                                </p>
                                            </div>

                                            {/* Right Side: Icon with Count */}
                                            <div className="flex items-center space-x-2">
                                                {/* Icon */}
                                                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="size-6 text-blue-600 dark:text-blue-300"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                                                        />
                                                    </svg>
                                                </div>
                                                {/* Count */}
                                                <span className="text-xl font-bold text-gray-800 dark:text-white">
                                                    {total_shipping_lines}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                }
                            />

                            <Card
                                Content={
                                    <>
                                        <div className="flex h-auto min-h-[200px] cursor-pointer flex-wrap items-center justify-between rounded-2xl bg-slate-50 p-6 shadow-md transition-all duration-500 hover:scale-105 dark:bg-gray-800">
                                            {/* Left Side: Title */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                                    Transporters
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Total Transporters
                                                </p>
                                            </div>

                                            {/* Right Side: Icon with Count */}
                                            <div className="flex items-center space-x-2">
                                                {/* Icon */}
                                                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="size-6 text-blue-600 dark:text-blue-300"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                                                        />
                                                    </svg>
                                                </div>
                                                {/* Count */}
                                                <span className="text-xl font-bold text-gray-800 dark:text-white">
                                                    {total_transporters}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                }
                            />

                            <Card
                                Content={
                                    <>
                                        <div className="flex h-auto min-h-[200px] cursor-pointer flex-wrap items-center justify-between rounded-2xl bg-slate-50 p-6 shadow-md transition-all duration-500 hover:scale-105 dark:bg-gray-800">
                                            {/* Left Side: Title */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                                    Products
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Total Products
                                                </p>
                                            </div>

                                            {/* Right Side: Icon with Count */}
                                            <div className="flex items-center space-x-2">
                                                {/* Icon */}
                                                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="size-6 text-blue-600 dark:text-blue-300"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                                        />
                                                    </svg>
                                                </div>
                                                {/* Count */}
                                                <span className="text-xl font-bold text-gray-800 dark:text-white">
                                                    {total_products}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                }
                            />

                            <Card
                                Content={
                                    <>
                                        <div className="flex h-auto min-h-[200px] cursor-pointer flex-wrap items-center justify-between rounded-2xl bg-slate-50 p-6 shadow-md transition-all duration-500 hover:scale-105 dark:bg-gray-800">
                                            {/* Left Side: Title */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                                    Custom Clearances
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Total Custom Clearances
                                                </p>
                                            </div>

                                            {/* Right Side: Icon with Count */}
                                            <div className="flex items-center space-x-2">
                                                {/* Icon */}
                                                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="size-6 text-blue-600 dark:text-blue-300"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                                                        />
                                                    </svg>
                                                </div>
                                                {/* Count */}
                                                <span className="text-xl font-bold text-gray-800 dark:text-white">
                                                    {total_custom_clearances}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                }
                            />
                        </div>
                    </>
                }
            />
        </AuthenticatedLayout>
    );
}
