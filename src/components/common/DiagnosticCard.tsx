'use client';

import React from 'react';
import Card from './Card';

interface DiagnosticCardProps {
    label?: string;
    title: string;
    description: string;
    tone?: 'info' | 'warning' | 'danger';
    children?: React.ReactNode;
}

export default function DiagnosticCard({
    label = 'Diagnostic',
    title,
    description,
    tone = 'info',
    children,
}: DiagnosticCardProps) {
    const toneClass =
        tone === 'danger'
            ? 'border-black bg-[#fff4f4] text-slate-900'
            : tone === 'warning'
                ? 'border-black bg-[#fff9ef] text-slate-900'
                : 'border-black bg-slate-50 text-slate-900';

    return (
        <Card padding="lg" className={`border shadow-none ${toneClass}`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
            <p className="mt-2 font-semibold text-slate-900">{title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
            {children && <div className="mt-4">{children}</div>}
        </Card>
    );
}
