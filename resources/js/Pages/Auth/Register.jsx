
import Input from '@/Components/Input';
import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {

    // Toggle Show Password States
    const [showPasswordToggle, setshowPasswordToggle] = useState(false);
    const [showPasswordConfirmationToggle, setShowPasswordConfirmationToggle] = useState(false);


    // Register User Form Data
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });


    // Register User Form Request
    const submit = (e) => {
        e.preventDefault();


        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="flex flex-col flex-1 w-full lg:w-1/2 md:my-5">
                <div className="w-full max-w-md pt-10 mx-auto">
                    <Link
                        href={route("home")}
                        className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
                    >
                        <svg
                            className="stroke-current"
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                        >
                            <path
                                d="M12.7083 5L7.5 10.2083L12.7083 15.4167"
                                stroke=""
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Back to Website
                    </Link>
                </div>
                <div
                    className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto"
                >
                    <div>
                        <div className="mb-5 sm:mb-8">
                            <h1
                                className="mb-2 text-4xl font-bold text-gray-800 dark:text-white sm:text-title-md"
                            >
                                Register
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-white">
                                Create Your Account To Login Into The Dashboard !
                            </p>
                        </div>
                        <div>


                            <form onSubmit={submit}>
                                <div className="space-y-5">


                                    <Input
                                        InputName={"Name"}
                                        Error={errors.name}
                                        Value={data.name}
                                        Action={
                                            (e) => setData("name", e.target.value)
                                        }

                                        Placeholder={"John"}
                                        Id={"name"}
                                        Name={"name"}
                                        Type={"text"}
                                        Required={true}

                                    />


                                    <Input
                                        InputName={"Email"}
                                        Error={errors.email}
                                        Value={data.email}
                                        Action={
                                            (e) => setData("email", e.target.value)
                                        }

                                        Placeholder={"info@gmail.com"}
                                        Id={"email"}
                                        Name={"email"}
                                        Type={"email"}
                                        Required={true}

                                    />


                                    <Input
                                        InputName={"Password"}
                                        Error={errors.password}
                                        Value={data.password}
                                        Action={
                                            (e) => setData("password", e.target.value)
                                        }

                                        ShowPasswordToggle={showPasswordToggle}
                                        setShowPasswordToggle={setshowPasswordToggle}
                                        Placeholder={"Enter Your password"}
                                        Id={"password"}
                                        Name={"password"}
                                        Type={"password"}
                                        Required={true}


                                    />


                                    <Input
                                        InputName={"Confirm Password"}
                                        Error={errors.password_confirmation}
                                        Value={data.password_confirmation}
                                        Action={
                                            (e) => setData("password_confirmation", e.target.value)
                                        }

                                        ShowPasswordToggle={showPasswordConfirmationToggle}
                                        setShowPasswordToggle={setShowPasswordConfirmationToggle}
                                        Placeholder={"Enter  Confirm Password"}
                                        Id={"password_confirmation"}
                                        Name={"password_confirmation"}
                                        Type={"password"}
                                        Required={true}


                                    />



                                    <div>
                                        <PrimaryButton
                                            Text={"Register"}
                                            Disabled={(processing || data.name == "" || data.email == "" || data.password == "" || data.password_confirmation == "")}
                                            Type={"submit"}
                                            Icon={
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                        d="M16 14c2.21 0 4 1.79 4 4v2H4v-2c0-2.21 1.79-4 4-4h8zm0 0V9a4 4 0 10-8 0v5m8 0h6m-3-3v6" />
                                                </svg>

                                            }
                                            Spinner={processing}
                                        />
                                    </div>
                                </div>
                            </form>

                            <div className="mt-5">
                                <p
                                    className="text-sm font-normal text-center text-gray-700 dark:text-white sm:text-start"
                                >
                                    Already have an account? {" "}
                                    <Link
                                        href={route("login")}
                                        className="text-blue-500 hover:text-blue-600 "
                                    > {"  "}
                                        Login
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div >
                </div >
            </div >


        </GuestLayout >
    );
}
