import Card from '@/Components/Card'
import FileUploaderInput from '@/Components/FileUploaderInput'
import Input from '@/Components/Input'
import PrimaryButton from '@/Components/PrimaryButton'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import BreadCrumb from '@/Components/BreadCrumb'
import { Head, useForm, usePage } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'

export default function index({ generalSetting }) {


    // Update General Setting Form Data
    const { data, setData, post, processing, errors, progress, reset } = useForm({
        _method: "PUT",
        app_name: generalSetting?.app_name || "",
        contact_email: generalSetting?.contact_email || "",
        contact_number: generalSetting?.contact_number || "",
        app_main_logo_dark: null,
        is_removed_app_main_logo_dark: false,
        app_main_logo_light: null,
        is_removed_app_main_logo_light: false,
        app_favicon: null,
        is_removed_app_favicon: false,
    });


    // Optional for Tracking File Upload Status
    // useEffect(() => {
    //     // console.log(progress);
    // }, [progress]);


    // Update General Setting Form Request
    const submit = (e) => {
        e.preventDefault();
        post(route("settings.general.setting.update"),
            {
                forceFormData: true,
                preserveScroll: true,

                onSuccess: () => {
                    reset("app_favicon", "app_main_logo_dark", "app_main_logo_light");
                }
            });
    }

    return (
        <>
            <AuthenticatedLayout>

                <Head title='General Setting' />

                <BreadCrumb
                    header={"General Setting"}
                    parent={"Settings"}
                    parent_link={route("settings.index")}
                    child={"General Setting"}
                />

                <Card
                    Content={
                        <>
                            <form onSubmit={submit}>
                                <div className="w-full px-4 mb-4 sm:px-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">

                                        <Input
                                            InputName={"Application Name"}
                                            Placeholder={"Enter Application Name"}
                                            Name={"app_name"}
                                            Id={"app_name"}
                                            Type={"text"}
                                            Required={true}
                                            Action={(e) => setData("app_name", e.target.value)}
                                            Value={data.app_name}
                                            Error={errors.app_name}

                                        />


                                        <Input
                                            InputName={"Contact Email"}
                                            Placeholder={"Enter Contact Email"}
                                            Name={"contact_email"}
                                            Id={"contact_email"}
                                            Type={"email"}
                                            Required={true}
                                            Action={(e) => setData("contact_email", e.target.value)}
                                            Value={data.contact_email}
                                            Error={errors.contact_email}

                                        />


                                    </div>
                                </div>



                                <div className="w-full px-4 mb-4 sm:px-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">

                                        <Input
                                            InputName={"Contact Number"}
                                            Placeholder={"Enter Contact Number"}
                                            Name={"contact_number"}
                                            Id={"contact_number"}
                                            Type={"number"}
                                            Required={true}
                                            Value={data.contact_number}
                                            Action={(e) => setData("contact_number", e.target.value)}
                                            Error={errors.contact_number}
                                            CustomCss={"lg:w-1/2"}

                                        />

                                    </div>
                                </div>





                                <div className="w-full px-4 mb-4 sm:px-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                                        <FileUploaderInput
                                            Label={'Drag & Drop your Application Logo For Dark Mode or <span class="filepond--label-action">Browse</span>'}
                                            Error={errors.app_main_logo_dark}
                                            Id={"app_main_logo_dark"}
                                            InputName={"App Main Logo For Dark Mode"}
                                            onUpdate={(file) => {
                                                if (file.length > 0) {
                                                    if (file[0].isNew) {
                                                        setData("app_main_logo_dark", file[0].file);
                                                        setData("is_removed_app_main_logo_dark", false);
                                                    }
                                                } else {
                                                    generalSetting?.app_main_logo_dark &&
                                                        setData("is_removed_app_main_logo_dark", true);
                                                    setData("app_main_logo_dark", null);
                                                }

                                            }}
                                            Multiple={false}
                                            DefaultFile={generalSetting?.app_main_logo_dark_url
                                                && [generalSetting?.app_main_logo_dark_url]}
                                        />



                                        <FileUploaderInput
                                            Label={'Drag & Drop your Application Logo For Light Mode or <span class="filepond--label-action">Browse</span>'}
                                            Error={errors.app_main_logo_light}
                                            Id={"app_main_logo_light"}
                                            InputName={"App Main Logo For Light Mode"}
                                            onUpdate={(file) => {
                                                if (file.length > 0) {
                                                    if (file[0].isNew) {
                                                        setData("app_main_logo_light", file[0].file);
                                                        setData("is_removed_app_main_logo_light", false);
                                                    }
                                                } else {
                                                    generalSetting?.app_main_logo_light &&
                                                        setData("is_removed_app_main_logo_light", true);
                                                    setData("app_main_logo_light", null);

                                                }


                                            }}
                                            Multiple={false}
                                            DefaultFile={generalSetting?.app_main_logo_light_url &&
                                                [generalSetting?.app_main_logo_light_url]}
                                        />



                                    </div>
                                </div>


                                <div className="w-full px-4 mb-4 sm:px-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">



                                        <FileUploaderInput
                                            Label={'Drag & Drop your favicon or <span class="filepond--label-action">Browse</span>'}
                                            Error={errors.app_favicon}
                                            Id={"app_favicon"}
                                            InputName={"App Favicon"}
                                            onUpdate={(file) => {
                                                if (file.length > 0) {
                                                    if (file[0].isNew) {
                                                        setData("app_favicon", file[0].file);
                                                        setData("is_removed_app_favicon", false);
                                                    }
                                                } else {
                                                    generalSetting?.app_favicon &&
                                                        setData("is_removed_app_favicon", true);
                                                    setData("app_favicon", null);
                                                }

                                            }}
                                            Multiple={false}
                                            DefaultFile={generalSetting?.app_favicon_url && [generalSetting?.app_favicon_url]}

                                        />


                                    </div>
                                </div>



                                <div className="mx-4 w-60">
                                    <PrimaryButton
                                        Text={"Save Changes"}
                                        Spinner={processing}
                                        Disabled={
                                            (
                                                processing
                                                || data.app_name === ""
                                                || data.contact_email === ""
                                                || data.contact_number === ""
                                                ||
                                                data.app_name === generalSetting?.app_name
                                                && data.contact_email === generalSetting?.contact_email
                                                && data.contact_number === generalSetting?.contact_number
                                                && data.app_favicon === null
                                                && data.app_main_logo_dark === null
                                                && data.app_main_logo_light === null
                                                && !data.is_removed_app_favicon
                                                && !data.is_removed_app_main_logo_dark
                                                && !data.is_removed_app_main_logo_light

                                            )
                                        }
                                        Type={"submit"}
                                        Icon={
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                            </svg>
                                        }
                                    />
                                </div>

                            </form>
                        </>
                    }
                />

            </AuthenticatedLayout>
        </>
    )
}
