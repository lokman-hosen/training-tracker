import React, { useRef } from 'react';
import { Upload, X, User } from 'lucide-react';

export default function FileUpload({
                                       label,
                                       name,
                                       value,
                                       onChange,
                                       error,
                                       required = false,
                                       disabled = false,
                                       className = '',
                                       accept = 'image/*',
                                       preview = null,
                                       onRemove,
                                       ...props
                                   }) {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onChange(file);
        }
    };

    const handleRemove = () => {
        if (onRemove) {
            onRemove();
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="flex items-center space-x-4">
                {/* Preview */}
                <div className="shrink-0">
                    {preview ? (
                        <div className="relative">
                            <img
                                className="h-24 w-24 object-cover rounded-lg border"
                                src={`/storage/${preview}`}
                                alt="Preview"
                            />
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                            <User className="w-8 h-8 text-gray-400" />
                        </div>
                    )}
                </div>

                {/* Upload Button */}
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        name={name}
                        accept={accept}
                        onChange={handleFileChange}
                        disabled={disabled}
                        className="hidden"
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        {preview ? 'Change Photo' : 'Upload Photo'}
                    </button>
                    <p className="mt-2 text-sm text-gray-500">
                        PNG, JPG, GIF up to 2MB
                    </p>
                </div>
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
