import { Link } from '@inertiajs/react'
import React from 'react'

export default function LinkButton({ Disabled, Text, CustomClass = null, Icon, URL }) {
    return (
        <>
            <Link
                href={URL}
                className={`flex items-center justify-center w-[200px]  my-3 px-4 py-3 text-sm font-medium text-white transition bg-blue-700 rounded-xl dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10 shadow-theme-xs hover:bg-blue-600 ${CustomClass} ${Disabled && "pointer-events-none opacity-25 cursor-not-allowed  dark:opacity-40"} `}>
                {Text}

                <div className="mx-2">
                    {Icon ? Icon : ""}
                </div>

            </Link>
        </>
    )
}
