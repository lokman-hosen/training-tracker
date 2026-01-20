import React from 'react';

export default function Input({
                                  label,
                                  type = 'text',
                                  name,
                                  value,
                                  onChange,
                                  error,
                                  required = false,
                                  placeholder,
                                  disabled = false,
                                  className = '',
                                  ...props
                              }) {
    const baseClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed";
    const errorClasses = error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "";

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`${baseClasses} ${errorClasses} ${props.className || ''}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
