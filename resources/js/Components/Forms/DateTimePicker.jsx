import React from 'react';
import { Calendar, Clock } from 'lucide-react';

export default function DateTimePicker({
                                           label,
                                           name,
                                           value,
                                           onChange,
                                           error,
                                           required = false,
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
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="datetime-local"
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`${baseClasses} pl-10 ${errorClasses} ${props.className || ''}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
