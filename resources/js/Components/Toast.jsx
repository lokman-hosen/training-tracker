import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';

const Toast = () => {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success, {
                duration: 4000,
                position: 'top-right',
            });
        }

        if (flash.error) {
            toast.error(flash.error, {
                duration: 6000,
                position: 'top-right',
            });
        }

        if (flash.warning) {
            toast(flash.warning, {
                duration: 5000,
                position: 'top-right',
                icon: '⚠️',
            });
        }

        if (flash.info) {
            toast(flash.info, {
                duration: 4000,
                position: 'top-right',
                icon: 'ℹ️',
            });
        }
    }, [flash]);

    return (
        <Toaster
            toastOptions={{
                className: 'text-sm font-medium py-10',
                success: {
                    className: 'border border-green-200 bg-green-50 text-green-800',
                    iconTheme: {
                        primary: '#10B981',
                        secondary: '#fff',
                    },
                    style: {
                        background: 'green',
                        color: 'white',
                    },
                },
                error: {
                    className: 'border border-red-200 bg-red-50 text-red-800',
                    iconTheme: {
                        primary: '#EF4444',
                        secondary: '#fff',
                    },
                    style: {
                        background: 'red',
                        color: 'white',
                    },
                },
            }}
        />
    );
};

export default Toast;
