// resources/js/Pages/Admin/Employees/Index.jsx
import React, { useState, useEffect, useRef} from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Search,
    Edit,
    Trash2,
    UserPlus,
    Eye,
    Filter,
    Download,
    MoreVertical,
    User,
    Building,
    Phone,
    Mail,
    Calendar,
    GraduationCap,
    ChevronDown,
    ChevronUp,
    X
} from 'lucide-react';
import Input from '@/Components/Forms/Input';
import Select from '@/Components/Forms/Select';

export default function Index({ employees, departments, filters }) {
    console.log(employees);
    const safeFilters = filters || [];
    const { auth } = usePage().props;
    const [search, setSearch] = useState(safeFilters?.search || '');
    const [selectedDepartment, setSelectedDepartment] = useState(safeFilters?.department || '');
    const [selectedStatus, setSelectedStatus] = useState(safeFilters?.status || '');
    //const [sortField, setSortField] = useState(safeFilters?.sort || '');
    const [sortDirection, setSortDirection] = useState(safeFilters?.direction || 'asc');
    const [selectedRows, setSelectedRows] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);

    // Use a ref to prevent useEffect from running on initial render for filters/sort
    const initialRender = useRef(true);


    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            updateFilters();
        }, 500);

        return () => clearTimeout(timer);
    }, [search, selectedDepartment, selectedStatus, sortDirection]);

    const updateFilters = () => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }
        const params = {};
        if (search) params.search = search;
        if (selectedDepartment) params.department = selectedDepartment;
        if (selectedStatus) params.status = selectedStatus;
        //if (sortField) params.sort = sortField;
        if (sortDirection) params.direction = sortDirection;

        router.get(route('admin.employees.index'), params, {
            preserveState: true,
            replace: true
        });
    };

    // const handleSort = (field) => {
    //     if (sortField === field) {
    //         setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    //     } else {
    //         setSortField(field);
    //         setSortDirection('asc');
    //     }
    // };

    const deleteEmployee = (id) => {
        if (confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
            router.delete(route('admin.employees.destroy', id));
        }
    };

    const deleteSelected = () => {
        if (selectedRows.length === 0) {
            alert('Please select employees to delete.');
            return;
        }

        if (confirm(`Are you sure you want to delete ${selectedRows.length} selected employee(s)?`)) {
            // Batch delete implementation would go here
            // For now, we'll delete individually
            selectedRows.forEach(id => {
                router.delete(route('admin.employees.destroy', id));
            });
            setSelectedRows([]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedRows.length === employees.data.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(employees.data.map(emp => emp.id));
        }
    };

    const toggleSelectRow = (id) => {
        if (selectedRows.includes(id)) {
            setSelectedRows(selectedRows.filter(rowId => rowId !== id));
        } else {
            setSelectedRows([...selectedRows, id]);
        }
    };

    const toggleExpandRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const exportToCSV = () => {
        // Export functionality would go here
        alert('Export functionality would be implemented here');
    };

    const getUniqueDepartments = () => {
        const departments = employees.data
            .map(emp => emp.department)
            .filter(dept => dept)
            .filter((dept, index, self) => self.indexOf(dept) === index);

        return departments.map(dept => ({
            value: dept,
            label: dept
        }));
    };

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
    ];

    const SortIcon = ({ field }) => {
        //if (sortField !== field) return null;
        return sortDirection === 'asc' ?
            <ChevronUp className="w-4 h-4 ml-1" /> :
            <ChevronDown className="w-4 h-4 ml-1" />;
    };

    return (
        <AdminLayout>
            <Head title="Employees Management" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Employees Management</h2>
                                <p className="text-gray-600 mt-1">
                                    Manage all employees and their training records
                                </p>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center space-x-3">
                                <button
                                    onClick={exportToCSV}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </button>
                                <Link
                                    href={route('admin.employees.create')}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Add Employee
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="p-6">
                            {/* Main Search Bar */}
                            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <Input
                                            type="search"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search employees by name, ID, email, or phone..."
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filters
                                    {showFilters && <X className="w-4 h-4 ml-2" />}
                                </button>
                            </div>

                            {/* Advanced Filters */}
                            {showFilters && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Select
                                            label="Department"
                                            value={selectedDepartment}
                                            onChange={(e) => setSelectedDepartment(e.target.value)}
                                            options={getUniqueDepartments()}
                                            placeholder="All Departments"
                                        />
                                        <Select
                                            label="Status"
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            options={statusOptions}
                                            placeholder="All Status"
                                        />
                                        <div className="flex items-end">
                                            <button
                                                onClick={() => {
                                                    setSelectedDepartment('');
                                                    setSelectedStatus('');
                                                    setSearch('');
                                                }}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Clear Filters
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Selected Actions Bar */}
                    {selectedRows.length > 0 && (
                        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-blue-800">
                                            {selectedRows.length} employee(s) selected
                                        </p>
                                        <p className="text-sm text-blue-600">
                                            Choose an action to perform on selected employees
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => setSelectedRows([])}
                                        className="px-3 py-1 text-sm text-blue-700 hover:text-blue-900"
                                    >
                                        Deselect All
                                    </button>
                                    <button
                                        onClick={deleteSelected}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Selected
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Employees Table */}
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                        {/* Table Header */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.length === employees.data.length && employees.data.length > 0}
                                        onChange={toggleSelectAll}
                                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="ml-3 text-sm font-medium text-gray-700">
                                        Select All
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Showing {employees.from} to {employees.to} of {employees.total} employees
                                </div>
                            </div>
                        </div>

                        {/* Table Content */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="w-12 px-6 py-3">
                                        <span className="sr-only">Select</span>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center">
                                            Employee
                                            <SortIcon field="name" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('department')}
                                    >
                                        <div className="flex items-center">
                                            Department
                                            <SortIcon field="department" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('joining_date')}
                                    >
                                        <div className="flex items-center">
                                            Joining Date
                                            <SortIcon field="joining_date" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trainings
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
                                                {/* Checkbox */}
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRows.includes(employee.id)}
                                                        onChange={() => toggleSelectRow(employee.id)}
                                                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                    />
                                                </td>

                                                {/* Employee Info */}
                                                <td className="px-6 py-4">
                                                    <div
                                                        className="flex items-center cursor-pointer"
                                                        onClick={() => toggleExpandRow(employee.id)}
                                                    >
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            {employee.image ? (
                                                                <img
                                                                    className="h-10 w-10 rounded-full object-cover"
                                                                    src={employee.image}
                                                                    alt={employee.name}
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                                    <User className="w-6 h-6 text-blue-600" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {employee.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {employee.employee_id}
                                                            </div>
                                                            <div className="text-xs text-gray-400 mt-1">
                                                                {employee.designation}
                                                            </div>
                                                        </div>
                                                        <button
                                                            className="ml-2 text-gray-400 hover:text-gray-600"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleExpandRow(employee.id);
                                                            }}
                                                        >
                                                            {expandedRow === employee.id ?
                                                                <ChevronUp className="w-4 h-4" /> :
                                                                <ChevronDown className="w-4 h-4" />
                                                            }
                                                        </button>
                                                    </div>
                                                </td>

                                                {/* Contact Info */}
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        {employee.email && (
                                                            <div className="flex items-center text-sm text-gray-900">
                                                                <Mail className="w-3 h-3 mr-1 text-gray-400" />
                                                                {employee.email}
                                                            </div>
                                                        )}
                                                        <div className="flex items-center text-sm text-gray-900">
                                                            <Phone className="w-3 h-3 mr-1 text-gray-400" />
                                                            {employee.phone}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Department */}
                                                <td className="px-6 py-4">
                                                    {employee.department ? (
                                                        <div className="flex items-center">
                                                            <Building className="w-4 h-4 text-gray-400 mr-2" />
                                                            <span className="text-sm text-gray-900">
                                                                    {employee.department}
                                                                </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">Not assigned</span>
                                                    )}
                                                </td>

                                                {/* Joining Date */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {employee.joining_date ? (
                                                        <div className="flex items-center text-sm text-gray-900">
                                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                            {new Date(employee.joining_date).toLocaleDateString()}
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">N/A</span>
                                                    )}
                                                </td>

                                                {/* Trainings */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="flex-1">
                                                            <div className="flex items-center mb-1">
                                                                <GraduationCap className="w-4 h-4 text-gray-400 mr-2" />
                                                                <span className="text-sm font-medium text-gray-900">
                                                                        {employee.trainings_count || 0}
                                                                    </span>
                                                                <span className="text-xs text-gray-500 ml-1">trainings</span>
                                                            </div>
                                                            {employee.trainings_count > 0 && (
                                                                <div className="text-xs text-gray-500">
                                                                    {employee.completed_trainings || 0} completed
                                                                </div>
                                                            )}
                                                        </div>
                                                        {employee.trainings_count > 0 && (
                                                            <Link
                                                                href={route('admin.employees.show', employee.id)}
                                                                className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                                                            >
                                                                View
                                                            </Link>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={route('admin.employees.show', employee.id)}
                                                            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                        <Link
                                                            href={route('admin.employees.edit', employee.id)}
                                                            className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => deleteEmployee(employee.id)}
                                                            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                        <div className="relative">
                                                            <button
                                                                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                                                                title="More options"
                                                            >
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Expanded Row Details */}
                                            {expandedRow === employee.id && (
                                                <tr>
                                                    <td colSpan="7" className="px-6 py-4 bg-gray-50">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-900 mb-2">Employee Details</h4>
                                                                <div className="space-y-2 text-sm">
                                                                    <div className="flex">
                                                                        <span className="text-gray-500 w-32">Employee ID:</span>
                                                                        <span className="text-gray-900">{employee.employee_id}</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-500 w-32">Designation:</span>
                                                                        <span className="text-gray-900">{employee.designation}</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-500 w-32">Department:</span>
                                                                        <span className="text-gray-900">{employee.department || 'N/A'}</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-500 w-32">Joining Date:</span>
                                                                        <span className="text-gray-900">
                                                                                {employee.joining_date ?
                                                                                    new Date(employee.joining_date).toLocaleDateString() :
                                                                                    'N/A'
                                                                                }
                                                                            </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h4>
                                                                <div className="space-y-2 text-sm">
                                                                    <div className="flex">
                                                                        <span className="text-gray-500 w-32">Email:</span>
                                                                        <span className="text-gray-900">{employee.email || 'N/A'}</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-500 w-32">Phone:</span>
                                                                        <span className="text-gray-900">{employee.phone}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-900 mb-2">Training Summary</h4>
                                                                <div className="space-y-2 text-sm">
                                                                    <div className="flex">
                                                                        <span className="text-gray-500 w-32">Total Trainings:</span>
                                                                        <span className="text-gray-900">{employee.trainings_count || 0}</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-500 w-32">Completed:</span>
                                                                        <span className="text-gray-900">{employee.completed_trainings || 0}</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-500 w-32">In Progress:</span>
                                                                        <span className="text-gray-900">
                                                                                {(employee.trainings_count || 0) - (employee.completed_trainings || 0)}
                                                                            </span>
                                                                    </div>
                                                                    <div className="mt-3">
                                                                        <Link
                                                                            href={route('admin.employees.show', employee.id)}
                                                                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                                                        >
                                                                            View all trainings
                                                                            <ArrowRight className="w-4 h-4 ml-1" />
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center">
                                            <div className="text-gray-400 mb-4">
                                                <User className="w-12 h-12 mx-auto" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
                                            <p className="text-gray-600 mb-6">
                                                {search || selectedDepartment || selectedStatus
                                                    ? 'Try adjusting your search or filter to find what you are looking for.'
                                                    : 'Get started by adding your first employee.'
                                                }
                                            </p>
                                            <Link
                                                href={route('admin.employees.create')}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                                            >
                                                <UserPlus className="w-4 h-4 mr-2" />
                                                Add Employee
                                            </Link>
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
                                        Showing {employees.from} to {employees.to} of {employees.total} results
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

                    {/* Quick Stats */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center">
                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                    <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Employees</p>
                                    <p className="text-xl font-bold text-gray-900">{employees.total}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center">
                                <div className="bg-green-100 p-2 rounded-lg mr-3">
                                    <GraduationCap className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Avg. Trainings</p>
                                    <p className="text-xl font-bold text-gray-900">
                                        {employees.data.length > 0
                                            ? Math.round(employees.data.reduce((sum, emp) => sum + (emp.trainings_count || 0), 0) / employees.data.length)
                                            : 0
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center">
                                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                    <Building className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Departments</p>
                                    <p className="text-xl font-bold text-gray-900">
                                        {getUniqueDepartments().length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center">
                                <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                                    <Calendar className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Recently Added</p>
                                    <p className="text-xl font-bold text-gray-900">
                                        {employees.data.filter(emp => {
                                            const joiningDate = new Date(emp.created_at);
                                            const weekAgo = new Date();
                                            weekAgo.setDate(weekAgo.getDate() - 7);
                                            return joiningDate > weekAgo;
                                        }).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
