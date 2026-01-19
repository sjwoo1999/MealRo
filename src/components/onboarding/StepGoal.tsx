'use client';

import React from 'react';
import { Goal, GOAL_OPTIONS } from '@/types/user';
import { Card } from '@/components/common';

interface StepGoalProps {
    value?: Goal;
    customProtein?: number;
    onChange: (value: Goal, customProtein?: number) => void;
    error?: string;
}

const StepGoal = ({ value, customProtein, onChange, error }: StepGoalProps) => {
    return (
        <div className="space-y-4 animate-fade-in-up">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                어떤 목표를 가지고 계신가요?
            </label>

            <div className="grid grid-cols-1 gap-4">
                {GOAL_OPTIONS.map((option) => {
                    const isSelected = value === option.value;
                    let colorClass = 'border-slate-200 hover:border-slate-300';
                    let bgClass = 'bg-white';

                    if (isSelected) {
                        if (option.value === 'lose') {
                            colorClass = 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
                        } else if (option.value === 'maintain') {
                            colorClass = 'border-green-500 bg-green-50 dark:bg-green-900/20';
                        } else {
                            colorClass = 'border-amber-500 bg-amber-50 dark:bg-amber-900/20';
                        }
                    }

                    return (
                        <Card
                            key={option.value}
                            className={`
                                relative flex items-center p-5 cursor-pointer border-2 transition-all
                                ${colorClass}
                                ${bgClass}
                            `}
                            onClick={() => onChange(option.value, customProtein)}
                        >
                            <div className="mr-4 text-3xl">{option.emoji}</div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 dark:text-white">
                                    {option.label}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {option.description}
                                </p>
                            </div>
                            <div className={`
                                px-3 py-1 rounded-full text-xs font-bold
                                ${isSelected ? 'bg-white shadow-sm' : 'bg-slate-100 dark:bg-slate-700'}
                            `}>
                                {option.calorieAdjustment}
                            </div>

                            {isSelected && (
                                <div className="absolute top-3 right-3 text-current">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>

            {error && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
            )}

            {/* Advanced Option: Custom Protein Target */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    선택 사항: 단백질 목표 설정
                </p>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                    <div className="flex flex-col space-y-2">
                        <label className="text-xs text-slate-500 dark:text-slate-400">
                            하루 단백질 목표량 (g) - 비워두시면 자동 계산됩니다.
                        </label>
                        <input
                            type="number"
                            placeholder="예: 120"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                            value={customProtein || ''}
                            onChange={(e) => {
                                const val = e.target.value ? parseInt(e.target.value) : undefined;
                                onChange(value!, val); // Assuming value is set if we are editing this
                            }}
                        />
                        <p className="text-xs text-slate-400">
                            * KDRI 2025 권장량: 체중 kg당 0.91g (노인 1.2g) / 운동 시 1.6~2.0g
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepGoal;
