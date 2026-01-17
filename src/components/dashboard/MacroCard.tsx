'use client';

import React from 'react';
import { Card } from '@/components/common';

interface MacroCardProps {
    label: string;
    current: number;
    target: number;
    color: string; // Tailwind color class e.g. "bg-red-500"
}

const MacroCard = ({ label, current, target, color }: MacroCardProps) => {
    const percent = Math.min((current / target) * 100, 100);

    return (
        <Card className="p-4 flex flex-col justify-between h-full border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-slate-500 font-medium">{label}</span>
                <span className="text-xs text-slate-400">{Math.round(percent)}%</span>
            </div>

            <div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    {current}g
                </div>
                <div className="text-xs text-slate-400 mb-2">
                    / {target}g
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${color}`} style={{ width: `${percent}%` }}></div>
                </div>
            </div>
        </Card>
    );
};

export default MacroCard;
