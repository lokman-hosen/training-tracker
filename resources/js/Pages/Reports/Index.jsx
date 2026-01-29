// resources/js/Pages/Admin/Reports/Index.jsx
import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Search,
    Filter,
    Download,
    Eye,
    FileText,
    ChevronDown,
    ChevronUp,
    X,
    Users,
    Calendar,
    GraduationCap,
    Clock
} from 'lucide-react';
import MultiSelect from '@/Components/Forms/MultiSelect';
import DateRangePicker from '@/Components/Forms/DateRangePicker';

export default function Index({ employees, allEmployees, allTrainings, filters }) {
    const [selectedEmployees, setSelectedEmployees] = useState(
        filters.employee_ids ? allEmployees.filter(emp => filters.employee_ids.includes(emp.id.toString())) : []
    );
    const [selectedTrainings, setSelectedTrainings] = useState(
        filters.training_ids ? allTrainings.filter(train => filters.training_ids.includes(train.id.toString())) : []
    );
    const [dateRange, setDateRange] = useState({
        start_date: filters.start_date || '',
        end_date: filters.end_date || ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);

    // Update filters when selections change
    useEffect(() => {
        const params = {};

        if (selectedEmployees.length > 0) {
            params.employee_ids = selectedEmployees.map(emp => emp.value);
        }

        if (selectedTrainings.length > 0) {
            params.training_ids = selectedTrainings.map(train => train.value);
        }

        if (dateRange.start_date) params.start_date = dateRange.start_date;
        if (dateRange.end_date) params.end_date = dateRange.end_date;

        // Debounce the filter update
        const timer = setTimeout(() => {
            router.get(route('admin.reports.index'), params, {
                preserveState: true,
                replace: true
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [selectedEmployees, selectedTrainings, dateRange]);

    const exportPDF = () => {
        const params = new URLSearchParams();

        if (selectedEmployees.length > 0) {
            selectedEmployees.forEach(emp => {
                params.append('employee_ids[]', emp.value);
            });
        }

        if (selectedTrainings.length > 0) {
            selectedTrainings.forEach(train => {
                params.append('training_ids[]', train.value);
            });
        }

        if (dateRange.start_date) params.append('start_date', dateRange.start_date);
        if (dateRange.end_date) params.append('end_date', dateRange.end_date);

        window.open(route('admin.reports.export-list') + '?' + params.toString(), '_blank');
    };

    const clearFilters = () => {
        setSelectedEmployees([]);
        setSelectedTrainings([]);
        setDateRange({ start_date: '', end_date: '' });
        setShowFilters(false);
    };

    const employeeOptions = allEmployees.map(emp => ({
        value: emp.id,
        label: `${emp.name} (${emp.id_number ?? emp.phone})`
    }));

    const trainingOptions = allTrainings.map(train => ({
        value: train.id,
        label: train.name
    }));

    const getStatusColor = (completed, total) => {
        if (total === 0) return 'bg-gray-100 text-gray-800';
        if (completed === total) return 'bg-green-100 text-green-800';
        if (completed > 0) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const getStatusText = (completed, total) => {
        if (total === 0) return 'No Training';
        if (completed === total) return 'Completed All';
        if (completed > 0) return 'In Progress';
        return 'Not Started';
    };

    return (
        <AdminLayout>
            <Head title="Training Reports" />

            <div className="py-6">
                <div className="mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Training Reports</h2>
                                <p className="text-gray-600 mt-1">
                                    Generate and export officers/staffs training reports
                                </p>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center space-x-3">
                                <button
                                    onClick={exportPDF}
                                    disabled={employees.data.length === 0}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Export PDF
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Report Filters</h3>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <Filter className="w-4 h-4 mr-2" />
                                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                                        {showFilters && <X className="w-4 h-4 ml-2" />}
                                    </button>
                                    {(selectedEmployees.length > 0 || selectedTrainings.length > 0 || dateRange.start_date || dateRange.end_date) && (
                                        <button
                                            onClick={clearFilters}
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                                        >
                                            Clear Filters
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                    <div className="flex items-center">
                                        <Users className="w-5 h-5 text-blue-600 mr-2" />
                                        <div>
                                            <p className="text-sm text-blue-700">Officers/staffs</p>
                                            <p className="text-lg font-bold text-blue-900">{employees.total}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                    <div className="flex items-center">
                                        <GraduationCap className="w-5 h-5 text-green-600 mr-2" />
                                        <div>
                                            <p className="text-sm text-green-700">Total Trainings</p>
                                            <p className="text-lg font-bold text-green-900">
                                                {employees.data.reduce((sum, emp) => sum + (emp.total_trainings_count || 0), 0)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                                    <div className="flex items-center">
                                        <FileText className="w-5 h-5 text-purple-600 mr-2" />
                                        <div>
                                            <p className="text-sm text-purple-700">Completed</p>
                                            <p className="text-lg font-bold text-purple-900">
                                                {employees.data.reduce((sum, emp) => sum + (emp.completed_trainings_count || 0), 0)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                    <div className="flex items-center">
                                        <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                                        <div>
                                            <p className="text-sm text-yellow-700">Total Hours</p>
                                            <p className="text-lg font-bold text-yellow-900">
                                                {employees.data.reduce((sum, emp) => sum + (emp.total_training_hours || 0), 0).toFixed(1)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Advanced Filters */}
                            {showFilters && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <MultiSelect
                                            label="Filter by Employees"
                                            value={selectedEmployees}
                                            onChange={setSelectedEmployees}
                                            options={employeeOptions}
                                            placeholder="Select employees..."
                                        />

                                        <MultiSelect
                                            label="Filter by Trainings"
                                            value={selectedTrainings}
                                            onChange={setSelectedTrainings}
                                            options={trainingOptions}
                                            placeholder="Select trainings..."
                                        />

                                        <DateRangePicker
                                            label="Filter by Date Range"
                                            startDate={dateRange.start_date}
                                            endDate={dateRange.end_date}
                                            onChange={setDateRange}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Report Table */}
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-gray-700">
                                    Officers/staffs Training Summary
                                </div>
                                <div className="text-sm text-gray-500">
                                    Showing {employees.from || 0} to {employees.to || 0} of {employees.total} employees
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        officer/staff
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Training Stats
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {employees.data.length > 0 ? (
                                    employees.data.map((employee) => (
                                        <React.Fragment key={employee.id}>
                                            <tr className="hover:bg-gray-50">
                                                {/* Employee Info */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            {employee.image ? (
                                                                <img
                                                                    className="h-10 w-10 rounded-full object-cover"
                                                                    src={employee.image}
                                                                    alt={employee.name}
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                                    <Users className="w-5 h-5 text-blue-600" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {employee.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {employee.id_number ?? employee.phone}
                                                            </div>
                                                            <div className="text-xs text-gray-400 mt-1">
                                                                {employee.department || 'No Department'} • {employee.designation}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Contact Info */}
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        {employee.email && (
                                                            <div className="text-sm text-gray-900">{employee.email}</div>
                                                        )}
                                                        <div className="text-sm text-gray-900">{employee.phone}</div>
                                                    </div>
                                                </td>

                                                {/* Training Stats */}
                                                <td className="px-6 py-4">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-600">Total Trainings:</span>
                                                            <span className="text-sm font-medium text-gray-900">
                                                                    {employee.total_trainings_count || 0}
                                                                </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-600">Completed:</span>
                                                            <span className="text-sm font-medium text-green-600">
                                                                    {employee.completed_trainings_count || 0}
                                                                </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-600">Total Hours:</span>
                                                            <span className="text-sm font-medium text-blue-600">
                                                                    {(employee.total_training_hours || 0).toFixed(1)} hrs
                                                                </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            getStatusColor(employee.completed_trainings_count || 0, employee.total_trainings_count || 0)
                                                        }`}>
                                                            {getStatusText(employee.completed_trainings_count || 0, employee.total_trainings_count || 0)}
                                                        </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={route('admin.reports.show', employee.id)}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                                                        >
                                                            <Eye className="w-4 h-4 mr-1" />
                                                            View Details
                                                        </Link>
                                                        <a
                                                            href={route('admin.reports.export-employee', employee.id)}
                                                            target="_blank"
                                                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                                                        >
                                                            <Download className="w-4 h-4 mr-1" />
                                                            Export PDF
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="text-gray-400 mb-4">
                                                <FileText className="w-12 h-12 mx-auto" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No data found</h3>
                                            <p className="text-gray-600">
                                                {selectedEmployees.length > 0 || selectedTrainings.length > 0 || dateRange.start_date || dateRange.end_date
                                                    ? 'Try adjusting your filters to find what you are looking for.'
                                                    : 'No training records available.'
                                                }
                                            </p>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {employees.links && employees.links.length > 3 && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div className="text-sm text-gray-700 mb-4 md:mb-0">
                                        Showing {employees.from || 0} to {employees.to || 0} of {employees.total} results
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        {employees.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                preserveScroll
                                                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
