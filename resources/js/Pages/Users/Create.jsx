import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Form from "@/Pages/Users/Form.jsx";

export default function Create() {
    return (
        <AdminLayout>
            <Head title="Create New User" />

            <div className="py-6">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Create New User</h2>
                            </div>
                            <Form />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
