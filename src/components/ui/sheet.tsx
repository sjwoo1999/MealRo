'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

type SheetContextValue = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const SheetContext = createContext<SheetContextValue | null>(null);

function useSheetContext() {
    const context = useContext(SheetContext);
    if (!context) {
        throw new Error('Sheet components must be used within <Sheet>');
    }
    return context;
}

export function Sheet({
    open,
    onOpenChange,
    children,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}) {
    const value = useMemo(() => ({ open, onOpenChange }), [open, onOpenChange]);
    return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>;
}

export function SheetContent({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const { open, onOpenChange } = useSheetContext();
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
        <div className="fixed inset-0 z-[70]">
            <div
                className="absolute inset-0 bg-black/60"
                onClick={() => onOpenChange(false)}
                aria-hidden="true"
            />
            <div
                role="dialog"
                aria-modal="true"
                className={cn(
                    'absolute bottom-0 left-0 right-0 z-[71] mx-auto max-h-[80vh] w-full max-w-md overflow-y-auto rounded-t-[28px] border border-black bg-white shadow-xl',
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

export function SheetHeader({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={cn('space-y-1', className)}>{children}</div>;
}

export function SheetTitle({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <h2 className={cn('text-xl font-bold text-slate-900', className)}>{children}</h2>;
}

export function SheetDescription({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <p className={cn('text-sm text-slate-500', className)}>{children}</p>;
}

export function SheetFooter({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={cn('flex gap-3 pt-2', className)}>{children}</div>;
}
