'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

type DialogContextValue = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext() {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('Dialog components must be used within <Dialog>');
    }
    return context;
}

export function Dialog({
    open,
    onOpenChange,
    children,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}) {
    const value = useMemo(() => ({ open, onOpenChange }), [open, onOpenChange]);
    return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

export function DialogContent({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const { open, onOpenChange } = useDialogContext();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onOpenChange(false);
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, onOpenChange]);

    if (!mounted || !open) {
        return null;
    }

    return createPortal(
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60"
                onClick={() => onOpenChange(false)}
                aria-hidden="true"
            />
            <div
                role="dialog"
                aria-modal="true"
                className={cn(
                    'relative z-[71] w-full max-w-sm rounded-[24px] border border-black bg-white p-6 shadow-none',
                    className
                )}
                onClick={(event) => event.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    );
}

export function DialogHeader({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={cn('space-y-2', className)}>{children}</div>;
}

export function DialogTitle({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <h2 className={cn('text-xl font-bold text-slate-900', className)}>{children}</h2>;
}

export function DialogDescription({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <p className={cn('text-sm leading-6 text-slate-600', className)}>{children}</p>;
}

export function DialogFooter({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={cn('mt-6 space-y-3', className)}>{children}</div>;
}
