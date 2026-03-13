'use client';

import React from 'react';
import { Goal, GOAL_OPTIONS } from '@/types/user';
import { Card, Input } from '@/components/common';

interface StepGoalProps {
    value?: Goal;
    customProtein?: number;
    onChange: (value: Goal, customProtein?: number) => void;
    error?: string;
}

const StepGoal = ({ value, customProtein, onChange, error }: StepGoalProps) => {
    return (
        <div className="space-y-4 animate-fade-in-up">
            <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Step 4</p>
                <label className="mt-2 block text-sm font-medium text-slate-900">
                    목표를 선택하세요
                </label>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {GOAL_OPTIONS.map((option) => {
                    const isSelected = value === option.value;

                    return (
                        <Card
                            key={option.value}
                            className={`
                                relative flex cursor-pointer items-center border p-5 transition-colors
                                ${isSelected ? 'border-black bg-black text-white' : 'border-black bg-white text-slate-900'}
                            `}
                            onClick={() => onChange(option.value, customProtein)}
                        >
                            <div className="flex-1">
                                <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${isSelected ? 'text-white/70' : 'text-slate-500'}`}>
                                    Goal
                                </p>
                                <h3 className="mt-1 font-bold">
                                    {option.label}
                                </h3>
                                <p className={`text-sm ${isSelected ? 'text-white/70' : 'text-slate-500'}`}>
                                    {option.description}
                                </p>
                            </div>
                            <div className={`
                                rounded-full border px-3 py-1 text-xs font-bold
                                ${isSelected ? 'border-white/20 bg-white/10 text-white' : 'border-black bg-slate-50 text-slate-700'}
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
                <p className="mt-1 text-xs text-red-600">{error}</p>
            )}

            <div className="border-t border-black pt-6">
                <p className="mb-3 text-sm font-medium text-slate-900">
                    선택 사항: 단백질 목표 설정
                </p>
                <div className="rounded-[20px] border border-black bg-slate-50 p-4">
                    <div className="flex flex-col space-y-2">
                        <Input
                            label="하루 단백질 목표량"
                            type="number"
                            value={customProtein || ''}
                            placeholder="예: 120"
                            suffix="g"
                            onChange={(e) => {
                                const val = e ? parseInt(e) : undefined;
                                onChange(value!, Number.isNaN(val) ? undefined : val);
                            }}
                            hint="비워두면 자동 계산됩니다."
                        />
                        <p className="text-xs text-slate-500">
                            KDRI 권장량과 활동량을 기준으로 자동 계산할 수 있습니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepGoal;
