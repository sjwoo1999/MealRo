'use client';

import React from 'react';
import { Card, ProgressBar } from '@/components/common';

interface CalorieProgressProps {
    current: number;
    target: number;
    goalType?: 'lose' | 'maintain' | 'gain';
}

const CalorieProgress = ({ current, target, goalType }: CalorieProgressProps) => {
    const remaining = Math.max(0, target - current);

    return (
        <Card className="animate-fade-in-up">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                오늘의 섭취 현황
            </h2>
            <p className="text-sm text-slate-500 mb-6">
                목표까지 <span className="font-bold text-primary-600">{remaining.toLocaleString()}kcal</span> 남았어요!
            </p>

            <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    {current.toLocaleString()}
                </span>
                <span className="text-lg text-slate-400 mb-1">
                    / {target.toLocaleString()} kcal
                </span>
            </div>

            <ProgressBar
                current={current}
                max={target}
                className="h-4 rounded-full"
                showValue={false}
            />

            <div className="mt-2 text-xs text-center text-slate-400">
                {goalType === 'lose' ? '체중 감량 중 🔥' : goalType === 'gain' ? '근육 증가 중 💪' : '건강 유지 중 🥗'}
            </div>
        </Card>
    );
};

export default CalorieProgress;
