'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import Card from './Card';

interface SuccessStateCardProps {
    title: string;
    description: string;
    tone?: 'success' | 'muted';
    children?: React.ReactNode;
}

export default function SuccessStateCard({
    title,
    description,
    tone = 'success',
    children,
}: SuccessStateCardProps) {
    const isSuccess = tone === 'success';

    return (
        <Card
            padding="lg"
            className={isSuccess ? 'border border-black bg-black text-white' : 'border border-black bg-slate-50 text-slate-900'}
        >
            <div className="flex items-start gap-3">
                <CheckCircle2 className={`mt-0.5 h-5 w-5 ${isSuccess ? 'text-white' : 'text-slate-900'}`} />
                <div className="min-w-0 flex-1">
                    <p className={`font-semibold ${isSuccess ? 'text-white' : 'text-slate-900'}`}>{title}</p>
                    <p className={`mt-1 text-sm leading-6 ${isSuccess ? 'text-white/70' : 'text-slate-600'}`}>{description}</p>
                </div>
            </div>

            {children && <div className="mt-4">{children}</div>}
        </Card>
    );
}
