'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ReversePlanResult } from '@/types/planner';

interface RecommendOptionCardProps {
    plan: ReversePlanResult;
    onSelect: () => void;
    isSelected?: boolean;
}

const DIET_LABEL: Record<string, string> = {
    balanced: '가장 기본적인 균형안',
    lowCarb: '탄수 비중을 낮추는 안',
    highProtein: '단백질을 높이는 안',
};

const SLOT_LABELS = {
    breakfast: '아침',
    lunch: '점심',
    dinner: '저녁',
};

const RecommendOptionCard = ({ plan, onSelect, isSelected = false }: RecommendOptionCardProps) => {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`w-full rounded-[24px] border p-5 text-left transition-colors ${
                isSelected ? 'border-black bg-black text-white' : 'border-black bg-white text-slate-900'
            }`}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">
                            {plan.dietLabel}
                        </h3>
                        {isSelected && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                                Selected
                            </span>
                        )}
                    </div>
                    <p className={`mt-1 text-sm ${isSelected ? 'text-white/70' : 'text-slate-600'}`}>{DIET_LABEL[plan.dietType]}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-semibold">{plan.accuracy}% 일치</p>
                    <p className={`mt-1 text-xs ${isSelected ? 'text-white/70' : 'text-slate-500'}`}>총 {plan.dailyTotal.calories} kcal</p>
                </div>
            </div>

            <div className="mt-4 space-y-3">
                {plan.recommendations.map((recommendation) => (
                    <div
                        key={recommendation.mealSlot}
                        className={`rounded-[18px] border p-4 ${isSelected ? 'border-white/20 bg-white/10' : 'border-black bg-slate-50'}`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${isSelected ? 'text-white/70' : 'text-slate-500'}`}>
                                    {SLOT_LABELS[recommendation.mealSlot]}
                                </p>
                                <p className="mt-1 font-medium">{recommendation.menu.name}</p>
                                <p className={`mt-2 text-xs ${isSelected ? 'text-white/70' : 'text-slate-500'}`}>
                                    목표 {recommendation.targetCalories} kcal 대비 {recommendation.caloriesDiff > 0 ? '+' : ''}{recommendation.caloriesDiff} kcal
                                </p>
                            </div>
                            <span className="text-sm font-semibold">{recommendation.menu.calories} kcal</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <MiniMetric label="탄수" value={`${plan.dailyTotal.carbs}g`} />
                <MiniMetric label="단백질" value={`${plan.dailyTotal.protein}g`} />
                <MiniMetric label="지방" value={`${plan.dailyTotal.fat}g`} />
            </div>

            {isSelected && (
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white">
                    <CheckCircle2 className="h-4 w-4" />
                    이 추천안을 현재 선택 중
                </div>
            )}
        </button>
    );
};

function MiniMetric({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-[16px] border border-current/10 px-3 py-2">
            <p className="opacity-70">{label}</p>
            <p className="mt-1 font-semibold">{value}</p>
        </div>
    );
}

export default RecommendOptionCard;
