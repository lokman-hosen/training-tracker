// resources/js/Pages/Admin/Dashboard.jsx
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Users,
    UserCircle,
    GraduationCap,
    TrendingUp,
    Calendar,
    Clock,
    Award,
    CheckCircle,
    BarChart3,
    Activity,
    Clock4,
    UserCheck,
    Plus,
    ArrowRight,
    ChevronRight,
    Download,
    Filter
} from 'lucide-react';

export default function Dashboard({
                                      stats = {
                                          totalUsers: 0,
                                          totalEmployees: 0,
                                          totalTrainings: 0,
                                          ongoingTrainings: 0,
                                          completedTrainings: 0,
                                          totalTrainingHours: 0,
                                          activeEmployees: 0,
                                          avgCompletionRate: 0
                                      },
                                      upcomingTrainings = [],
                                      recentActivities = [],
                                      trainingStats = {
                                          monthlyData: [],
                                          departmentStats: [],
                                          topPerformers: []
                                      },
                                      quickStats = {}
                                  }) {
    const cards = [
        {
            title: 'Total Employees',
            value: stats.totalEmployees,
            icon: Users,
            color: 'bg-blue-500',
            textColor: 'text-blue-500',
            bgColor: 'bg-blue-50',
            change: '+12%',
            trend: 'up',
            route: 'admin.employees.index'
        },
        {
            title: 'Total Trainings',
            value: stats.totalTrainings,
            icon: GraduationCap,
            color: 'bg-purple-500',
            textColor: 'text-purple-500',
            bgColor: 'bg-purple-50',
            change: '+8%',
            trend: 'up',
            route: 'admin.trainings.index'
        },
        {
            title: 'Ongoing Trainings',
            value: stats.ongoingTrainings,
            icon: Activity,
            color: 'bg-yellow-500',
            textColor: 'text-yellow-500',
            bgColor: 'bg-yellow-50',
            change: '+3',
            trend: 'up',
            route: 'admin.trainings.index'
        },
        {
            title: 'Training Hours',
            value: stats.totalTrainingHours,
            icon: Clock4,
            color: 'bg-green-500',
            textColor: 'text-green-500',
            bgColor: 'bg-green-50',
            change: '+24h',
            trend: 'up',
            suffix: 'hrs'
        }
    ];

    const quickActions = [
        {
            title: 'Add Employee',
            description: 'Register new employee',
            icon: UserCircle,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            route: 'admin.employees.create'
        },
        {
            title: 'Create Training',
            description: 'Schedule new training session',
            icon: GraduationCap,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
            route: 'admin.trainings.create'
        },
        {
            title: 'Assign Training',
            description: 'Assign employee to training',
            icon: UserCheck,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            route: 'admin.trainings.index'
        },
        {
            title: 'Generate Report',
            description: 'Download training reports',
            icon: Download,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
            route: '#'
        }
    ];

    return (
        <AdminLayout>
            <Head title="Dashboard" />

            <div className="py-6">
                <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                                <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your training program.</p>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center space-x-3">
                                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filter
                                </button>
                                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export Report
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            Last updated: Today, {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {cards.map((card, index) => (
                            <div
                                key={index}
                                className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${card.route ? 'cursor-pointer' : 'cursor-default'}`}

                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">{card.title}</p>
                                            <div className="flex items-baseline mt-2">
                                                <p className="text-3xl font-bold text-gray-900">
                                                    {card.value}
                                                    {card.suffix && <span className="text-lg ml-1">{card.suffix}</span>}
                                                </p>
                                                <span className={`ml-3 text-sm font-medium ${card.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {card.change}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`${card.color} p-3 rounded-xl`}>
                                            <card.icon className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center text-sm text-gray-500">
                                        <TrendingUp className="w-4 h-4 mr-1" />
                                        <span>From last month</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Left Column - Training Overview */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Training Activity Chart */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900">Training Activity</h3>
                                        <select className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                                            <option>Last 7 days</option>
                                            <option>Last 30 days</option>
                                            <option>Last 90 days</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {/* Chart Placeholder */}
                                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                                        <div className="text-center">
                                            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-500">Training activity chart will appear here</p>
                                            <p className="text-sm text-gray-400 mt-1">Shows training completion over time</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-700">{stats.completedTrainings || 0}</div>
                                            <div className="text-sm text-blue-600">Completed</div>
                                        </div>
                                        <div className="p-4 bg-yellow-50 rounded-lg">
                                            <div className="text-2xl font-bold text-yellow-700">{stats.ongoingTrainings || 0}</div>
                                            <div className="text-sm text-yellow-600">In Progress</div>
                                        </div>
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <div className="text-2xl font-bold text-green-700">{stats.avgCompletionRate || 0}%</div>
                                            <div className="text-sm text-green-600">Completion Rate</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Upcoming Trainings */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Upcoming Trainings</h3>
                                    <Link
                                        href={route('admin.trainings.index')}
                                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                    >
                                        View all
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                                <div className="divide-y">
                                    {upcomingTrainings.length > 0 ? (
                                        upcomingTrainings.map((training, index) => (
                                            <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center">
                                                            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                                                <Calendar className="w-5 h-5 text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-gray-900">{training.name}</h4>
                                                                <p className="text-sm text-gray-600">{training.topic}</p>
                                                            </div>
                                                        </div>
                                                        <div className="ml-11 mt-2 flex flex-wrap gap-3">
                                                            <span className="inline-flex items-center text-sm text-gray-500">
                                                                <Clock className="w-4 h-4 mr-1" />
                                                                {training.start_date && new Date(training.start_date).toLocaleDateString()}
                                                            </span>
                                                            <span className="inline-flex items-center text-sm text-gray-500">
                                                                <UserCircle className="w-4 h-4 mr-1" />
                                                                {training.trainer_name}
                                                            </span>
                                                            <span className="inline-flex items-center text-sm text-gray-500">
                                                                <Users className="w-4 h-4 mr-1" />
                                                                {training.participants_count || 0} participants
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                            Upcoming
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center">
                                            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500">No upcoming trainings scheduled</p>
                                            <Link
                                                href={route('admin.trainings.create')}
                                                className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-800"
                                            >
                                                <Plus className="w-4 h-4 mr-1" />
                                                Schedule a training
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        {quickActions.map((action, index) => (
                                            <Link
                                                key={index}

                                                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-200 transition-colors group"
                                            >
                                                <div className={`${action.bgColor} p-3 rounded-lg mb-3 group-hover:scale-105 transition-transform`}>
                                                    <action.icon className={`w-6 h-6 ${action.color}`} />
                                                </div>
                                                <span className="font-medium text-gray-900 text-sm text-center">
                                                    {action.title}
                                                </span>
                                                <span className="text-xs text-gray-500 text-center mt-1">
                                                    {action.description}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Top Performers */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
                                </div>
                                <div className="p-4">
                                    {trainingStats.topPerformers && trainingStats.topPerformers.length > 0 ? (
                                        <div className="space-y-4">
                                            {trainingStats.topPerformers.slice(0, 5).map((employee, index) => (
                                                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex-shrink-0">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <span className="font-bold text-blue-600">
                                                                {index + 1}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                                                                <p className="text-xs text-gray-500">{employee.department}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm font-bold text-gray-900">
                                                                    {employee.completed_trainings}
                                                                </div>
                                                                <div className="text-xs text-gray-500">trainings</div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2">
                                                            <div className="flex items-center">
                                                                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                                                    <div
                                                                        className="bg-green-500 h-1.5 rounded-full"
                                                                        style={{ width: `${Math.min(employee.completion_rate, 100)}%` }}
                                                                    ></div>
                                                                </div>
                                                                <span className="ml-2 text-xs font-medium text-gray-700">
                                                                    {employee.completion_rate}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-500">No performance data available</p>
                                        </div>
                                    )}
                                    <div className="mt-4 pt-4 border-t">
                                        <Link
                                            href={route('admin.employees.index')}
                                            className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            View all employees
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                                </div>
                                <div className="p-4">
                                    {recentActivities.length > 0 ? (
                                        <div className="space-y-4">
                                            {recentActivities.slice(0, 6).map((activity, index) => (
                                                <div key={index} className="flex items-start">
                                                    <div className={`p-2 rounded-full ${activity.type === 'training' ? 'bg-purple-100' : activity.type === 'employee' ? 'bg-blue-100' : 'bg-green-100'}`}>
                                                        {activity.type === 'training' ? (
                                                            <GraduationCap className="w-4 h-4 text-purple-600" />
                                                        ) : activity.type === 'employee' ? (
                                                            <UserCircle className="w-4 h-4 text-blue-600" />
                                                        ) : (
                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                        )}
                                                    </div>
                                                    <div className="ml-3 flex-1">
                                                        <p className="text-sm text-gray-900">{activity.description}</p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(activity.created_at).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-500">No recent activity</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Department Statistics */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Department Training Statistics</h3>
                        </div>
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Employees
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trainings
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Completion Rate
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Avg. Hours
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {trainingStats.departmentStats && trainingStats.departmentStats.length > 0 ? (
                                        trainingStats.departmentStats.map((dept, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            {/*<Building className="w-5 h-5 text-blue-600" />*/}
                                                            Building
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {dept.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{dept.employee_count}</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{dept.training_count}</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-green-500 h-2 rounded-full"
                                                                style={{ width: `${Math.min(dept.completion_rate, 100)}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="ml-2 text-sm text-gray-700">
                                                                {dept.completion_rate}%
                                                            </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{dept.avg_hours} hrs</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            dept.status === 'Excellent'
                                                                ? 'bg-green-100 text-green-800'
                                                                : dept.status === 'Good'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {dept.status}
                                                        </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-8 text-center">
                                                <div className="text-gray-500">No department statistics available</div>
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white">System Status</h3>
                                <p className="text-blue-100 mt-1">All systems operational</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">{stats.totalEmployees || 0}</div>
                                    <div className="text-blue-200 text-sm">Active Users</div>
                                </div>
                                <div className="h-12 w-px bg-blue-400"></div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">{stats.ongoingTrainings || 0}</div>
                                    <div className="text-blue-200 text-sm">Live Sessions</div>
                                </div>
                                <div className="h-12 w-px bg-blue-400"></div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">{stats.avgCompletionRate || 0}%</div>
                                    <div className="text-blue-200 text-sm">Success Rate</div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <div className="flex items-center text-sm text-blue-200">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Last updated: Just now • All services running normally
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
