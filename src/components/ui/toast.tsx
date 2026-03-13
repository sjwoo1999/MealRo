'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function Toast({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            role="status"
            aria-live="polite"
            className={cn(
                'rounded-[16px] border border-black bg-black px-4 py-3 text-sm text-white shadow-none',
                className
            )}
        >
            {children}
        </div>
    );
}

export function ToastViewport({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'fixed bottom-6 left-1/2 z-[80] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2',
                className
            )}
        >
            {children}
        </div>
    );
}
