// resources/js/Layouts/GuestLayout.jsx
import React from 'react';
import { Head } from '@inertiajs/react';
import { Shield } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
            <Head title="Training Tracker" />

            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Shield className="h-8 w-8 text-blue-600 mr-3" />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Training Tracker</h1>
                                <p className="text-sm text-gray-600">Government Office System</p>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">
                            Employee Training Management
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-auto">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-sm text-gray-500">
                        <p>© {new Date().getFullYear()} Government Office Training Tracker. All rights reserved.</p>
                        <p className="mt-1">Secure Employee Training Management System</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
