import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Form from "@/Pages/Trainings/Form.jsx";

export default function Edit({ training, employees }) {
    return (
        <AdminLayout>
            <Head title={`Edit Training - ${training.name}`} />
            <div className="py-6">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Edit Training</h2>
                                    <p className="text-gray-600 mt-1">
                                        Update training details and assignments
                                    </p>
                                </div>
                            </div>
                            <Form training={training} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
