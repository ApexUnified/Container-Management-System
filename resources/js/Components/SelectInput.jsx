import useDarkMode from '@/Hooks/useDarkMode';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';

export default function SelectInput({
    Name,
    Id,
    CustomCss,
    Required = false,
    InputName,
    Error,
    items = [],
    Action,
    Value,
    itemKey,
    valueKey,
    Multiple = false,
    Placeholder = true,
    isDisabled = false,
    DarkModeSupported = true,
    Clearable = true,
}) {
    const [options, setOptions] = useState([]);
    const isDarkMode = useDarkMode();

    // 🌙 Dark mode styles
    const darkStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: '#111827',
            color: '#ffffff',
            borderColor: state.isFocused ? '#3b82f6' : '#4b5563',
            boxShadow: 'none',
            '&:hover': { borderColor: '#3b82f6' },
        }),
        menu: (base) => ({ ...base, backgroundColor: '#1f2937', color: '#fff' }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? '#374151' : '#111827',
            color: '#fff',
        }),
        singleValue: (base) => ({ ...base, color: '#fff' }),
        input: (base) => ({ ...base, color: '#fff' }),
        placeholder: (base) => ({ ...base, color: '#9ca3af' }),
        menuList: (provided) => ({ ...provided, maxHeight: '120px', overflowY: 'auto' }),
    };

    // ☀️ Light mode styles
    const lightStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: '#ffffff',
            color: '#111827',
            borderColor: state.isFocused ? '#2563eb' : '#d1d5db',
            boxShadow: 'none',
            '&:hover': { borderColor: '#2563eb' },
        }),
        menu: (base) => ({ ...base, backgroundColor: '#ffffff', color: '#111827' }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? '#f3f4f6' : '#ffffff',
            color: '#111827',
        }),
        singleValue: (base) => ({ ...base, color: '#111827' }),
        input: (base) => ({ ...base, color: '#111827' }),
        placeholder: (base) => ({ ...base, color: '#6b7280' }),
        menuList: (provided) => ({ ...provided, maxHeight: '120px', overflowY: 'auto' }),
    };

    // ✅ Build options
    useEffect(() => {
        const modified = items.map((item) => ({
            value: item[valueKey] ?? item.id ?? item[itemKey],
            label: item[itemKey],
            amount: item.amount ?? 0, // include amount for later
        }));
        setOptions(modified);
    }, [items]);

    // ✅ Fix value mapping for react-select
    const selectedValues = Multiple
        ? options.filter((opt) => Value?.includes(opt.value))
        : options.find((opt) => opt.value === Value) || null;

    return (
        <div className={`${CustomCss} w-full`}>
            {InputName && (
                <label
                    htmlFor={Id}
                    className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                    {InputName}
                    {Required && <span className="text-red-500 dark:text-white"> *</span>}
                </label>
            )}

            <Select
                name={Name}
                inputId={Id}
                options={options}
                isDisabled={isDisabled}
                isMulti={Multiple}
                value={selectedValues}
                onChange={(selectedOption) => {
                    if (Multiple) {
                        // Return array of values
                        Action(selectedOption?.map((opt) => opt.value) || []);
                    } else {
                        Action(selectedOption?.value ?? '');
                    }
                }}
                isClearable={Clearable && !Multiple}
                isSearchable
                required={Required}
                placeholder={Placeholder ? ` ${InputName} ` : ''}
                styles={DarkModeSupported ? (isDarkMode ? darkStyles : lightStyles) : lightStyles}
                className={`react-select-container ${isDisabled && 'opacity-30'}`}
                classNamePrefix="react-select"
            />

            {Error && <p className="mt-1.5 text-red-500 dark:text-white">{Error}</p>}
        </div>
    );
}
