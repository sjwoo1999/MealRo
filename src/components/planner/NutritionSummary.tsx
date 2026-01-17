'use client';

import React from 'react';
import { Card } from '@/components/common';

interface NutritionSummaryProps {
    current: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    target: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
}

const NutritionSummary = ({ current, target }: NutritionSummaryProps) => {
    return (
        <Card className="bg-slate-50 dark:bg-slate-800/50 mb-6">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-3">
                예상 영양 섭취
            </h4>
            <div className="grid grid-cols-4 gap-2 text-center">
                <SummaryItem label="칼로리" current={current.calories} target={target.calories} unit="kcal" />
                <SummaryItem label="탄수화물" current={current.carbs} target={target.carbs} unit="g" />
                <SummaryItem label="단백질" current={current.protein} target={target.protein} unit="g" />
                <SummaryItem label="지방" current={current.fat} target={target.fat} unit="g" />
            </div>
        </Card>
    );
};

const SummaryItem = ({ label, current, target, unit }: { label: string, current: number, target: number, unit: string }) => {
    const percent = Math.round((current / target) * 100);
    const isOver = percent > 110;
    const isUnder = percent < 90;

    return (
        <div>
            <div className="text-xs text-slate-500 mb-1">{label}</div>
            <div className={`font-bold text-sm ${isOver ? 'text-red-500' : isUnder ? 'text-amber-500' : 'text-green-500'}`}>
                {current}
            </div>
            <div className="text-[10px] text-slate-400">/ {target}{unit}</div>
        </div>
    );
};

export default NutritionSummary;
