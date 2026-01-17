'use client';

import React from 'react';
import { Button } from '@/components/common';

interface MapErrorProps {
    message?: string;
    onRetry?: () => void;
}

const MapError = ({ message, onRetry }: MapErrorProps) => {
    return (
        <div className="w-full h-[300px] bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center p-6">
            <span className="text-3xl mb-3">😢</span>
            <p className="text-slate-900 dark:text-slate-200 font-bold mb-1">
                지도를 불러올 수 없습니다.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                {message || '일시적인 오류가 발생했습니다.'}
            </p>
            {onRetry && (
                <Button size="sm" variant="outline" onClick={onRetry}>
                    다시 시도
                </Button>
            )}
        </div>
    );
};

export default MapError;
