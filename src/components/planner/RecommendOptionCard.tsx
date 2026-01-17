'use client';

import React from 'react';
import { ReversePlanResult, DietType } from '@/types/planner';
import { Card, Button } from '@/components/common';

interface RecommendOptionCardProps {
    plan: ReversePlanResult;
    onSelect: () => void;
    isSelected?: boolean;
}

const RecommendOptionCard = ({ plan, onSelect, isSelected }: RecommendOptionCardProps) => {
    // Diet specific styles
    const styles: Record<DietType, { bg: string, border: string, text: string }> = {
        balanced: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-500', text: 'text-green-700 dark:text-green-300' },
        lowCarb: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-500', text: 'text-blue-700 dark:text-blue-300' },
        highProtein: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-500', text: 'text-red-700 dark:text-red-300' },
    };

    const style = styles[plan.dietType];

    return (
        <Card
            className={`
                relative mb-4 cursor-pointer transition-all duration-300
                border-2
                ${isSelected ? style.border : 'border-transparent hover:border-slate-200'}
                ${isSelected ? style.bg : 'bg-white dark:bg-slate-800'}
            `}
            onClick={onSelect}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className={`text-lg font-bold ${style.text}`}>
                        {plan.dietLabel}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Total {plan.dailyTotal.calories}kcal ({plan.accuracy}% 일치)
                    </p>
                </div>
                {isSelected && (
                    <div className={`p-1 rounded-full ${style.bg} ${style.text}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Menu List */}
            <div className="space-y-3">
                {plan.recommendations.map((rec) => (
                    <div key={rec.mealSlot} className="flex items-center text-sm">
                        <span className="w-10 text-xs text-slate-400 uppercase font-bold">
                            {rec.mealSlot.substr(0, 1)}
                        </span>
                        <div className="flex-1 font-medium text-slate-800 dark:text-slate-200">
                            {rec.menu.name}
                        </div>
                        <div className="text-xs text-slate-500">
                            {rec.menu.calories}kcal
                        </div>
                    </div>
                ))}
            </div>

            {/* Macro Ratio Bar (Mini) */}
            <div className="mt-4 flex h-1.5 rounded-full overflow-hidden w-full bg-slate-200 dark:bg-slate-700">
                <div className="bg-red-400 h-full" style={{ width: `${(plan.dailyTotal.protein * 4 / plan.dailyTotal.calories) * 100}%` }}></div>
                <div className="bg-blue-400 h-full" style={{ width: `${(plan.dailyTotal.carbs * 4 / plan.dailyTotal.calories) * 100}%` }}></div>
                <div className="bg-amber-400 h-full" style={{ width: `${(plan.dailyTotal.fat * 9 / plan.dailyTotal.calories) * 100}%` }}></div>
            </div>
        </Card>
    );
};

export default RecommendOptionCard;
