// resources/js/Layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    UserCircle,
    GraduationCap,
    ChevronDown,
    Menu,
    X,
    LogOut,
    Settings,
    FileText
} from 'lucide-react';
import Toast from "@/Components/Toast.jsx";

export default function AdminLayout({ children, title }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const navigation = [
        {
            name: 'Dashboard',
            href: route('admin.dashboard'),
            icon: LayoutDashboard,
            current: route().current('admin.dashboard')
        },
        {
            name: 'Employees',
            href: route('admin.employees.index'),
            icon: UserCircle,
            current: route().current('admin.employees.*')
        },
        {
            name: 'Trainings',
            href: route('admin.trainings.index'),
            icon: GraduationCap,
            current: route().current('admin.trainings.*')
        },
        {
            name: 'Users',
            href: route('admin.users.index'),
            icon: Users,
            current: route().current('admin.users.*'),
            visible: auth.user.role === 'super-admin' || auth.user.role === 'admin'
        },
        {
            name: 'Reports',
            href: route('admin.reports.index'),
            icon: FileText,
            current: route().current('admin.reports.*')
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={title} />

            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                </div>
            )}

            {/* Mobile sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="flex flex-col h-full bg-white shadow-lg">
                    {/* Sidebar header */}
                    <div className="flex items-center justify-between h-16 px-4 border-b">
                        <span className="text-xl font-bold text-gray-800">Training Tracker</span>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-1 rounded-md text-gray-400 hover:text-gray-500"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => (
                            (item.visible === undefined || item.visible) && (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 text-sm rounded-md ${
                                        item.current
                                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </Link>
                            )
                        ))}
                    </nav>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64">
                <div className="flex flex-col flex-1 bg-white border-r">
                    {/* Sidebar header */}
                    <div className="flex items-center h-16 px-6 border-b">
                        <span className="text-xl font-bold text-gray-800">Training Tracker</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-6 py-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => (
                            (item.visible === undefined || item.visible) && (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 text-sm rounded-md ${
                                        item.current
                                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </Link>
                            )
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top navbar */}
                <div className="sticky top-0 z-10 bg-white shadow-sm">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        {/* Left side - Mobile menu button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 text-gray-400 rounded-md lg:hidden hover:text-gray-500"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Right side - User menu */}
                        <div className="flex items-center">
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center space-x-3 focus:outline-none"
                                >
                                    <div className="text-right hidden sm:block">
                                        <div className="text-sm font-medium text-gray-700">
                                            {auth.user.name}
                                        </div>
                                        <div className="text-xs text-gray-500 capitalize">
                                            {auth.user.role}
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {auth.user.image ? (
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                src={auth.user.image}
                                                alt={auth.user.name}
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                <UserCircle className="w-6 h-6 text-gray-500" />
                                            </div>
                                        )}
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </button>

                                {/* User dropdown menu */}
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                                        <Link
                                            href={route('profile.edit')}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <Settings className="w-4 h-4 mr-3" />
                                            Profile Settings
                                        </Link>
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <LogOut className="w-4 h-4 mr-3" />
                                            Logout
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1">
                    {children}
                    <Toast />
                </main>
            </div>
        </div>
    );
}
