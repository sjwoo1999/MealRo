'use client';

import React from 'react';
import { Goal, GOAL_OPTIONS } from '@/types/user';
import { Card } from '@/components/common';

interface StepGoalProps {
    value?: Goal;
    onChange: (value: Goal) => void;
    error?: string;
}

const StepGoal = ({ value, onChange, error }: StepGoalProps) => {
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
                            onClick={() => onChange(option.value)}
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
        </div>
    );
};

export default StepGoal;
