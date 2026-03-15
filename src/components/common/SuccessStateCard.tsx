'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import Card from './Card';

interface SuccessStateCardProps {
    title: string;
    description: string;
    tone?: 'success' | 'muted' | 'warning';
    children?: React.ReactNode;
}

export default function SuccessStateCard({
    title,
    description,
    tone = 'success',
    children,
}: SuccessStateCardProps) {
    const isSuccess = tone === 'success';
    const isWarning = tone === 'warning';

    const cardClass = isSuccess
        ? 'border border-black bg-black text-white'
        : isWarning
            ? 'border border-amber-300 bg-amber-50 text-amber-900'
            : 'border border-black bg-slate-50 text-slate-900';
    const iconClass = isSuccess ? 'text-white' : isWarning ? 'text-amber-600' : 'text-slate-900';
    const titleClass = isSuccess ? 'text-white' : isWarning ? 'text-amber-900' : 'text-slate-900';
    const descClass = isSuccess ? 'text-white/70' : isWarning ? 'text-amber-700' : 'text-slate-600';

    return (
        <Card
            padding="lg"
            className={cardClass}
        >
            <div className="flex items-start gap-3">
                <CheckCircle2 className={`mt-0.5 h-5 w-5 ${iconClass}`} />
                <div className="min-w-0 flex-1">
                    <p className={`font-semibold ${titleClass}`}>{title}</p>
                    <p className={`mt-1 text-sm leading-6 ${descClass}`}>{description}</p>
                </div>
            </div>

            {children && <div className="mt-4">{children}</div>}
        </Card>
    );
}
