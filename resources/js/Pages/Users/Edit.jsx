// resources/js/Pages/Admin/Users/Edit.jsx
import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ user }) {
    return (
        <AdminLayout>
            <Head title={`Edit User - ${user.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Edit User</h2>
                            </div>

                            <Form user={user} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
