"use client";

import { useEffect } from 'react';

interface SimpleSnackbarProps {
    isVisible: boolean;
    message: string;
    onClose: () => void;
    duration?: number;
}

export default function SimpleSnackbar({ isVisible, message, onClose, duration = 3000 }: SimpleSnackbarProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-slate-800 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in-up">
                <span>{message}</span>
            </div>
        </div>
    );
}
