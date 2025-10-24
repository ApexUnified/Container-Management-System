import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BreadCrumb from '@/Components/BreadCrumb';
import { Head, useForm, usePage } from '@inertiajs/react';
import Input from '@/Components/Input';
import PrimaryButton from '@/Components/PrimaryButton';

export default function index({ dubai_expense_setting }) {
    const {
        data: data,
        setData: setData,
        post: post,
        errors: errors,
        processing: processing,
    } = useForm({
        amount: dubai_expense_setting?.amount || '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('setups.dubai-expense-setting.save'));
    };

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Setups - Dubai Expense Setting" />

                <BreadCrumb
                    header={'Setups - Dubai Expense Setting'}
                    parent={'Dashboard'}
                    parent_link={route('dashboard')}
                    child={'Setups - Dubai Expense Setting'}
                />

                <Card
                    Content={
                        <>
                            <form onSubmit={submit}>
                                <div className="flex items-center gap-2 px-10 mx-auto mt-4">
                                    <Input
                                        InputName={'Amount'}
                                        Id={'amount'}
                                        Name={'amount'}
                                        Type={'number'}
                                        Placeholder={'Enter Amount'}
                                        Required={true}
                                        Error={errors.amount}
                                        Value={data.amount}
                                        Action={(e) => setData('amount', e.target.value)}
                                    />
                                </div>
                                <PrimaryButton
                                    Disabled={
                                        processing ||
                                        data.amount === '' ||
                                        data.amount === dubai_expense_setting?.amount
                                    }
                                    Spinner={processing}
                                    CustomClass={'mx-auto mt-0 flex items-center gap-2'}
                                    Text={'Save Dubai Expense Setting'}
                                    Type={'submit'}
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
                            </form>
                        </>
                    }
                />
            </AuthenticatedLayout>
        </>
    );
}
