import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import FileUpload from '@/Components/Forms/FileUpload';
import DatePicker from "@/Components/Forms/DatePicker.jsx";
import Input from "@/Components/Forms/Input.jsx";

export default function Form({ employee = null }) {
    const { data, setData, post, put, errors, processing } = useForm({
        name: employee?.name || '',
        id_number: employee?.id_number || '',
        phone: employee?.phone || '',
        email: employee?.email || '',
        designation: employee?.designation || '',
        department: employee?.department || '',
        joining_date: employee?.joining_date || '',
        image: null,
    });

    const [previewImage, setPreviewImage] = useState(employee?.image || null);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (employee) {
            put(route('admin.employees.update', employee.id));
        } else {
            post(route('admin.employees.store'));
        }
    };

    const handleImageChange = (file) => {
        setData('image', file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setData('image', null);
        setPreviewImage(null);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Officer/Staff Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Employee ID */}
                    <Input
                        label="Employee ID"
                        name="id_number"
                        value={data.id_number}
                        onChange={(e) => setData('id_number', e.target.value)}
                        error={errors.id_number}
                        placeholder="Enter employee ID"
                    />

                    {/* Name */}
                    <Input
                        label="Full Name"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                        required
                        placeholder="Enter full name"
                    />

                    {/* Phone */}
                    <Input
                        label="Phone Number"
                        type="tel"
                        name="phone"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        error={errors.phone}
                        required
                        placeholder="Enter phone number"
                    />

                    {/* Email */}
                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                        placeholder="Enter email address"
                    />

                    {/* Designation */}
                    <Input
                        label="Designation"
                        name="designation"
                        value={data.designation}
                        onChange={(e) => setData('designation', e.target.value)}
                        error={errors.designation}
                        required
                        placeholder="Enter designation"
                    />

                    {/* Department */}
                    <Input
                        label="Department"
                        name="department"
                        value={data.department}
                        onChange={(e) => setData('department', e.target.value)}
                        error={errors.department}
                        placeholder="Enter department"
                    />

                    {/* Joining Date */}
                    <DatePicker
                        label="Joining Date"
                        name="joining_date"
                        value={data.joining_date}
                        onChange={(e) => setData('joining_date', e.target.value)}
                        error={errors.joining_date}
                    />
                </div>
            </div>

            {/* Profile Image Section */}
            {/*<div className="bg-white shadow rounded-lg p-6">*/}
            {/*    <h3 className="text-lg font-medium text-gray-900 mb-6">Employee Photo</h3>*/}
            {/*    <FileUpload*/}
            {/*        preview={previewImage}*/}
            {/*        onChange={handleImageChange}*/}
            {/*        onRemove={removeImage}*/}
            {/*        error={errors.image}*/}
            {/*    />*/}
            {/*</div>*/}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
                <a
                    href={route('admin.employees.index')}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancel
                </a>
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {processing ? 'Saving...' : employee ? 'Update Employee' : 'Create Officer/Staff'}
                </button>
            </div>
        </form>
    );
}
