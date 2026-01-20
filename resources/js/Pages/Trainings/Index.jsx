import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Search,
    Edit,
    Trash2,
    Plus,
    Eye,
    Filter,
    Download,
    Calendar,
    Clock,
    Users,
    Building,
    TrendingUp,
    ChevronDown,
    ChevronUp,
    X,
    CheckCircle,
    AlertCircle,
    PlayCircle,
    GraduationCap
} from 'lucide-react';
import Input from '@/Components/Forms/Input';
import Select from '@/Components/Forms/Select';

export default function Index({ pageTitle, trainings, filters }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [dateFilter, setDateFilter] = useState(filters.date || '');
    const [sortField, setSortField] = useState(filters.short || 'start_date');
    const [sortDirection, setSortDirection] = useState(filters.direction || 'asc');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            updateFilters();
        }, 500);

        return () => clearTimeout(timer);
    }, [search, statusFilter, dateFilter, sortField, sortDirection]);

    const updateFilters = () => {
        const params = {};
        if (search) params.search = search;
        if (statusFilter) params.status = statusFilter;
        if (dateFilter) params.date = dateFilter;
        if (sortField) params.sort = sortField;
        if (sortDirection) params.direction = sortDirection;

        router.get(route('admin.trainings.index'), params, {
            preserveState: true,
            replace: true
        });
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const deleteTraining = (id) => {
        if (confirm('Are you sure you want to delete this training? All employee assignments will be removed.')) {
            router.delete(route('admin.trainings.destroy', id));
        }
    };

    const getTrainingStatus = (training) => {
        const now = new Date();
        const start = new Date(training.start_date);
        const end = new Date(training.end_date);

        if (now < start) return 'upcoming';
        if (now >= start && now <= end) return 'ongoing';
        return 'completed';
    };

    const getStatusBadge = (status) => {
        const config = {
            upcoming: {
                color: 'bg-blue-100 text-blue-800',
                icon: Calendar,
                text: 'Upcoming'
            },
            ongoing: {
                color: 'bg-green-100 text-green-800',
                icon: PlayCircle,
                text: 'Ongoing'
            },
            completed: {
                color: 'bg-gray-100 text-gray-800',
                icon: CheckCircle,
                text: 'Completed'
            }
        };

        const { color, icon: Icon, text } = config[status];
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                <Icon className="w-3 h-3 mr-1" />
                {text}
            </span>
        );
    };

    const getDuration = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffMs = endDate - startDate;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);
        const remainingHours = diffHours % 24;

        if (diffDays > 0) {
            return `${diffDays}d ${remainingHours > 0 ? `${remainingHours}h` : ''}`;
        }
        return `${diffHours}h`;
    };

    const formatDateRange = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);

        if (startDate.toDateString() === endDate.toDateString()) {
            return `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        }

        return `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${endDate.toLocaleDateString()} ${endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    };

    const statusOptions = [
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'ongoing', label: 'Ongoing' },
        { value: 'completed', label: 'Completed' }
    ];

    const dateOptions = [
        { value: 'today', label: 'Today' },
        { value: 'this_week', label: 'This Week' },
        { value: 'next_week', label: 'Next Week' },
        { value: 'this_month', label: 'This Month' },
        { value: 'next_month', label: 'Next Month' }
    ];

    const SortIcon = ({ field }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ?
            <ChevronUp className="w-4 h-4 ml-1" /> :
            <ChevronDown className="w-4 h-4 ml-1" />;
    };

    const getStats = () => {
        const now = new Date();
        return {
            total: trainings.data.length,
            upcoming: trainings.data.filter(t => getTrainingStatus(t) === 'upcoming').length,
            ongoing: trainings.data.filter(t => getTrainingStatus(t) === 'ongoing').length,
            completed: trainings.data.filter(t => getTrainingStatus(t) === 'completed').length,
            totalHours: trainings.data.reduce((sum, t) => {
                const start = new Date(t.start_date);
                const end = new Date(t.end_date);
                return sum + Math.floor((end - start) / (1000 * 60 * 60));
            }, 0),
            totalParticipants: trainings.data.reduce((sum, t) => sum + (t.employees_count || 0), 0)
        };
    };

    const stats = getStats();

    return (
        <AdminLayout>
            <Head title={pageTitle} />

            <div className="py-6">
                <div className="mx-auto sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Training Programs</h2>
                                <p className="text-gray-600 mt-1">
                                    Manage training sessions and employee assignments
                                </p>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center space-x-3">
                                {/*<button*/}
                                {/*    onClick={() => alert('Export functionality would be implemented here')}*/}
                                {/*    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"*/}
                                {/*>*/}
                                {/*    <Download className="w-4 h-4 mr-2" />*/}
                                {/*    Export*/}
                                {/*</button>*/}
                                <Link
                                    href={route('admin.trainings.create')}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Training
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center">
                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total</p>
                                    <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center">
                                <div className="bg-green-100 p-2 rounded-lg mr-3">
                                    <PlayCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Ongoing</p>
                                    <p className="text-xl font-bold text-gray-900">{stats.ongoing}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center">
                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Upcoming</p>
                                    <p className="text-xl font-bold text-gray-900">{stats.upcoming}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center">
                                <div className="bg-gray-100 p-2 rounded-lg mr-3">
                                    <CheckCircle className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Completed</p>
                                    <p className="text-xl font-bold text-gray-900">{stats.completed}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center">
                                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                    <Users className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Participants</p>
                                    <p className="text-xl font-bold text-gray-900">{stats.totalParticipants}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center">
                                <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                                    <Clock className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Hours</p>
                                    <p className="text-xl font-bold text-gray-900">{stats.totalHours}</p>
                                </div>
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
                                            placeholder="Search trainings by name, topic, or trainer..."
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
                                            label="Status"
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            options={statusOptions}
                                            placeholder="All Status"
                                        />
                                        <Select
                                            label="Date Range"
                                            value={dateFilter}
                                            onChange={(e) => setDateFilter(e.target.value)}
                                            options={dateOptions}
                                            placeholder="All Dates"
                                        />
                                        <div className="flex items-end">
                                            <button
                                                onClick={() => {
                                                    setStatusFilter('');
                                                    setDateFilter('');
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

                    {/* Trainings Table */}
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                        {/* Table Header */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-gray-700">
                                    Training Programs
                                </div>
                                <div className="text-sm text-gray-500">
                                    Showing {trainings.from || 0} to {trainings.to || 0} of {trainings.total} trainings
                                </div>
                            </div>
                        </div>

                        {/* Table Content */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center">
                                            Training Program
                                            <SortIcon field="name" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Schedule
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Duration & Location
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('employees_count')}
                                    >
                                        <div className="flex items-center">
                                            Participants
                                            <SortIcon field="employees_count" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('start_date')}
                                    >
                                        <div className="flex items-center">
                                            Status
                                            <SortIcon field="start_date" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {trainings.data.length > 0 ? (
                                    trainings.data.map((training) => {
                                        const status = getTrainingStatus(training);
                                        return (
                                            <React.Fragment key={training.id}>
                                                <tr
                                                    className="hover:bg-gray-50 cursor-pointer"
                                                    onClick={() => setExpandedRow(expandedRow === training.id ? null : training.id)}
                                                >
                                                    {/* Training Info */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-start">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                <GraduationCap className="w-5 h-5 text-blue-600" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {training.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {training.topic}
                                                                </div>
                                                                <div className="text-xs text-gray-400 mt-1">
                                                                    <div className="flex items-center">
                                                                        <Users className="w-3 h-3 mr-1" />
                                                                        Trainer: {training.trainer_name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button
                                                                className="ml-auto text-gray-400 hover:text-gray-600"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setExpandedRow(expandedRow === training.id ? null : training.id);
                                                                }}
                                                            >
                                                                {expandedRow === training.id ?
                                                                    <ChevronUp className="w-4 h-4" /> :
                                                                    <ChevronDown className="w-4 h-4" />
                                                                }
                                                            </button>
                                                        </div>
                                                    </td>

                                                    {/* Schedule */}
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center text-sm text-gray-900">
                                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                                {formatDateRange(training.start_date, training.end_date)}
                                                            </div>
                                                            <div className="text-xs text-gray-500 pl-6">
                                                                {new Date(training.start_date).toLocaleDateString('en-US', { weekday: 'long' })}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Duration & Location */}
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center text-sm text-gray-900">
                                                                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                                                {getDuration(training.start_date, training.end_date)}
                                                            </div>
                                                            <div className="flex items-center text-sm text-gray-900">
                                                                <Building className="w-4 h-4 mr-2 text-gray-400" />
                                                                <span className="truncate max-w-[200px]" title={training.location}>
                                                                        {training.location}
                                                                    </span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Participants */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className="flex-1">
                                                                <div className="flex items-center mb-1">
                                                                    <Users className="w-4 h-4 text-gray-400 mr-2" />
                                                                    <span className="text-sm font-medium text-gray-900">
                                                                            {training.employees_count || 0}
                                                                        </span>
                                                                    <span className="text-xs text-gray-500 ml-1">employees</span>
                                                                </div>
                                                                {training.employees_count > 0 && (
                                                                    <div className="text-xs text-gray-500">
                                                                        Capacity: {training.max_capacity || 'Unlimited'}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {training.employees_count > 0 && (
                                                                <Link
                                                                    href={route('admin.trainings.show', training.id)}
                                                                    className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    View
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-6 py-4">
                                                        {getStatusBadge(status)}
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-2">
                                                            <Link
                                                                href={route('admin.trainings.show', training.id)}
                                                                className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                                title="View Details"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Link>
                                                            <Link
                                                                href={route('admin.trainings.edit', training.id)}
                                                                className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                                                                title="Edit"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </Link>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    deleteTraining(training.id);
                                                                }}
                                                                className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* Expanded Row Details */}
                                                {expandedRow === training.id && (
                                                    <tr>
                                                        <td colSpan="6" className="px-6 py-4 bg-gray-50">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                <div>
                                                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Training Details</h4>
                                                                    <div className="space-y-2 text-sm">
                                                                        <div className="flex">
                                                                            <span className="text-gray-500 w-32">Topic:</span>
                                                                            <span className="text-gray-900">{training.topic}</span>
                                                                        </div>
                                                                        <div className="flex">
                                                                            <span className="text-gray-500 w-32">Description:</span>
                                                                            <span className="text-gray-900">{training.description || 'No description'}</span>
                                                                        </div>
                                                                        <div className="flex">
                                                                            <span className="text-gray-500 w-32">Created:</span>
                                                                            <span className="text-gray-900">
                                                                                    {new Date(training.created_at).toLocaleDateString()}
                                                                                </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Trainer Information</h4>
                                                                    <div className="space-y-2 text-sm">
                                                                        <div className="flex">
                                                                            <span className="text-gray-500 w-32">Name:</span>
                                                                            <span className="text-gray-900">{training.trainer_name}</span>
                                                                        </div>
                                                                        <div className="flex">
                                                                            <span className="text-gray-500 w-32">Email:</span>
                                                                            <span className="text-gray-900">{training.trainer_email}</span>
                                                                        </div>
                                                                        <div className="flex">
                                                                            <span className="text-gray-500 w-32">Phone:</span>
                                                                            <span className="text-gray-900">{training.trainer_phone}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Actions</h4>
                                                                    <div className="space-y-2">
                                                                        <Link
                                                                            href={route('admin.trainings.show', training.id)}
                                                                            className="inline-flex items-center w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                                                        >
                                                                            <Eye className="w-4 h-4 mr-2" />
                                                                            View Participants
                                                                        </Link>
                                                                        <Link
                                                                            href={route('admin.trainings.edit', training.id)}
                                                                            className="inline-flex items-center w-full px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                                                                        >
                                                                            <Edit className="w-4 h-4 mr-2" />
                                                                            Edit Training
                                                                        </Link>
                                                                        {training.employees_count > 0 && (
                                                                            <button
                                                                                onClick={() => alert('Send reminder functionality')}
                                                                                className="inline-flex items-center w-full px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100"
                                                                            >
                                                                                <AlertCircle className="w-4 h-4 mr-2" />
                                                                                Send Reminder
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="text-gray-400 mb-4">
                                                <GraduationCap className="w-12 h-12 mx-auto" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No trainings found</h3>
                                            <p className="text-gray-600 mb-6">
                                                {search || statusFilter || dateFilter
                                                    ? 'Try adjusting your search or filter to find what you are looking for.'
                                                    : 'Get started by creating your first training program.'
                                                }
                                            </p>
                                            <Link
                                                href={route('admin.trainings.create')}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Create Training
                                            </Link>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {trainings.links && trainings.links.length > 3 && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div className="text-sm text-gray-700 mb-4 md:mb-0">
                                        Showing {trainings.from || 0} to {trainings.to || 0} of {trainings.total} results
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        {trainings.links.map((link, index) => (
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
