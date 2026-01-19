// resources/js/Layouts/AuthenticatedLayout.jsx
import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import {
    LayoutDashboard,
    Users,
    UserCircle,
    GraduationCap,
    ChevronDown,
    Menu,
    X,
    LogOut,
    Settings
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
            current: route().current('admin.users.*')
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={header || 'Dashboard'} />

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
                        <Link href={route('admin.dashboard')} className="flex items-center">
                            <ApplicationLogo className="w-8 h-8" />
                            <span className="ml-2 text-xl font-bold text-gray-800">Training Tracker</span>
                        </Link>
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
                        ))}
                    </nav>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64">
                <div className="flex flex-col flex-1 bg-white border-r">
                    {/* Sidebar header */}
                    <div className="flex items-center h-16 px-6 border-b">
                        <Link href={route('admin.dashboard')} className="flex items-center">
                            <ApplicationLogo className="w-8 h-8" />
                            <span className="ml-2 text-xl font-bold text-gray-800">Training Tracker</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-6 py-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => (
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
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top navbar */}
                <nav className="bg-white border-b border-gray-200">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            {/* Left side - Mobile menu button */}
                            <div className="flex items-center lg:hidden">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500"
                                >
                                    <Menu className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Right side - User menu */}
                            <div className="flex items-center">
                                <div className="ml-3 relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="text-right mr-3 hidden sm:block">
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
                                                                    className="h-8 w-8 rounded-full"
                                                                    src={auth.user.image}
                                                                    alt={auth.user.name}
                                                                />
                                                            ) : (
                                                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                                    <UserCircle className="w-5 h-5 text-gray-500" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <ChevronDown className="ml-2 -mr-0.5 h-4 w-4 text-gray-400" />
                                                    </div>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>
                                                <Settings className="w-4 h-4 mr-2" />
                                                Profile Settings
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Page Heading */}
                {header && (
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {header}
                            </h2>
                        </div>
                    </header>
                )}

                {/* Page Content */}
                <main>
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
