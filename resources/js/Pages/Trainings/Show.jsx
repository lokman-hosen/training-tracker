import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Calendar,
    Clock,
    Users,
    Building,
    Mail,
    Phone,
    FileText,
    CheckCircle,
    XCircle,
    UserPlus,
    Trash2,
    Download,
    Send,
    ChevronDown,
    ChevronUp,
    Edit,
    ArrowLeft,
    TrendingUp,
    Award,
    BarChart3,
    GraduationCap,
    ChevronRight, User
} from 'lucide-react';
import Select from '@/Components/Forms/Select';
import Input from '@/Components/Forms/Input';

export default function Show({ training, availableEmployees }) {
    console.log(training)
    const [expandedEmployee, setExpandedEmployee] = useState(null);
    const [showAssignForm, setShowAssignForm] = useState(false);
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    const assignForm = useForm({
        employee_ids: [], // Changed from employee_id to employee_ids (array)
        attended: false,
        completed: false,
        grade: '',
        feedback: ''
    });

    // Update assignForm data when selectedEmployees changes
    React.useEffect(() => {
        assignForm.setData('employee_ids', selectedEmployees);
    }, [selectedEmployees]);

    const getTrainingStatus = () => {
        const now = new Date();
        const start = new Date(training.start_date);
        const end = new Date(training.end_date);

        if (now < start) return { status: 'upcoming', color: 'bg-blue-100 text-blue-800', label: 'Upcoming' };
        if (now >= start && now <= end) return { status: 'ongoing', color: 'bg-green-100 text-green-800', label: 'Ongoing' };
        return { status: 'completed', color: 'bg-gray-100 text-gray-800', label: 'Completed' };
    };

    const updateEmployeeStatus = (employeeId, data) => {
        router.put(route('admin.trainings.update-status', [training.id, employeeId]), data, {
            preserveScroll: true
        });
    };

    const assignEmployee = (e) => {
        e.preventDefault();
        assignForm.post(route('admin.trainings.assign-employees', training.id), {
            preserveScroll: true,
            onSuccess: () => {
                assignForm.reset();
                setSelectedEmployees([]);
                setShowAssignForm(false);
            }
        });
    };

    const removeEmployee = (employeeId) => {
        if (confirm('Are you sure you want to remove this employee from the training?')) {
            router.delete(route('admin.trainings.remove-employee', [training.id, employeeId]), {
                preserveScroll: true
            });
        }
    };

    const toggleEmployeeSelection = (employeeId) => {
        setSelectedEmployees(prev =>
            prev.includes(employeeId)
                ? prev.filter(id => id !== employeeId)
                : [...prev, employeeId]
        );
    };

    const selectAllAvailable = () => {
        if (selectedEmployees.length === availableEmployees.length) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees(availableEmployees.map(emp => emp.id));
        }
    };

    const getCompletionStats = () => {
        const total = training.employees.length;
        const attended = training.employees.filter(e => e.pivot.attended).length;
        const completed = training.employees.filter(e => e.pivot.completed).length;
        const avgGrade = training.employees
                .filter(e => e.pivot.grade)
                .reduce((sum, e) => sum + (parseFloat(e.pivot.grade) || 0), 0) /
            training.employees.filter(e => e.pivot.grade).length || 0;

        return { total, attended, completed, avgGrade: avgGrade.toFixed(1) };
    };

    const formatDateRange = () => {
        const start = new Date(training.start_date);
        const end = new Date(training.end_date);

        return `${start.toLocaleDateString()} ${start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${end.toLocaleDateString()} ${end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    };

    const getDuration = (start, end) => {
        console.log(start, end)
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

    const gradeOptions = [
        { value: 'A+', label: 'A+ (Excellent)' },
        { value: 'A', label: 'A (Very Good)' },
        { value: 'B+', label: 'B+ (Good)' },
        { value: 'B', label: 'B (Satisfactory)' },
        { value: 'C', label: 'C (Needs Improvement)' },
        { value: 'D', label: 'D (Poor)' },
        { value: 'F', label: 'F (Failed)' }
    ];

    const stats = getCompletionStats();
    const status = getTrainingStatus();

    return (
        <AdminLayout>
            <Head title={`Training - ${training.name}`} />

            <div className="py-6">
                <div className="mx-auto sm:px-6 lg:px-8">
                    {/* Header Navigation */}
                    <div className="mb-6">
                        <Link
                            href={route('admin.trainings.index')}
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Trainings
                        </Link>
                    </div>

                    {/* Training Header */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-start">
                                        <div className="bg-blue-100 p-3 rounded-xl mr-4">
                                            <GraduationCap className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center flex-wrap gap-2">
                                                <h1 className="text-2xl font-bold text-gray-900">{training.name}</h1>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mt-2">{training.topic}</p>
                                            <div className="flex flex-wrap gap-4 mt-4">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    {formatDateRange()}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Clock className="w-4 h-4 mr-2" />
                                                    {getDuration()}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Building className="w-4 h-4 mr-2" />
                                                    {training.location}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0 flex items-center space-x-3">
                                    <Link
                                        href={route('admin.trainings.edit', training.id)}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </Link>
                                    {/*<button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">*/}
                                    {/*    <Send className="w-4 h-4 mr-2" />*/}
                                    {/*    Send Reminders*/}
                                    {/*</button>*/}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center">
                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Participants</p>
                                    <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center">
                                <div className="bg-green-100 p-2 rounded-lg mr-3">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Attended</p>
                                    <p className="text-xl font-bold text-gray-900">{stats.attended}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center">
                                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                    <Award className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Completed</p>
                                    <p className="text-xl font-bold text-gray-900">{stats.completed}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center">
                                <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                                    <TrendingUp className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Avg. Grade</p>
                                    <p className="text-xl font-bold text-gray-900">{stats.avgGrade}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Training Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Participants Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Participants</h3>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => setShowAssignForm(!showAssignForm)}
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            <UserPlus className="w-4 h-4 mr-1" />
                                            Assign Employee
                                        </button>
                                        {/*<button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50">*/}
                                        {/*    <Download className="w-4 h-4 mr-1" />*/}
                                        {/*    Export List*/}
                                        {/*</button>*/}
                                    </div>
                                </div>

                                {/* Assign Employee Form */}
                                {showAssignForm && availableEmployees.length > 0 && (
                                    <div className="p-6 border-b border-gray-200 bg-blue-50">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-medium text-gray-900">Assign Multiple Employees</h4>
                                            <button
                                                type="button"
                                                onClick={selectAllAvailable}
                                                className="text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                {selectedEmployees.length === availableEmployees.length
                                                    ? 'Deselect All'
                                                    : 'Select All'
                                                }
                                            </button>
                                        </div>

                                        <form onSubmit={assignEmployee} className="space-y-4">
                                            {/* Multi-select employees */}
                                            <div className="border border-gray-300 rounded-lg bg-white max-h-60 overflow-y-auto">
                                                {availableEmployees.map((employee) => (
                                                    <div
                                                        key={employee.id}
                                                        className={`flex items-center p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                                                            selectedEmployees.includes(employee.id) ? 'bg-blue-50' : ''
                                                        }`}
                                                        onClick={() => toggleEmployeeSelection(employee.id)}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedEmployees.includes(employee.id)}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                toggleEmployeeSelection(employee.id);
                                                            }}
                                                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-3"
                                                        />
                                                        <div className="flex items-center flex-1">
                                                            <div className="flex-shrink-0 h-8 w-8 mr-3">
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
                                                            <div className="flex-1">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {employee.name}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {employee.id_number ?? employee.phone} • {employee.department || 'No Department'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {assignForm.errors.employee_ids && (
                                                <p className="text-sm text-red-600">{assignForm.errors.employee_ids}</p>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex items-center justify-between pt-4">
                                                <div className="text-sm text-blue-700">
                                                    {selectedEmployees.length} employee(s) selected
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowAssignForm(false);
                                                            setSelectedEmployees([]);
                                                        }}
                                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={assignForm.processing || selectedEmployees.length === 0}
                                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {assignForm.processing ? 'Assigning...' : 'Assign Selected'}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {showAssignForm && availableEmployees.length === 0 && (
                                    <div className="p-6 border-b border-gray-200 bg-blue-50">
                                        <div className="text-center py-4">
                                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-500">No employees available to assign</p>
                                            <p className="text-sm text-gray-400 mt-1">
                                                All employees are already assigned to this training
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Participants List */}
                                <div className="divide-y">
                                    {training.employees.length > 0 ? (
                                        training.employees.map((employee) => (
                                            <div key={employee.id} className="p-4 hover:bg-gray-50">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start flex-1">
                                                        <div className="flex-shrink-0">
                                                            {employee.image ? (
                                                                <img
                                                                    className="h-10 w-10 rounded-full object-cover"
                                                                    src={employee.image}
                                                                    alt={employee.name}
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                                    <User className="w-5 h-5 text-gray-500" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4 flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <h4 className="font-medium text-gray-900">{employee.name}</h4>
                                                                    <p className="text-sm text-gray-500">
                                                                        {employee.id_number ?? employee.phone} • {employee.department}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    {employee.pivot.attended ? (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                                            Attended
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                                            <XCircle className="w-3 h-3 mr-1" />
                                                                            Not Attended
                                                                        </span>
                                                                    )}
                                                                    {employee.pivot.completed && (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                            Completed
                                                                        </span>
                                                                    )}
                                                                    {employee.pivot.grade && (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                            Grade: {employee.pivot.grade}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Status Update Form */}
                                                            <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-2">
                                                                <label className="flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={employee.pivot.attended}
                                                                        onChange={(e) => updateEmployeeStatus(employee.id, { attended: e.target.checked })}
                                                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                                                    />
                                                                    <span className="ml-2 text-sm text-gray-700">Attended</span>
                                                                </label>
                                                                <label className="flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={employee.pivot.completed}
                                                                        onChange={(e) => updateEmployeeStatus(employee.id, { completed: e.target.checked })}
                                                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                                                    />
                                                                    <span className="ml-2 text-sm text-gray-700">Completed</span>
                                                                </label>
                                                                <div>
                                                                    <select
                                                                        value={employee.pivot.grade || ''}
                                                                        onChange={(e) => updateEmployeeStatus(employee.id, { grade: e.target.value })}
                                                                        className="block w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                                    >
                                                                        <option value="">Grade</option>
                                                                        {gradeOptions.map(option => (
                                                                            <option key={option.value} value={option.value}>
                                                                                {option.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <button
                                                                        onClick={() => removeEmployee(employee.id)}
                                                                        className="px-2 py-1 text-xs text-red-600 hover:text-red-800"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {employee.pivot.feedback && (
                                                                <div className="mt-2">
                                                                    <p className="text-sm text-gray-600">
                                                                        <span className="font-medium">Feedback:</span> {employee.pivot.feedback}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center">
                                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500">No employees assigned to this training yet</p>
                                            <button
                                                onClick={() => setShowAssignForm(true)}
                                                className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-800"
                                            >
                                                <UserPlus className="w-4 h-4 mr-1" />
                                                Assign employees now
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Training Description</h3>
                                </div>
                                <div className="p-6">
                                    {training.description ? (
                                        <div className="prose max-w-none">
                                            <p className="text-gray-700 whitespace-pre-line">{training.description}</p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic">No description provided for this training.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Trainer Info & Actions */}
                        <div className="space-y-6">
                            {/* Trainer Information */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Trainer Information</h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{training.trainer_name}</p>
                                            <p className="text-xs text-gray-500">Primary Trainer</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-gray-700">
                                                <Mail className="w-4 h-4 mr-3 text-gray-400" />
                                                {training.trainer_email}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-700">
                                                <Phone className="w-4 h-4 mr-3 text-gray-400" />
                                                {training.trainer_phone}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Training Details */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Training Details</h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Status</span>
                                            <span className={`text-sm font-medium ${status.color} px-2 py-1 rounded-full`}>
                                                {status.label}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Duration</span>
                                            <span className="text-sm font-medium text-gray-900">{getDuration(training.start_date, training.end_date)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Location</span>
                                            <span className="text-sm font-medium text-gray-900">{training.location}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Created On</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {new Date(training.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Last Updated</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {new Date(training.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            {/*<div className="bg-white rounded-xl shadow-sm border border-gray-200">*/}
                            {/*    <div className="px-6 py-4 border-b border-gray-200">*/}
                            {/*        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>*/}
                            {/*    </div>*/}
                            {/*    <div className="p-4 space-y-2">*/}
                            {/*        <Link*/}
                            {/*            href={route('admin.trainings.edit', training.id)}*/}
                            {/*            className="flex items-center justify-between p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"*/}
                            {/*        >*/}
                            {/*            <div className="flex items-center">*/}
                            {/*                <Edit className="w-5 h-5 text-blue-600 mr-3" />*/}
                            {/*                <span className="font-medium text-gray-900">Edit Training</span>*/}
                            {/*            </div>*/}
                            {/*            <ChevronRight className="w-4 h-4 text-gray-400" />*/}
                            {/*        </Link>*/}
                            {/*        <button className="flex items-center justify-between w-full p-3 border rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors">*/}
                            {/*            <div className="flex items-center">*/}
                            {/*                <Send className="w-5 h-5 text-green-600 mr-3" />*/}
                            {/*                <span className="font-medium text-gray-900">Send Reminders</span>*/}
                            {/*            </div>*/}
                            {/*            <ChevronRight className="w-4 h-4 text-gray-400" />*/}
                            {/*        </button>*/}
                            {/*        <button className="flex items-center justify-between w-full p-3 border rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors">*/}
                            {/*            <div className="flex items-center">*/}
                            {/*                <Download className="w-5 h-5 text-purple-600 mr-3" />*/}
                            {/*                <span className="font-medium text-gray-900">Export Report</span>*/}
                            {/*            </div>*/}
                            {/*            <ChevronRight className="w-4 h-4 text-gray-400" />*/}
                            {/*        </button>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
