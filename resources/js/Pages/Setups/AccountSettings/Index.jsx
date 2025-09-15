import BreadCrumb from '@/Components/BreadCrumb';
import Card from '@/Components/Card';
import Input from '@/Components/Input';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
export default function Index({ account_setting }) {
    const { data, setData, post, processing, errors } = useForm({
        vendor_expense_code: account_setting?.vendor_expense_code || '',
        transporter_expense_code: account_setting?.transporter_expense_code || '',
        custom_clearance_expense_code: account_setting?.custom_clearance_expense_code || '',
        freight_expense_code: account_setting?.freight_expense_code || '',
        income_code: account_setting?.income_code || '',
        fiscal_date_from: account_setting?.fiscal_date_from || '',
        fiscal_date_to: account_setting?.fiscal_date_to || '',
    });

    const flatpickerRefFromDate = useRef(null);
    const flatpickerRefToDate = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            if (flatpickerRefFromDate.current) {
                flatpickr(flatpickerRefFromDate.current, {
                    dateFormat: 'd-m-Y',
                    disableMobile: true,
                    onChange: function (selectedDates, dateStr) {
                        setData('fiscal_date_from', dateStr);
                    },
                });
            }

            if (flatpickerRefToDate.current) {
                flatpickr(flatpickerRefToDate.current, {
                    dateFormat: 'd-m-Y',
                    disableMobile: true,
                    onChange: function (selectedDates, dateStr) {
                        setData('fiscal_date_to', dateStr);
                    },
                });
            }
        }, 500);
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('setups.account-setting.save'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Setups - Account Setting" />

            <BreadCrumb
                header={'Setups - Account Setting'}
                parent={'Dashboard'}
                parent_link={route('dashboard')}
                child={'Account Setting'}
            />

            <Card
                Content={
                    <>
                        <form onSubmit={submit}>
                            <div className="my-10 grid grid-cols-1 gap-5 p-4 md:grid-cols-3">
                                <Input
                                    InputName={'Vendor Expense Code'}
                                    Id={'vendor_expense_code'}
                                    Name={'vendor_expense_code'}
                                    Placeholder={'Vendor Expense Code'}
                                    Type={'text'}
                                    Error={errors?.vendor_expense_code}
                                    Value={data?.vendor_expense_code}
                                    Required={false}
                                    Action={(e) => setData('vendor_expense_code', e.target.value)}
                                />

                                <Input
                                    InputName={'Transporter Expense Code'}
                                    Id={'transporter_expense_code'}
                                    Name={'transporter_expense_code'}
                                    Placeholder={'Transporter Expense Code'}
                                    Type={'text'}
                                    Error={errors?.transporter_expense_code}
                                    Value={data?.transporter_expense_code}
                                    Required={false}
                                    Action={(e) =>
                                        setData('transporter_expense_code', e.target.value)
                                    }
                                />

                                <Input
                                    InputName={'Custom Clearance Expense Code'}
                                    Id={'custom_clearance_expense_code'}
                                    Name={'custom_clearance_expense_code'}
                                    Placeholder={'Custom Clearance Expense Code'}
                                    Type={'text'}
                                    Error={errors?.custom_clearance_expense_code}
                                    Value={data?.custom_clearance_expense_code}
                                    Required={false}
                                    Action={(e) =>
                                        setData('custom_clearance_expense_code', e.target.value)
                                    }
                                />

                                <Input
                                    InputName={'Freight Expense Code'}
                                    Id={'freight_expense_code'}
                                    Name={'freight_expense_code'}
                                    Placeholder={'Freight Expense Code'}
                                    Type={'text'}
                                    Error={errors?.freight_expense_code}
                                    Value={data?.freight_expense_code}
                                    Required={false}
                                    Action={(e) => setData('freight_expense_code', e.target.value)}
                                />

                                <Input
                                    InputName={'Income Code'}
                                    Id={'income_code'}
                                    Name={'income_code'}
                                    Placeholder={'Income Code'}
                                    Type={'text'}
                                    Error={errors?.income_code}
                                    Value={data?.income_code}
                                    Required={false}
                                    Action={(e) => setData('income_code', e.target.value)}
                                />

                                <Input
                                    InputName={'Fiscal Date From'}
                                    Id={'fiscal_date_from'}
                                    Name={'fiscal_date_from'}
                                    Placeholder={'Fiscal Date From'}
                                    Type={'text'}
                                    Error={errors?.fiscal_date_from}
                                    Value={data?.fiscal_date_from}
                                    Required={true}
                                    Action={(e) => setData('fiscal_date_from', e.target.value)}
                                    InputRef={flatpickerRefFromDate}
                                />

                                <Input
                                    InputName={'Fiscal Date To'}
                                    Id={'fiscal_date_to'}
                                    Name={'fiscal_date_to'}
                                    Placeholder={'Fiscal Date To'}
                                    Type={'text'}
                                    Error={errors?.fiscal_date_to}
                                    Value={data?.fiscal_date_to}
                                    Required={true}
                                    Action={(e) => setData('fiscal_date_to', e.target.value)}
                                    InputRef={flatpickerRefToDate}
                                />
                            </div>

                            <PrimaryButton
                                CustomClass={'w-[250px] h-[50px] p-4 mx-auto'}
                                Text={'Save Account Setting'}
                                Type={'submit'}
                                Processing={processing}
                                Spinner={processing}
                                Disabled={
                                    processing ||
                                    data?.fiscal_date_from === '' ||
                                    data?.fiscal_date_to === ''
                                }
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
                                            d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"
                                        />
                                    </svg>
                                }
                            />
                        </form>
                    </>
                }
            />
        </AuthenticatedLayout>
    );
}
