import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import Input from "@/Components/Forms/Input.jsx";
import Textarea from '@/Components/Forms/Textarea';
import DateTimePicker from '@/Components/Forms/DateTimePicker';
import Select from '@/Components/Forms/Select';
import { Building, Clock, User } from 'lucide-react';

export default function TrainingForm({ training = null }) {
    const { employees } = usePage().props;
    const [selectedEmployees, setSelectedEmployees] = useState(training?.employees?.map(e => e.id) || []);
    const [endDateError, setEndDateError] = useState('');

    // Format date for datetime-local input
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);

            // Check if date is valid
            if (isNaN(date.getTime())) return '';

            // Format to YYYY-MM-DDTHH:mm
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch (error) {
            console.error('Date formatting error:', error);
            return '';
        }
    };

    const { data, setData, post, put, errors, processing } = useForm({
        name: training?.name || '',
        topic: training?.topic || '',
        location: training?.location || '',
        start_date: formatDateForInput(training?.start_date) || '',
        end_date: formatDateForInput(training?.end_date) || '',
        trainer_name: training?.trainer_name || '',
        trainer_email: training?.trainer_email || '',
        trainer_phone: training?.trainer_phone || '',
        description: training?.description || '',
        employee_ids: selectedEmployees,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate end date is after start date
        if (data.start_date && data.end_date) {
            const start = new Date(data.start_date);
            const end = new Date(data.end_date);
            if (end <= start) {
                setEndDateError('End date must be after start date');
                return;
            }
        }

        setEndDateError('');

        const formData = {
            ...data,
            employee_ids: selectedEmployees
        };

        if (training) {
            put(route('admin.trainings.update', training.id), formData);
        } else {
            post(route('admin.trainings.store'), formData);
        }
    };

    const handleStartDateChange = (e) => {
        setData('start_date', e.target.value);
        if (data.end_date && new Date(e.target.value) >= new Date(data.end_date)) {
            setEndDateError('End date must be after start date');
        } else {
            setEndDateError('');
        }
    };

    const handleEndDateChange = (e) => {
        setData('end_date', e.target.value);
        if (data.start_date && new Date(e.target.value) <= new Date(data.start_date)) {
            setEndDateError('End date must be after start date');
        } else {
            setEndDateError('');
        }
    };

    const toggleEmployee = (employeeId) => {
        setSelectedEmployees(prev =>
            prev.includes(employeeId)
                ? prev.filter(id => id !== employeeId)
                : [...prev, employeeId]
        );
    };

    const selectAllEmployees = () => {
        if (selectedEmployees.length === employees.length) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees(employees.map(emp => emp.id));
        }
    };

    // Update form data when selected employees change
    useEffect(() => {
        setData('employee_ids', selectedEmployees);
    }, [selectedEmployees]);

    const employeeOptions = employees.map(employee => ({
        value: employee.id,
        label: `${employee.name} (${employee.id_number}) - ${employee.department || 'No Department'}`
    }));

    const calculateDuration = () => {
        if (data.start_date && data.end_date) {
            const start = new Date(data.start_date);
            const end = new Date(data.end_date);
            const diffMs = end - start;
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffHours / 24);
            const remainingHours = diffHours % 24;

            if (diffDays > 0) {
                return `${diffDays} day${diffDays > 1 ? 's' : ''} ${remainingHours > 0 ? `and ${remainingHours} hour${remainingHours > 1 ? 's' : ''}` : ''}`;
            }
            return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
        }
        return 'N/A';
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                    <Building className="w-5 h-5 mr-2 text-blue-600" />
                    Training Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Training Name */}
                    <Input
                        label="Training Name"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                        required
                        placeholder="Enter training program name"
                    />

                    {/* Topic/Subject */}
                    <Input
                        label="Topic/Subject"
                        name="topic"
                        value={data.topic}
                        onChange={(e) => setData('topic', e.target.value)}
                        error={errors.topic}
                        required
                        placeholder="Enter training topic or subject"
                    />

                    {/* Location */}
                    <Input
                        label="Location"
                        name="location"
                        value={data.location}
                        onChange={(e) => setData('location', e.target.value)}
                        error={errors.location}
                        required
                        placeholder="Enter training venue address"
                    />

                    {/* Duration Display */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-800">Training Duration</p>
                                <p className="text-lg font-bold text-blue-900 mt-1">{calculateDuration()}</p>
                            </div>
                            <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                        <p className="text-xs text-blue-600 mt-2">
                            Calculated based on start and end dates
                        </p>
                    </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                    <Textarea
                        label="Description"
                        name="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        error={errors.description}
                        placeholder="Provide detailed description of the training program, objectives, and expected outcomes..."
                        rows={4}
                    />
                </div>
            </div>

            {/* Schedule Section */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Training Schedule</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Start Date & Time */}
                    <DateTimePicker
                        label="Start Date & Time"
                        name="start_date"
                        value={data.start_date}
                        onChange={handleStartDateChange}
                        error={errors.start_date}
                        required
                    />

                    {/* End Date & Time */}
                    <div>
                        <DateTimePicker
                            label="End Date & Time"
                            name="end_date"
                            value={data.end_date}
                            onChange={handleEndDateChange}
                            error={errors.end_date || endDateError}
                            required
                        />
                        {endDateError && (
                            <p className="mt-1 text-sm text-red-600">{endDateError}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Trainer Information Section */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Trainer/Training Institute Info(Optional)</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Trainer Name */}
                    <Input
                        label="Trainer/Institute Name"
                        name="trainer_name"
                        value={data.trainer_name}
                        onChange={(e) => setData('trainer_name', e.target.value)}
                        error={errors.trainer_name}
                        placeholder="Enter full name"
                    />

                    {/* Trainer Email */}
                    <Input
                        label="Trainer/Institute Email"
                        type="email"
                        name="trainer_email"
                        value={data.trainer_email}
                        onChange={(e) => setData('trainer_email', e.target.value)}
                        error={errors.trainer_email}
                        placeholder="Enter email address"
                    />

                    {/* Trainer Phone */}
                    <Input
                        label="Trainer/Institute Phone"
                        type="tel"
                        name="trainer_phone"
                        value={data.trainer_phone}
                        onChange={(e) => setData('trainer_phone', e.target.value)}
                        error={errors.trainer_phone}
                        placeholder="Enter phone number"
                    />
                </div>
            </div>

            {/* Assign Employees Section */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Assign officers/staffs</h3>
                    <button
                        type="button"
                        onClick={selectAllEmployees}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        {selectedEmployees.length === employees.length ? 'Deselect All' : 'Select All'}
                    </button>
                </div>

                {employees.length > 0 ? (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="max-h-96 overflow-y-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Select
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        officer/staff
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Department
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Designation
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {employees.map((employee) => (
                                    <tr
                                        key={employee.id}
                                        className={`hover:bg-gray-50 cursor-pointer ${
                                            selectedEmployees.includes(employee.id) ? 'bg-blue-50' : ''
                                        }`}
                                        onClick={() => toggleEmployee(employee.id)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedEmployees.includes(employee.id)}
                                                onChange={() => toggleEmployee(employee.id)}
                                                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8">
                                                    {employee.image ? (
                                                        <img
                                                            className="h-8 w-8 rounded-full object-cover"
                                                            src={employee.image}
                                                            alt={employee.name}
                                                        />
                                                    ) : (
                                                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <User className="w-5 h-5 text-gray-500" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {employee.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        <span>Phone: {employee?.phone}</span>
                                                        {employee.id_number &&
                                                            <>
                                                                <br/><span> ID: {employee?.id_number}</span>
                                                            </>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {employee.department || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {employee.designation}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 border border-gray-200 rounded-lg">
                        <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No officers/staffs available to assign</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Add officers/staffs first to assign them to this training
                        </p>
                        <Link
                            href={route('admin.employees.create')}
                            className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800"
                        >
                            Add New officer/staff
                        </Link>
                    </div>
                )}

                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-800">
                                {selectedEmployees.length} officer/staff(s) selected
                            </p>
                            <p className="text-xs text-blue-600">
                                {selectedEmployees.length === employees.length
                                    ? 'All employees will attend this training'
                                    : 'Only selected officers/staffs will be assigned to this training'
                                }
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-blue-800">
                                Total capacity: {employees.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
                <a
                    href={route('admin.trainings.index')}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancel
                </a>
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {processing ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </span>
                    ) : training ? 'Update Training' : 'Create Training'}
                </button>
            </div>
        </form>
    );
}
