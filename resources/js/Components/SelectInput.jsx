import React from 'react';

export default function SelectInput({
    Name,
    Id,
    CustomCss,
    Required = false,
    InputName,
    Error,
    items,
    Action,
    Value,
    itemKey,
    Multiple = false,
}) {
    return (
        <>
            <div className={`${CustomCss} w-full`}>
                <label
                    htmlFor={Id}
                    className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                    {InputName}
                    {Required && <span className="text-red-500 dark:text-white"> *</span>}
                </label>

                <div className="relative">
                    <select
                        name={Name}
                        id={Id}
                        onChange={Action}
                        required={Required}
                        value={Value}
                        className="dark:bg-dark-900 shadow-theme-xs focus:ring-3 focus:outline-hidden h-[42px] w-full min-w-[250px] rounded-lg border border-gray-300 bg-transparent py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-300 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-800"
                        {...(Multiple ? { multiple: true } : {})}
                    >
                        <option value="">Select {InputName}</option>
                        {items.map((item, index) => {
                            return (
                                <option key={index} value={item.id ?? item[itemKey]}>
                                    {item[itemKey].length > 50
                                        ? item[itemKey].slice(0, 50) + '...'
                                        : item[itemKey]}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className="h-5">
                    {Error && <p className="mt-1.5 text-red-500 dark:text-white">{Error}</p>}
                </div>
            </div>
        </>
    );
}
