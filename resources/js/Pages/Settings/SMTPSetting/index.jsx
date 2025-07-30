import Card from '@/Components/Card'
import Input from '@/Components/Input'
import PrimaryButton from '@/Components/PrimaryButton'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import BreadCrumb from '@/Components/BreadCrumb'
import { Head, useForm } from '@inertiajs/react'
import React, { useState } from 'react'

export default function index({ smtpSetting }) {


    // Update SMTP Setting Form Data
    const { data, setData, put, processing, errors } = useForm({
        smtp_mailer: smtpSetting?.smtp_mailer || "",
        smtp_scheme: smtpSetting?.smtp_scheme || "",
        smtp_host: smtpSetting?.smtp_host || "",
        smtp_port: smtpSetting?.smtp_port || "",
        smtp_username: smtpSetting?.smtp_username || "",
        smtp_password: smtpSetting?.smtp_password || "",
        smtp_mail_from_address: smtpSetting?.smtp_mail_from_address || "",
    });



    // Show Password Toggle State
    const [smtpPasswordToggle, setSmtpPasswordToggle] = useState(false);





    // Update SMTP Setting Form Request
    const submit = (e) => {
        e.preventDefault();
        put(route("settings.smtp.setting.update"));
    }
    return (
        <>
            <AuthenticatedLayout>

                <Head title="SMTP Setting" />


                <BreadCrumb
                    header={"SMTP Setting"}
                    parent={"Settings"}
                    parent_link={route("settings.index")}
                    child={"SMTP Setting"}
                />

                <Card
                    Content={
                        <>

                            <form onSubmit={submit}>

                                <div className="w-full px-4 mb-4 sm:px-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">

                                        <Input
                                            InputName={"SMTP Mailer"}
                                            Placeholder={"Enter SMTP Mailer"}
                                            Name={"smtp_mailer"}
                                            Id={"smtp_mailer"}
                                            Type={"text"}
                                            Required={true}
                                            Action={(e) => setData("smtp_mailer", e.target.value)}
                                            Value={data.smtp_mailer}
                                            Error={errors.smtp_mailer}

                                        />


                                        <Input
                                            InputName={"SMTP Scheme"}
                                            Placeholder={"Enter SMTP Scheme"}
                                            Name={"smtp_scheme"}
                                            Id={"smtp_scheme"}
                                            Type={"text"}
                                            Required={true}
                                            Action={(e) => setData("smtp_scheme", e.target.value)}
                                            Value={data.smtp_scheme}
                                            Error={errors.smtp_scheme}

                                        />


                                    </div>
                                </div>



                                <div className="w-full px-4 mb-4 sm:px-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">

                                        <Input
                                            InputName={"SMTP Host"}
                                            Placeholder={"Enter SMTP Host"}
                                            Name={"smtp_host"}
                                            Id={"smtp_host"}
                                            Type={"text"}
                                            Required={true}
                                            Action={(e) => setData("smtp_host", e.target.value)}
                                            Value={data.smtp_host}
                                            Error={errors.smtp_host}

                                        />


                                        <Input
                                            InputName={"SMTP Port"}
                                            Placeholder={"Enter SMTP Port"}
                                            Name={"smtp_port"}
                                            Id={"smtp_port"}
                                            Type={"text"}
                                            Required={true}
                                            Action={(e) => setData("smtp_port", e.target.value)}
                                            Value={data.smtp_port}
                                            Error={errors.smtp_port}

                                        />


                                    </div>
                                </div>


                                <div className="w-full px-4 mb-4 sm:px-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">

                                        <Input
                                            InputName={"SMTP Username"}
                                            Placeholder={"Enter SMTP Username"}
                                            Name={"smtp_username"}
                                            Id={"smtp_username"}
                                            Type={"email"}
                                            Required={true}
                                            Action={(e) => setData("smtp_username", e.target.value)}
                                            Value={data.smtp_username}
                                            Error={errors.smtp_username}

                                        />


                                        <Input
                                            InputName={"SMTP Password"}
                                            Placeholder={"Enter SMTP Password"}
                                            Name={"smtp_password"}
                                            Id={"smtp_password"}
                                            Type={"password"}
                                            Required={true}
                                            Action={(e) => setData("smtp_password", e.target.value)}
                                            Value={data.smtp_password}
                                            Error={errors.smtp_password}
                                            ShowPasswordToggle={smtpPasswordToggle}
                                            setShowPasswordToggle={setSmtpPasswordToggle}

                                        />


                                    </div>
                                </div>


                                <div className="w-full px-4 mb-4 sm:px-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">

                                        <Input
                                            InputName={"SMTP Mail From Address"}
                                            Placeholder={"Enter SMTP Mail From Address"}
                                            Name={"smtp_mail_from_address"}
                                            Id={"smtp_mail_from_address"}
                                            Type={"email"}
                                            Required={true}
                                            Action={(e) => setData("smtp_mail_from_address", e.target.value)}
                                            Value={data.smtp_mail_from_address}
                                            Error={errors.smtp_mail_from_address}
                                            CustomCss={"lg:w-1/2"}

                                        />

                                    </div>
                                </div>



                                <div className="mx-4 w-60">
                                    <PrimaryButton
                                        Text={"Save Changes"}
                                        Spinner={processing}
                                        Disabled={
                                            processing ||
                                            (
                                                (data.smtp_mailer === '' ||
                                                    data.smtp_scheme === '' ||
                                                    data.smtp_host === '' ||
                                                    data.smtp_port === '' ||
                                                    data.smtp_username === '' ||
                                                    data.smtp_password === '' ||
                                                    data.smtp_mail_from_address === '') ||

                                                (
                                                    smtpSetting &&
                                                    data.smtp_mailer === smtpSetting.smtp_mailer &&
                                                    data.smtp_scheme === smtpSetting.smtp_scheme &&
                                                    data.smtp_host === smtpSetting.smtp_host &&
                                                    data.smtp_port === smtpSetting.smtp_port &&
                                                    data.smtp_username === smtpSetting.smtp_username &&
                                                    data.smtp_password === smtpSetting.smtp_password &&
                                                    data.smtp_mail_from_address === smtpSetting.smtp_mail_from_address
                                                )
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
