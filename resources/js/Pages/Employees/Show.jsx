import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    User,
    Calendar,
    Mail,
    Phone,
    Briefcase,
    Building,
    GraduationCap,
    Clock,
    CheckCircle,
    XCircle,
    Plus,
    Trash2,
    ChevronDown
} from 'lucide-react';
import Select from '@/Components/Forms/Select';

export default function Show({ pageTitle, employee, availableTrainings }) {
    const { data, setData, post, processing, errors } = useForm({
        training_id: '',
        attended: false,
        completed: false,
        grade: ''
    });

    const [expandedTraining, setExpandedTraining] = useState(null);

    const assignTraining = (e) => {
        e.preventDefault();
        post(route('admin.employees.assign-training', employee.id), {
            preserveScroll: true,
            onSuccess: () => setData({
                training_id: '',
                attended: false,
                completed: false,
                grade: ''
            })
        });
    };

    const removeTraining = (trainingId) => {
        if (confirm('Are you sure you want to remove this training from the employee?')) {
            router.delete(route('admin.employees.remove-training', [employee.id, trainingId]), {
                preserveScroll: true
            });
        }
    };

    const trainingOptions = availableTrainings.map(training => ({
        value: training.id,
        label: `${training.name} (${training.topic})`
    }));

    const gradeOptions = [
        { value: 'A+', label: 'A+' },
        { value: 'A', label: 'A' },
        { value: 'A-', label: 'A-' },
        { value: 'B+', label: 'B+' },
        { value: 'B', label: 'B' },
        { value: 'B-', label: 'B-' },
        { value: 'C+', label: 'C+' },
        { value: 'C', label: 'C' },
        { value: 'C-', label: 'C-' },
        { value: 'D', label: 'D' },
        { value: 'F', label: 'F' }
    ];

    return (
        <AdminLayout>
            <Head title={`Employee - ${employee.name}`} />

            <div className="py-6">
                <div className="mx-auto sm:px-6 lg:px-8">
                    {/* Employee Profile Card */}
                    <div className="bg-white shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                                {/* Profile Image */}
                                <div className="flex-shrink-0">
                                    {employee.image ? (
                                        <img
                                            className="h-32 w-32 rounded-full object-cover"
                                            src={employee.image}
                                            alt={employee.name}
                                        />
                                    ) : (
                                        <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
                                            <User className="w-16 h-16 text-gray-500" />
                                        </div>
                                    )}
                                </div>

                                {/* Employee Details */}
                                <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800">{employee.name}</h2>
                                            <p className="text-gray-600">{employee.designation}</p>
                                            <p className="text-sm text-gray-500">ID: {employee.id_number}</p>
                                        </div>
                                        <div className="mt-4 md:mt-0">
                                            <Link
                                                href={route('admin.employees.edit', employee.id)}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                                            >
                                                Edit Profile
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="flex items-center space-x-3">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="text-gray-800">{employee.email || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Phone className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Phone</p>
                                                <p className="text-gray-800">{employee.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Building className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Department</p>
                                                <p className="text-gray-800">{employee.department || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Joining Date</p>
                                                <p className="text-gray-800">{employee.joining_date || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <GraduationCap className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Total Trainings</p>
                                                <p className="text-gray-800">{employee.trainings_count || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assign Training Form */}
                    {availableTrainings.length > 0 && (
                        <div className="bg-white shadow-sm sm:rounded-lg mb-6">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Assign New Training</h3>
                                <form onSubmit={assignTraining} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <Select
                                            label="Select Training"
                                            name="training_id"
                                            value={data.training_id}
                                            onChange={(e) => setData('training_id', e.target.value)}
                                            error={errors.training_id}
                                            options={trainingOptions}
                                            placeholder="Choose a training"
                                            className="md:col-span-2"
                                        />
                                        <Select
                                            label="Grade"
                                            name="grade"
                                            value={data.grade}
                                            onChange={(e) => setData('grade', e.target.value)}
                                            options={gradeOptions}
                                            placeholder="Select grade"
                                        />
                                        <div className="flex items-end">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full inline-flex justify-center items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Assign
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={data.attended}
                                                onChange={(e) => setData('attended', e.target.checked)}
                                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Attended</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={data.completed}
                                                onChange={(e) => setData('completed', e.target.checked)}
                                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Completed</span>
                                        </label>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Assigned Trainings */}
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Assigned Trainings</h3>

                            {employee.trainings && employee.trainings.length > 0 ? (
                                <div className="space-y-4">
                                    {employee.trainings.map((training) => (
                                        <div
                                            key={training.id}
                                            className="border rounded-lg overflow-hidden hover:bg-gray-50"
                                        >
                                            <div
                                                className="p-4 flex items-center justify-between cursor-pointer"
                                                onClick={() => setExpandedTraining(expandedTraining === training.id ? null : training.id)}
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">{training.name}</h4>
                                                            <p className="text-sm text-gray-600">{training.topic}</p>
                                                        </div>
                                                        <div className="flex items-center space-x-4">
                                                            <span className="text-sm text-gray-500">
                                                                {new Date(training.start_date).toLocaleDateString()}
                                                            </span>
                                                            <ChevronDown
                                                                className={`w-5 h-5 text-gray-400 transform transition-transform ${
                                                                    expandedTraining === training.id ? 'rotate-180' : ''
                                                                }`}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-4 mt-2">
                                                        {training.pivot.attended ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                Attended
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                <XCircle className="w-3 h-3 mr-1" />
                                                                Not Attended
                                                            </span>
                                                        )}
                                                        {training.pivot.completed && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                Completed
                                                            </span>
                                                        )}
                                                        {training.pivot.grade && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                Grade: {training.pivot.grade}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expanded Content */}
                                            {expandedTraining === training.id && (
                                                <div className="border-t px-4 py-4 bg-gray-50">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700">Trainer</p>
                                                            <p className="text-gray-900">{training.trainer_name}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700">Duration</p>
                                                            <p className="text-gray-900">{training.duration}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700">Location</p>
                                                            <p className="text-gray-900">{training.location}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700">Hours</p>
                                                            <p className="text-gray-900">{training.training_hours} hours</p>
                                                        </div>
                                                    </div>
                                                    {training.pivot.feedback && (
                                                        <div className="mt-4">
                                                            <p className="text-sm font-medium text-gray-700">Feedback</p>
                                                            <p className="text-gray-900">{training.pivot.feedback}</p>
                                                        </div>
                                                    )}
                                                    <div className="mt-4 flex justify-end">
                                                        <button
                                                            onClick={() => removeTraining(training.id)}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                        >
                                                            <Trash2 className="w-3 h-3 mr-1" />
                                                            Remove Training
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No trainings assigned yet.</p>
                                    {availableTrainings.length === 0 && (
                                        <p className="text-sm text-gray-400 mt-2">
                                            No available trainings to assign. Create trainings first.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
