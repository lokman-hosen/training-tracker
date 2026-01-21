// resources/js/Pages/Admin/Reports/Show.jsx
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    ArrowLeft,
    Download,
    User,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    Mail,
    Phone,
    Building,
    Award,
    TrendingUp,
    FileText
} from 'lucide-react';

export default function Show({ employee, totalHours }) {
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (attended, completed) => {
        if (completed) {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                </span>
            );
        }
        if (attended) {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Attended
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                <XCircle className="w-3 h-3 mr-1" />
                Not Attended
            </span>
        );
    };

    const stats = {
        total: employee.trainings.length,
        attended: employee.trainings.filter(t => t.pivot.attended).length,
        completed: employee.trainings.filter(t => t.pivot.completed).length,
        averageGrade: employee.trainings
                .filter(t => t.pivot.grade)
                .reduce((sum, t) => sum + (t.pivot.grade ? 1 : 0), 0) /
            employee.trainings.filter(t => t.pivot.grade).length || 0
    };

    return (
        <AdminLayout>
            <Head title={`Report - ${employee.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={route('admin.reports.index')}
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Reports
                        </Link>
                    </div>

                    {/* Employee Header */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-start justify-between">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        {employee.image ? (
                                            <img
                                                className="h-20 w-20 rounded-full object-cover"
                                                src={employee.image}
                                                alt={employee.name}
                                            />
                                        ) : (
                                            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                                                <User className="w-10 h-10 text-blue-600" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-6">
                                        <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
                                        <div className="flex items-center space-x-4 mt-2">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <span className="font-medium">ID:</span>
                                                <span className="ml-1">{employee.id_number}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Building className="w-4 h-4 mr-1" />
                                                {employee.department || 'No Department'}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <span className="font-medium">Designation:</span>
                                                <span className="ml-1">{employee.designation}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4 mt-2">
                                            {employee.email && (
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Mail className="w-4 h-4 mr-1" />
                                                    {employee.email}
                                                </div>
                                            )}
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Phone className="w-4 h-4 mr-1" />
                                                {employee.phone}
                                            </div>
                                            {employee.joining_date && (
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    Joined: {new Date(employee.joining_date).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <a
                                        href={route('admin.reports.export-employee', employee.id)}
                                        target="_blank"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Export PDF Report
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center">
                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Trainings</p>
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
                                    <Clock className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Hours</p>
                                    {/*<p className="text-xl font-bold text-gray-900">{totalHours.toFixed(1)}</p>*/}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Training Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-900">Training History</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Training Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Topic
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Schedule
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Duration
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Grade
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {employee.trainings.length > 0 ? (
                                    <>
                                        {employee.trainings.map((training) => (
                                            <tr key={training.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {training.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Trainer: {training.trainer_name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {training.topic}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="text-sm text-gray-900">
                                                            <Calendar className="inline w-4 h-4 mr-1" />
                                                            {formatDateTime(training.start_date)}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            to {formatDateTime(training.end_date)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 text-center">
                                                    {training.training_hours.toFixed(1)} hrs
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(training.pivot.attended, training.pivot.completed)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {training.pivot.grade ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                {training.pivot.grade}
                                                            </span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {/* Summary Row */}
                                        <tr className="bg-blue-50">
                                            <td colSpan="3" className="px-6 py-4 text-right">
                                                <div className="text-sm font-bold text-gray-900">
                                                    Total Completed Training Hours:
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="text-lg font-bold text-blue-700">
                                                    {totalHours.toFixed(1)} hrs
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="text-sm font-medium text-gray-700">
                                                    {stats.attended} attended / {stats.completed} completed
                                                </div>
                                            </td>
                                            <td className="px-6 py-4"></td>
                                        </tr>
                                    </>
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="text-gray-400 mb-4">
                                                <GraduationCap className="w-12 h-12 mx-auto" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No training records</h3>
                                            <p className="text-gray-600">
                                                This employee has not been assigned to any training programs yet.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
