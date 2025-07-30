import Card from '@/Components/Card';
import { PlaceholderPattern } from '@/Components/PlaceholderPattern';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <Card
                Content={
                    <>

                        <div className="grid grid-cols-1 gap-5 my-10 sm:grid-cols-2 md:grid-cols-4">

                            <Card
                                Content={
                                    <>

                                        <div className="relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-900 p-6 min-h-[200px]">
                                            <PlaceholderPattern />
                                        </div>


                                    </>
                                }
                                CustomCss="w-full p-3 min-h-[200px] bg-gray-900/10 dark:bg-gray-800"
                            />
                            <Card
                                Content={
                                    <>

                                        <div className="relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-900 p-6 min-h-[200px]">
                                            <PlaceholderPattern />
                                        </div>


                                    </>
                                }
                                CustomCss="w-full p-3 min-h-[200px] bg-gray-900/10 dark:bg-gray-800"
                            />

                            <Card
                                Content={
                                    <>

                                        <div className="relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-900 p-6 min-h-[200px]">
                                            <PlaceholderPattern />
                                        </div>


                                    </>
                                }
                                CustomCss="w-full p-3 min-h-[200px] bg-gray-900/10 dark:bg-gray-800"
                            />

                            <Card
                                Content={
                                    <>

                                        <div className="relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-900 p-6 min-h-[200px]">
                                            <PlaceholderPattern />
                                        </div>


                                    </>
                                }
                                CustomCss="w-full p-3 min-h-[200px] bg-gray-900/10 dark:bg-gray-800"
                            />



                            <div className="md:col-span-2">
                                <Card
                                    Content={
                                        <>
                                            <div className="relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-900 p-6 min-h-[300px]">
                                                <PlaceholderPattern />
                                            </div>
                                        </>
                                    }
                                    CustomCss="w-full p-3 min-h-[300px] bg-gray-900/10 dark:bg-gray-800"
                                />
                            </div>


                            <div className="md:col-span-2">
                                <Card
                                    Content={
                                        <>
                                            <div className="relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-900 p-6 min-h-[300px]">
                                                <PlaceholderPattern />
                                            </div>
                                        </>
                                    }
                                    CustomCss="w-full p-3 min-h-[300px] bg-gray-900/10 dark:bg-gray-800"
                                />
                            </div>



                            <div className="md:col-span-4">
                                <Card
                                    Content={
                                        <>
                                            <div className="relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-900 p-6 min-h-[500px]">
                                                <PlaceholderPattern />
                                            </div>
                                        </>
                                    }
                                    CustomCss="w-full p-3 min-h-[500px] bg-gray-900/10 dark:bg-gray-800"
                                />
                            </div>
                        </div>


                    </>
                }
            />
        </AuthenticatedLayout>
    );
}
