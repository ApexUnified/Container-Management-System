import { Link } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Sidebar({
    sidebarToggle,
    setSidebarToggle,
    ApplicationLogoLight,
    ApplicationLogoDark,
}) {
    // For Managing Sidebar Navlinks Selection State
    const [selected, setSelected] = useState(null);

    return (
        <>
            <aside
                className={`${
                    sidebarToggle ? 'translate-x-0 lg:w-[90px]' : '-translate-x-full'
                } sidebar fixed left-0 top-0 z-[12] flex h-screen w-[290px] flex-col overflow-y-hidden border-r border-gray-200 bg-white px-5 dark:border-gray-800 dark:bg-gray-900 lg:static lg:translate-x-0`}
            >
                <div
                    className={`flex items-center ${sidebarToggle ? 'justify-center' : 'justify-between'} sidebar-header gap-2 pb-7 pt-8`}
                >
                    <Link href={route('dashboard')}>
                        <span className={`logo ${sidebarToggle ? 'hidden' : ''}`}>
                            <img
                                className="h-[140px] w-auto dark:hidden"
                                src={ApplicationLogoLight}
                                alt="Logo"
                            />

                            <img
                                className="hidden h-[140px] w-auto dark:block"
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

                <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto duration-300 ease-linear">
                    <nav>
                        <div>
                            <h3 className="mb-4 text-xs uppercase leading-[20px] text-gray-400">
                                <span
                                    className={`menu-group-title ${sidebarToggle ? 'lg:hidden' : ''}`}
                                >
                                    MENU
                                </span>

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

                            <ul className="mb-6 flex flex-col gap-4">
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
                                            if (selected === 'Categories') {
                                                setSelected(null);
                                            } else {
                                                setSelected('Categories');
                                            }
                                        }}
                                        className={`menu-item group cursor-pointer ${route().current().includes('category.') || selected === 'Categories' ? 'menu-item-active' : 'menu-item-inactive'} `}
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
                                                d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 6h.008v.008H6V6Z"
                                            />
                                        </svg>

                                        <span
                                            className={`menu-item-text ${sidebarToggle ? 'lg:hidden' : ''}`}
                                        >
                                            Categories
                                        </span>

                                        <svg
                                            className={`menu-item-arrow absolute right-2.5 top-1/2 -translate-y-1/2 stroke-current ${route().current().includes('category.') || (selected === 'Categories' && 'menu-item-arrow-active')} ${sidebarToggle ? 'lg:hidden' : ''}`}
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
                                        className={`translate transform overflow-hidden ${selected === 'Categories' ? 'block' : 'hidden'}`}
                                    >
                                        <ul
                                            className={`menu-dropdown mt-2 flex flex-col gap-1 pl-9 ${sidebarToggle ? 'lg:hidden' : 'flex'} `}
                                        >
                                            <li>
                                                <Link
                                                    href={route('category.index')}
                                                    className={`menu-dropdown-item group ${route().current() === 'category.index' ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}
                                                >
                                                    Category List
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={route('category.create')}
                                                    className={`menu-dropdown-item group ${route().current() === 'category.create' ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}
                                                >
                                                    Create Category
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
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
                                        className={`menu-item group cursor-pointer ${route().current().includes('category.') || selected === 'Setups' ? 'menu-item-active' : 'menu-item-inactive'} `}
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
                                            className={`menu-item-arrow absolute right-2.5 top-1/2 -translate-y-1/2 stroke-current ${route().current().includes('category.') || (selected === 'Setups' && 'menu-item-arrow-active')} ${sidebarToggle ? 'lg:hidden' : ''}`}
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
                                                    href={route('category.index')}
                                                    className={`menu-dropdown-item group ${route().current() === 'category.index' ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}
                                                >
                                                    Units
                                                </Link>
                                            </li>

                                            <li>
                                                <Link
                                                    href={route('category.index')}
                                                    className={`menu-dropdown-item group ${route().current() === 'category.index' ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}
                                                >
                                                    Shipping Lines
                                                </Link>
                                            </li>

                                            <li>
                                                <Link
                                                    href={route('category.index')}
                                                    className={`menu-dropdown-item group ${route().current() === 'category.index' ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}
                                                >
                                                    Vendors
                                                </Link>
                                            </li>

                                            <li>
                                                <Link
                                                    href={route('category.index')}
                                                    className={`menu-dropdown-item group ${route().current() === 'category.index' ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}
                                                >
                                                    Products
                                                </Link>
                                            </li>

                                            <li>
                                                <Link
                                                    href={route('category.index')}
                                                    className={`menu-dropdown-item group ${route().current() === 'category.index' ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}
                                                >
                                                    Transporters
                                                </Link>
                                            </li>

                                            <li>
                                                <Link
                                                    href={route('category.index')}
                                                    className={`menu-dropdown-item group ${route().current() === 'category.index' ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}
                                                >
                                                    Custom Clearances
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </li>

                                <li>
                                    <Link
                                        href={route('settings.index')}
                                        className={`menu-item group ${route().current().includes('settings') ? 'menu-item-active' : 'menu-item-inactive'}`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className={`size-6`}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                            />
                                        </svg>

                                        <span
                                            className={`menu-item-text ${sidebarToggle ? 'lg:hidden' : ''}`}
                                        >
                                            Settings
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
