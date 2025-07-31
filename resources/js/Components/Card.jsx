import React from 'react';

export default function Card({ Content, CustomCss }) {
    return (
        <div
            className={`rounded-2xl border border-gray-200 bg-white p-5 pt-4 dark:border-gray-800 dark:bg-white/[0.03] ${CustomCss}`}
        >
            {Content}
        </div>
    );
}
