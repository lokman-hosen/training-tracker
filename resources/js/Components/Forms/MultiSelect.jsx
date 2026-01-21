// resources/js/Components/Forms/MultiSelect.jsx
import React from 'react';
import Select from 'react-select';

export default function MultiSelect({
                                        label,
                                        value,
                                        onChange,
                                        options = [],
                                        placeholder = "Select...",
                                        error,
                                        className = '',
                                        ...props
                                    }) {
    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: error ? '#ef4444' : '#d1d5db',
            '&:hover': {
                borderColor: error ? '#dc2626' : '#9ca3af'
            },
            boxShadow: state.isFocused ? (error ? '0 0 0 1px #ef4444' : '0 0 0 1px #3b82f6') : 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            minHeight: '38px'
        }),
        menu: base => ({
            ...base,
            fontSize: '0.875rem',
            zIndex: 50
        }),
        multiValue: base => ({
            ...base,
            backgroundColor: '#dbeafe',
            borderRadius: '0.25rem'
        }),
        multiValueLabel: base => ({
            ...base,
            color: '#1e40af',
            fontWeight: '500'
        }),
        multiValueRemove: base => ({
            ...base,
            color: '#93c5fd',
            '&:hover': {
                backgroundColor: '#3b82f6',
                color: 'white'
            }
        })
    };

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <Select
                isMulti
                value={value}
                onChange={onChange}
                options={options}
                placeholder={placeholder}
                styles={customStyles}
                className="react-select-container"
                classNamePrefix="react-select"
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
