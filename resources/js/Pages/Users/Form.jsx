// resources/js/Components/Forms/UserForm.jsx
import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Input from '@/Components/Forms/Input.jsx';
import Select from '@/Components/Forms/Select';
import FileUpload from '@/Components/Forms/FileUpload';

export default function UserForm({ user = null }) {
    const { data, setData, post, put, errors, processing } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        password: '',
        password_confirmation: '',
        role: user?.role || 'admin',
        image: null,
        _method: user ? 'PUT' : 'POST', // Add method field
    });

    const [previewImage, setPreviewImage] = useState(user?.image || null);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Always use POST, but include _method field
        post(route(user ? 'admin.users.update' : 'admin.users.store', user?.id), {
            forceFormData: true, // Force FormData for file uploads
            preserveScroll: true,
            onSuccess: () => {
                // Reset form after successful submission
                if (!user) {
                    setData({
                        name: '',
                        email: '',
                        phone: '',
                        password: '',
                        password_confirmation: '',
                        role: 'admin',
                        image: null,
                        _method: 'POST',
                    });
                    setPreviewImage(null);
                }
            }
        });
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

    const roleOptions = [
        // { value: 'employee', label: 'Employee' },
        { value: 'admin', label: 'Admin' }
        // { value: 'super-admin', label: 'Super Admin' }
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Upload */}
            <FileUpload
                label="Profile Picture"
                name="image"
                preview={previewImage}
                onChange={handleImageChange}
                onRemove={removeImage}
                error={errors.image}
                accept="image/*"
                description="Upload a profile picture. Max size 2MB."
                className="max-w-lg"
            />

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                {/* Email */}
                <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                    required
                    placeholder="Enter email address"
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

                {/* Role */}
                <Select
                    label="Role"
                    name="role"
                    value={data.role}
                    onChange={(e) => setData('role', e.target.value)}
                    error={errors.role}
                    required
                    options={roleOptions}
                    placeholder="Select role"
                />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {!user ? (
                    <>
                        {/* Create User - Both password fields required */}
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={errors.password}
                            required
                            placeholder="Enter password"
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            error={errors.password_confirmation}
                            required
                            placeholder="Confirm password"
                        />
                    </>
                ) : (
                    <>
                        {/* Edit User - Optional password fields */}
                        <Input
                            label="New Password (Optional)"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={errors.password}
                            placeholder="Leave blank to keep current"
                        />

                        <Input
                            label="Confirm New Password"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            error={errors.password_confirmation}
                            placeholder="Confirm new password"
                        />
                    </>
                )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
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
