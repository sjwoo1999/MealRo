'use client';

import React from 'react';
import { Size } from '@/types/common';

interface ProgressBarProps {
    current: number;
    max: number;
    label?: string;
    showValue?: boolean;
    color?: 'primary' | 'success' | 'warning' | 'danger';
    size?: Size;
    className?: string;
}

const ProgressBar = ({
    current,
    max,
    label,
    showValue = false,
    color = 'primary',
    size = 'md',
    className = '',
}: ProgressBarProps) => {
    const percentage = Math.min(Math.max((current / max) * 100, 0), 100);

    const colors = {
        primary: 'bg-green-500',
        success: 'bg-emerald-500',
        warning: 'bg-amber-500',
        danger: 'bg-red-500',
    };

    const heights = {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4',
    };

    return (
        <div className={`w-full ${className}`}>
            {(label || showValue) && (
                <div className="flex justify-between items-center mb-1">
                    {label && (
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                            {label}
                        </span>
                    )}
                    {showValue && (
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {Math.round(percentage)}%
                        </span>
                    )}
                </div>
            )}
            <div className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ${heights[size]}`}>
                <div
                    className={`${colors[color]} ${heights[size]} rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={current}
                    aria-valuemin={0}
                    aria-valuemax={max}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
