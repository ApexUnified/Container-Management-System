import React, { useEffect, useState } from 'react';
import Select from 'react-select';

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
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const modified_options = items.map((item) => ({
            value: item.id ?? item[itemKey],
            label: item[itemKey].length > 50 ? item[itemKey].slice(0, 50) + '...' : item[itemKey],
            uuid: item.uuid,
        }));

        setOptions(modified_options);
    }, []);

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
                    <Select
                        name={Name}
                        inputId={Id}
                        options={options}
                        value={options.find((opt) => opt.value === Value)}
                        onChange={(selectedOption) => {
                            if (Multiple) {
                                Action(selectedOption?.map((opt) => opt.value));
                            } else {
                                Action(selectedOption?.value);
                            }
                        }}
                        isMulti={Multiple}
                        isSearchable
                        required={Required}
                        placeholder={`Select ${InputName} Or Paste UUID To Search...`}
                        classNamePrefix="react-select"
                        className="react-select-container"
                        filterOption={(option, inputValue) => {
                            const name = option.data.name?.toLowerCase() || '';
                            const uuid = option.data.uuid?.toLowerCase() || '';
                            const input = inputValue.toLowerCase();
                            return name.includes(input) || uuid.includes(input);
                        }}
                        styles={{
                            control: (base) => ({
                                ...base,
                                minHeight: '42px',
                                backgroundColor: 'transparent',
                                borderColor: '#d1d5db',
                                boxShadow: 'none',
                                ':hover': { borderColor: '#93c5fd' },
                            }),
                            menu: (base) => ({
                                ...base,
                                zIndex: 9999,
                            }),
                        }}
                    />
                </div>

                <div className="h-5">
                    {Error && <p className="mt-1.5 text-red-500 dark:text-white">{Error}</p>}
                </div>
            </div>
        </>
    );
}
