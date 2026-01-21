// resources/js/Components/Forms/UserForm.jsx
import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Upload, X } from 'lucide-react';

export default function UserForm({ user = null }) {
    const { data, setData, post, put, errors, processing } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        password: '',
        password_confirmation: '',
        role: user?.role || 'employee',
        department: user?.department || '',
        joining_date: user?.joining_date || '',
        image: null,
    });

    const [previewImage, setPreviewImage] = useState(user?.image || null);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (user) {
            put(route('admin.users.update', user.id));
        } else {
            post(route('admin.users.store'));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData('image', null);
        setPreviewImage(null);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="flex items-center space-x-6">
                <div className="shrink-0">
                    {previewImage ? (
                        <div className="relative">
                            <img
                                className="h-32 w-32 object-cover rounded-full"
                                src={previewImage}
                                alt="Preview"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <label className="cursor-pointer">
                            <div className="h-32 w-32 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-gray-400">
                                <Upload className="w-8 h-8 text-gray-400" />
                                <span className="mt-2 text-sm text-gray-500">Upload Photo</span>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </label>
                    )}
                </div>
                <div className="text-sm text-gray-500">
                    Upload a profile picture. Max size 2MB.
                </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                    <input
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                </div>

                {/* Role */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Role *</label>
                    <select
                        value={data.role}
                        onChange={(e) => setData('role', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    >
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                        <option value="super-admin">Super Admin</option>
                    </select>
                    {errors.role && (
                        <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                    )}
                </div>

                {/* Password - only for create or when changing */}
                {!user && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password *</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required={!user}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Confirm Password *
                            </label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required={!user}
                            />
                        </div>
                    </>
                )}

                {/* Department */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <input
                        type="text"
                        value={data.department}
                        onChange={(e) => setData('department', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                {/* Joining Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Joining Date</label>
                    <input
                        type="date"
                        value={data.joining_date}
                        onChange={(e) => setData('joining_date', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
                <a
                    href={route('admin.users.index')}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancel
                </a>
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {processing ? 'Saving...' : user ? 'Update User' : 'Create User'}
                </button>
            </div>
        </form>
    );
}
