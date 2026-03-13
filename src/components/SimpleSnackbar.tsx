"use client";

import { useEffect } from 'react';
import { Toast, ToastViewport } from '@/components/ui/toast';

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
        <ToastViewport>
            <Toast className="animate-fade-in-up">
                <span>{message}</span>
            </Toast>
        </ToastViewport>
    );
}
