import useWindowSize from '@/Hooks/useWindowSize';
import { Link } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';

export default function Sidebar({
    sidebarToggle,
    setSidebarToggle,
    ApplicationLogoLight,
    ApplicationLogoDark,
}) {
    // For Managing Sidebar Navlinks Selection State
    const [selected, setSelected] = useState(null);
    const [accountSetupSelected, setAccountSetupSelected] = useState(null);

    const { width } = useWindowSize();

    const isLargeScreen = width >= 1025;
    const prevIsLargeScreenRef = useRef(isLargeScreen);

    useEffect(() => {
        if (prevIsLargeScreenRef.current && !isLargeScreen && sidebarToggle) {
            setSidebarToggle(false);
        }
        prevIsLargeScreenRef.current = isLargeScreen;
    }, [isLargeScreen, sidebarToggle]);

    useEffect(() => {
        if (isLargeScreen) {
            const saved = localStorage.getItem('sidebarToggle');
            if (saved === null) {
                setSidebarToggle(false);
                localStorage.setItem('sidebarToggle', JSON.stringify(false));
            } else {
                setSidebarToggle(JSON.parse(saved));
            }
        }
    }, [isLargeScreen]);

    useEffect(() => {
        if (isLargeScreen) {
            localStorage.setItem('sidebarToggle', JSON.stringify(sidebarToggle));
        }
    }, [sidebarToggle, isLargeScreen]);

    return (
        <>
            <aside
                className={`${
                    sidebarToggle ? 'translate-x-0 lg:w-[90px]' : '-translate-x-full'
                } sidebar fixed left-0 top-0 z-[12] flex h-screen w-[240px] flex-col overflow-y-hidden border-r border-gray-200 bg-white px-5 dark:border-gray-800 dark:bg-gray-900 lg:static lg:translate-x-0`}
            >
                <div className={`flex items-center justify-center gap-2 pb-7 pt-8`}>
                    <Link href={route('dashboard')}>
                        <span className={`logo ${sidebarToggle ? 'hidden' : ''}`}>
                            <img
                                className="h-[80px] w-auto dark:hidden"
                                src={ApplicationLogoLight}
                                alt="Logo"
                            />

                            <img
                                className="hidden h-[80px] w-auto dark:block"
                                src={ApplicationLogoDark}
                                alt="Logo"
                            />
                        </span>
                    </Link>

                    <button
                        className={`${sidebarToggle ? 'bg-gray-100 dark:bg-gray-800 lg:bg-transparent dark:lg:bg-transparent' : ''} z-99999 flex h-10 w-10 items-center justify-center rounded-lg border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400 lg:hidden lg:h-11 lg:w-11 lg:border`}
                        onClick={() => setSidebarToggle(!sidebarToggle)}
                    >
                        <svg
                            className={`${sidebarToggle ? 'block lg:hidden' : 'hidden'} fill-current`}
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                                fill=""
                            />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col flex-1 overflow-y-auto duration-300 ease-linear no-scrollbar">
                    <nav>
                        <div>
                            <h3 className="mb-4 text-xs uppercase leading-[20px] text-gray-400">
                                <svg
                                    className={`menu-group-icon mx-auto fill-current ${sidebarToggle ? 'hidden lg:block' : 'hidden'}`}
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M5.99915 10.2451C6.96564 10.2451 7.74915 11.0286 7.74915 11.9951V12.0051C7.74915 12.9716 6.96564 13.7551 5.99915 13.7551C5.03265 13.7551 4.24915 12.9716 4.24915 12.0051V11.9951C4.24915 11.0286 5.03265 10.2451 5.99915 10.2451ZM17.9991 10.2451C18.9656 10.2451 19.7491 11.0286 19.7491 11.9951V12.0051C19.7491 12.9716 18.9656 13.7551 17.9991 13.7551C17.0326 13.7551 16.2491 12.9716 16.2491 12.0051V11.9951C16.2491 11.0286 17.0326 10.2451 17.9991 10.2451ZM13.7491 11.9951C13.7491 11.0286 12.9656 10.2451 11.9991 10.2451C11.0326 10.2451 10.2491 11.0286 10.2491 11.9951V12.0051C10.2491 12.9716 11.0326 13.7551 11.9991 13.7551C12.9656 13.7551 13.7491 12.9716 13.7491 12.0051V11.9951Z"
                                        fill=""
                                    />
                                </svg>
                            </h3>

                            <ul className="flex flex-col gap-4 mb-6">
                                <li>
                                    <Link
                                        href={route('dashboard')}
                                        className={`menu-item group ${route().current() === 'dashboard' ? 'menu-item-active' : 'menu-item-inactive'}`}
                                    >
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
                                                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                                            />
                                        </svg>

                                        <span
                                            className={`menu-item-text ${sidebarToggle ? 'lg:hidden' : ''}`}
                                        >
                                            Dashboard
                                        </span>

                                        <svg
                                            className={`menu-item-arrow ${sidebarToggle ? 'lg:hidden' : ''}`}
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M4.79175 7.39584L10.0001 12.6042L15.2084 7.39585"
                                                stroke=""
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </Link>
                                </li>

                                <li>
                                    <a
                                        onClick={() => {
                                            if (selected === 'Setups') {
                                                setSelected(null);
                                            } else {
                                                setSelected('Setups');
                                            }
                                        }}
                                        className={`menu-item group cursor-pointer ${route().current().includes('setups.') || selected === 'Setups' ? 'menu-item-active' : 'menu-item-inactive'} `}
                                    >
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
                                                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                                            />
                                        </svg>

                                        <span
                                            className={`menu-item-text ${sidebarToggle ? 'lg:hidden' : ''}`}
                                        >
                                            Setups
                                        </span>

                                        <svg
                                            className={`menu-item-arrow absolute right-2.5 top-1/2 -translate-y-1/2 stroke-current ${route().current().includes('setups.') || (selected === 'Setups' && 'menu-item-arrow-active')} ${sidebarToggle ? 'lg:hidden' : ''}`}
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M4.79175 7.39584L10.0001 12.6042L15.2084 7.39585"
                                                stroke=""
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </a>

                                    <div
                                        className={`translate transform overflow-hidden ${selected === 'Setups' ? 'block' : 'hidden'}`}
                                    >
                                        <ul
                                            className={`menu-dropdown mt-2 flex flex-col gap-1 pl-9 ${sidebarToggle ? 'lg:hidden' : 'flex'} `}
                                        >
                                            <li>
                                                <Link
                                                    href={route('setups.units.index')}
                                                    className={`menu-dropdown-item group ${route().current() === 'setups.units.index' ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}
                                                >
                                                    Unit
                                                </Link>
                                            </li>

                                            <li>
                                                <Link
                                                    href={route('setups.shipping-lines.index')}
                                                    className={`menu-dropdown-item group ${route().current() === 'setups.shipping-lines.index' ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}
                                                >
                                                    Shipping Line
                                                </Link>
                                            </li>

                                            <li>
                                                <Link
                                                    href={route('setups.vendors.index')}
                                                    className={`menu-dropdown-item group ${route().current() === 'setups.vendors.index' ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}
                                                >
                                                    Vendor
                                                </Link>
                                            </li>

                                            <li>
                                                <Link
                                                    href={route('setups.transporters.index')}
                                                    className={`menu-dropdown-item group ${route().current() === 'setups.transporters.index' ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}
                                                >
                                                    Transporter
                                                </Link>
                                            </li>

                                            <li>
                                                <Link
                                                    href={route('setups.custom-clearances.index')}
                                                    className={`menu-dropdown-item group ${route().current() === 'setups.custom-clearances.index' ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}
                                                >
                                                    Custom Clearance
                                                </Link>
                                            </li>

                                            <li>
                                                <Link
                                                    href={route('setups.products.index')}
                                                    className={`menu-dropdown-item group ${route().current() === 'setups.products.index' ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}
                                                >
                                                    Product
                                                </Link>
                                            </li>

                                            <li>
                                                <Link
                                                    href={route('setups.currency.index')}
                                                    className={`menu-dropdown-item group ${route().current() === 'setups.currency.index' ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}
                                                >
                                                    Currency
                                                </Link>
                                            </li>

                                            <li>
                                                <a
                                                    onClick={() => {
                                                        if (
                                                            accountSetupSelected === 'Account Setup'
                                                        ) {
                                                            setAccountSetupSelected(null);
                                                        } else {
                                                            setAccountSetupSelected(
                                                                'Account Setup',
                                                            );
                                                        }
                                                    }}
                                                    className={`menu-item group cursor-pointer ${route().current().includes('setups.accounts.') || accountSetupSelected === 'Account Setup' ? 'menu-item-active' : 'menu-item-inactive'} `}
                                                >
                                                    <span
                                                        className={`menu-item-text ${sidebarToggle ? 'lg:hidden' : ''}`}
                                                    >
                                                        Account Setup
                                                    </span>

                                                    <svg
                                                        className={`menu-item-arrow absolute right-2.5 top-1/2 -translate-y-1/2 stroke-current ${route().current().includes('setups.accounts.') || (accountSetupSelected === 'Account Setup' && 'menu-item-arrow-active')} ${sidebarToggle ? 'lg:hidden' : ''}`}
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 20 20"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M4.79175 7.39584L10.0001 12.6042L15.2084 7.39585"
                                                            stroke=""
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </a>

                                                <div
                                                    className={`translate transform overflow-hidden ${accountSetupSelected === 'Account Setup' ? 'block' : 'hidden'}`}
                                                >
                                                    <ul
                                                        className={`menu-dropdown mt-2 flex flex-col gap-1 pl-9 ${sidebarToggle ? 'lg:hidden' : 'flex'} `}
                                                    >
                                                        <li>
                                                            <Link
                                                                href={route(
                                                                    'setups.accounts.controls.index',
                                                                )}
                                                                className={`menu-dropdown-item group ${route().current() === 'setups.accounts.controls.index' ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}
                                                            >
                                                                Control Setup
                                                            </Link>
                                                        </li>

                                                        <li>
                                                            <Link
                                                                href={route(
                                                                    'setups.accounts.subsidaries.index',
                                                                )}
                                                                className={`menu-dropdown-item group ${route().current() === 'setups.accounts.subsidaries.index' ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}
                                                            >
                                                                Subsidary Setup
                                                            </Link>
                                                        </li>

                                                        <li>
                                                            <Link
                                                                href={route(
                                                                    'setups.accounts.details.index',
                                                                )}
                                                                className={`menu-dropdown-item group ${route().current() === 'setups.accounts.details.index' ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}
                                                            >
                                                                Detail Setup
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </li>

                                <li>
                                    <a
                                        onClick={() => {
                                            if (selected === 'Transactions') {
                                                setSelected(null);
                                            } else {
                                                setSelected('Transactions');
                                            }
                                        }}
                                        className={`menu-item group cursor-pointer ${route().current().includes('transactions.') || selected === 'Transactions' ? 'menu-item-active' : 'menu-item-inactive'} `}
                                    >
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
                                                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                                            />
                                        </svg>

                                        <span
                                            className={`menu-item-text ${sidebarToggle ? 'lg:hidden' : ''}`}
                                        >
                                            Transactions
                                        </span>

                                        <svg
                                            className={`menu-item-arrow absolute right-2.5 top-1/2 -translate-y-1/2 stroke-current ${route().current().includes('transactions.') || (selected === 'Transactions' && 'menu-item-arrow-active')} ${sidebarToggle ? 'lg:hidden' : ''}`}
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M4.79175 7.39584L10.0001 12.6042L15.2084 7.39585"
                                                stroke=""
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </a>

                                    <div
                                        className={`translate transform overflow-hidden ${selected === 'Transactions' ? 'block' : 'hidden'}`}
                                    >
                                        <ul
                                            className={`menu-dropdown mt-2 flex flex-col gap-1 pl-9 ${sidebarToggle ? 'lg:hidden' : 'flex'} `}
                                        >
                                            <li>
                                                <Link
                                                    href={route('transactions.cros.index')}
                                                    className={`menu-dropdown-item group ${route().current() === 'transactions.cros.index' ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}
                                                >
                                                    CRO
                                                </Link>
                                            </li>

                                            <li>
                                                <Link
                                                    href={route('transactions.stock-in.index')}
                                                    className={`menu-dropdown-item group ${route().current() === 'transactions.stock-in.index' ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}
                                                >
                                                    Stock In
                                                </Link>
                                            </li>

                                            <li>
                                                <Link
                                                    href={route('transactions.stock-out.index')}
                                                    className={`menu-dropdown-item group ${route().current() === 'transactions.stock-out.index' ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}
                                                >
                                                    Stock Out
                                                </Link>
                                            </li>

                                            <li>
                                                <Link
                                                    href={route('transactions.vouchers.index')}
                                                    className={`menu-dropdown-item group ${route().current() === 'transactions.vouchers.index' ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}
                                                >
                                                    Payment Vouchers
                                                </Link>
                                            </li>

                                            <li>
                                                <Link
                                                    href={route(
                                                        'transactions.receipt-vouchers.index',
                                                    )}
                                                    className={`menu-dropdown-item group ${route().current() === 'transactions.receipt-vouchers.index' ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}
                                                >
                                                    Receipt Vouchers
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </li>

                                <li>
                                    <Link
                                        href={route('users.index')}
                                        className={`menu-item group ${route().current() === 'users.index' ? 'menu-item-active' : 'menu-item-inactive'}`}
                                    >
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
                                                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                                            />
                                        </svg>

                                        <span
                                            className={`menu-item-text ${sidebarToggle ? 'lg:hidden' : ''}`}
                                        >
                                            Users
                                        </span>

                                        <svg
                                            className={`menu-item-arrow ${sidebarToggle ? 'lg:hidden' : ''}`}
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M4.79175 7.39584L10.0001 12.6042L15.2084 7.39585"
                                                stroke=""
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </aside>
        </>
    );
}
