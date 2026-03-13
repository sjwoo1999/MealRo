'use client';

import React from 'react';

type PageShellWidth = 'narrow' | 'default' | 'wide';

interface PageShellProps {
    children: React.ReactNode;
    title?: React.ReactNode;
    description?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
    contentClassName?: string;
    width?: PageShellWidth;
}

const widthClasses: Record<PageShellWidth, string> = {
    narrow: 'max-w-xl',
    default: 'max-w-4xl',
    wide: 'max-w-7xl',
};

export default function PageShell({
    children,
    title,
    description,
    actions,
    className = '',
    contentClassName = '',
    width = 'narrow',
}: PageShellProps) {
    return (
        <section className={`mx-auto w-full px-4 py-6 pb-24 lg:px-6 lg:py-8 lg:pb-10 ${widthClasses[width]} ${className}`}>
            {(title || description || actions) && (
                <header className="mb-6 flex flex-col gap-3 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                        {title && (
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 lg:text-3xl">
                                {title}
                            </h1>
                        )}
                        {description && (
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 lg:text-base">
                                {description}
                            </p>
                        )}
                    </div>
                    {actions && <div className="shrink-0">{actions}</div>}
                </header>
            )}

            <div className={`space-y-6 lg:space-y-8 ${contentClassName}`}>
                {children}
            </div>
        </section>
    );
}
