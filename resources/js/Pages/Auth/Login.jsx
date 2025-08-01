import Card from '@/Components/Card';
import Input from '@/Components/Input';
import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Login() {
    // Toggle Show Password State
    const [ShowPasswordToggle, setShowPasswordToggle] = useState(false);

    const { asset } = usePage().props;
    // Login User Form Data
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        password: '',
        remember: false,
    });

    // Application Logo Sate With Default Images
    const [ApplicationLogoLight, setApplicationLogoLight] = useState(
        asset + 'assets/images/Logo/ApplicationLogoLight.png',
    );
    const [ApplicationLogoDark, setApplicationLogoDark] = useState(
        asset + 'assets/images/Logo/ApplicationLogoDark.png',
    );

    // Login User Form Request
    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="min-h-screen overflow-y-auto scrollbar-hide">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="mx-auto w-full rounded-2xl border border-gray-200 bg-white p-5 pt-5 dark:border-gray-800 dark:bg-gray-800 sm:w-[400px]">
                        <div className="flex items-center justify-center mb-5">
                            <img
                                src={ApplicationLogoDark}
                                alt="Logo"
                                className="hidden w-40 dark:block"
                                loading="lazy"
                            />

                            <img
                                src={ApplicationLogoLight}
                                alt="Logo"
                                className="w-40 dark:hidden"
                                loading="lazy"
                            />
                        </div>

                        <form onSubmit={submit}>
                            <div className="space-y-5">
                                <Input
                                    InputName={'Name'}
                                    Error={errors.name}
                                    Value={data.name}
                                    Action={(e) => setData('name', e.target.value)}
                                    Placeholder={'Enter Your User Name'}
                                    Id={'name'}
                                    Name={'name'}
                                    Type={'text'}
                                    Required={true}
                                />

                                <Input
                                    InputName={'Password'}
                                    Error={errors.password}
                                    Value={data.password}
                                    Action={(e) => setData('password', e.target.value)}
                                    ShowPasswordToggle={ShowPasswordToggle}
                                    setShowPasswordToggle={setShowPasswordToggle}
                                    Placeholder={'Enter Your password'}
                                    Id={'password'}
                                    Name={'password'}
                                    Type={'password'}
                                    Required={true}
                                />

                                <div className="flex items-center justify-between">
                                    <div>
                                        <label
                                            htmlFor="remember"
                                            className="flex items-center text-sm font-normal text-gray-700 cursor-pointer select-none dark:text-white"
                                        >
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    id="remember"
                                                    className="sr-only"
                                                    value={data.remember}
                                                    onChange={() =>
                                                        setData('remember', !data.remember)
                                                    }
                                                />
                                                <div
                                                    className={
                                                        data.remember === true
                                                            ? 'mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px] border-blue-500 bg-blue-500 dark:border-gray-700'
                                                            : "'bg-transparent mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px] border-gray-300"
                                                    }
                                                >
                                                    <span
                                                        className={data.remember ? '' : 'opacity-0'}
                                                    >
                                                        <svg
                                                            width="14"
                                                            height="14"
                                                            viewBox="0 0 14 14"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                                                                stroke="white"
                                                                strokeWidth="1.94437"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                            Keep me logged in
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <PrimaryButton
                                        Text={'Login'}
                                        Disabled={
                                            processing || data.name === '' || data.password === ''
                                        }
                                        Type={'submit'}
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
                                                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                                                />
                                            </svg>
                                        }
                                        Spinner={processing}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
