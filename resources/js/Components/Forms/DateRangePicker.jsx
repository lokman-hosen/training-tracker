// resources/js/Components/Forms/DateRangePicker.jsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

export default function DateRangePicker({
                                            label,
                                            startDate,
                                            endDate,
                                            onChange,
                                            error,
                                            className = '',
                                            ...props
                                        }) {
    const [start, setStart] = useState(startDate ? new Date(startDate) : null);
    const [end, setEnd] = useState(endDate ? new Date(endDate) : null);

    const handleStartChange = (date) => {
        setStart(date);
        onChange({
            start_date: date ? format(date, 'yyyy-MM-dd') : '',
            end_date: end ? format(end, 'yyyy-MM-dd') : ''
        });
    };

    const handleEndChange = (date) => {
        setEnd(date);
        onChange({
            start_date: start ? format(start, 'yyyy-MM-dd') : '',
            end_date: date ? format(date, 'yyyy-MM-dd') : ''
        });
    };

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <DatePicker
                            selected={start}
                            onChange={handleStartChange}
                            selectsStart
                            startDate={start}
                            endDate={end}
                            placeholderText="Start Date"
                            className={`w-full pl-10 pr-3 py-2 border ${
                                error ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                            dateFormat="yyyy-MM-dd"
                            isClearable
                        />
                    </div>
                </div>
                <div className="flex-1">
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <DatePicker
                            selected={end}
                            onChange={handleEndChange}
                            selectsEnd
                            startDate={start}
                            endDate={end}
                            minDate={start}
                            placeholderText="End Date"
                            className={`w-full pl-10 pr-3 py-2 border ${
                                error ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                            dateFormat="yyyy-MM-dd"
                            isClearable
                        />
                    </div>
                </div>
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
