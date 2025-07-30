import Card from '@/Components/Card';
import Input from '@/Components/Input';
import LinkButton from '@/Components/LinkButton';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BreadCrumb from '@/Components/BreadCrumb';
import { Head, useForm } from '@inertiajs/react';
import React from 'react'

export default function edit({ category }) {


    // Edit Data Form Data
    const { data, setData, put, processing, errors, reset } = useForm({
        name: category.name || '',
    });

    // Edit Data Form Request
    const submit = (e) => {
        e.preventDefault();
        put(route("category.update", category.id));
    }

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Category" />

                <BreadCrumb
                    header={"Edit Category"}
                    parent={"Category"}
                    parent_link={route("category.index")}
                    child={"Edit Category"}
                />

                <Card
                    Content={<>
                        <div className="flex flex-wrap justify-end my-3">
                            <LinkButton
                                Text={"Back To Categories"}
                                URL={route("category.index")}
                                Icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                                    </svg>


                                }
                            />
                        </div>

                        <form onSubmit={submit}>
                            <div className="rounded-2xl border border-gray-200 bg-white pt-4 dark:border-gray-800 dark:bg-white/[0.03]">

                                <div className="flex flex-col gap-2 px-5 mb-4 sm:flex-row sm:items-center sm:px-6">

                                    <Input
                                        InputName={"Category Name"}
                                        Error={errors.name}
                                        Value={data.name}
                                        Action={
                                            (e) => setData("name", e.target.value)
                                        }

                                        Placeholder={"Enter Category Name"}
                                        Id={"name"}
                                        Name={"name"}
                                        Type={"text"}
                                        CustomCss={"lg:w-1/2 sm:w-full"}

                                    />


                                </div>

                                <PrimaryButton
                                    Text={"Update Category"}
                                    Type={"submit"}
                                    CustomClass={"w-[200px] mx-5 mt-10"}
                                    Disabled={(processing || data.name === "" || data.name === category.name)}
                                    Spinner={processing}
                                    Icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                        </svg>

                                    }

                                />


                            </div>

                        </form>
                    </>}
                />
            </AuthenticatedLayout>
        </>
    )
}
