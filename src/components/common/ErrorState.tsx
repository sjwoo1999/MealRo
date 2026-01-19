'use client';

import { AlertCircle, RotateCw } from 'lucide-react';
import Button from './Button';

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    fullScreen?: boolean;
}

export default function ErrorState({
    title = "오류가 발생했습니다",
    message = "잠시 후 다시 시도해주세요.",
    onRetry,
    fullScreen = false
}: ErrorStateProps) {
    const Content = (
        <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{message}</p>
            </div>
            {onRetry && (
                <Button onClick={onRetry} variant="outline" className="mt-2">
                    <RotateCw className="w-4 h-4 mr-2" />
                    다시 시도
                </Button>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white dark:bg-slate-900 flex items-center justify-center z-50">
                {Content}
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            {Content}
        </div>
    );
}
