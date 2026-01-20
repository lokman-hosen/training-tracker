import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Form from "@/Pages/Trainings/Form.jsx";


export default function Create({ employees }) {
    return (
        <AdminLayout>
            <Head title="Create New Training" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Create New Training</h2>
                                    <p className="text-gray-600 mt-1">
                                        Fill in the details to schedule a new training program
                                    </p>
                                </div>
                            </div>
                            <Form />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
