import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Form from "@/Pages/Employees/Form.jsx";
export default function Edit({ pageTitle, employee }) {
    return (
        <AdminLayout>
            <Head title={pageTitle} />

            <div className="py-6">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">{`Edit Employee - ${employee.name}`}</h2>
                            </div>
                            <Form employee={employee} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
