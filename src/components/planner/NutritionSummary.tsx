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
        <Card padding="lg">
            <h3 className="text-base font-semibold text-slate-900">목표 대비 영양 요약</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
                선택한 추천안이 하루 목표에 얼마나 근접하는지 먼저 확인합니다.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <SummaryItem label="칼로리" current={current.calories} target={target.calories} unit="kcal" />
                <SummaryItem label="탄수화물" current={current.carbs} target={target.carbs} unit="g" />
                <SummaryItem label="단백질" current={current.protein} target={target.protein} unit="g" />
                <SummaryItem label="지방" current={current.fat} target={target.fat} unit="g" />
            </div>
        </Card>
    );
};

function SummaryItem({
    label,
    current,
    target,
    unit,
}: {
    label: string;
    current: number;
    target: number;
    unit: string;
}) {
    const percent = Math.round((current / target) * 100);
    const tone = percent > 110 ? '#111111' : percent < 90 ? '#6b7280' : '#111111';
    const status = percent > 110 ? '초과' : percent < 90 ? '부족' : '적정';

    return (
        <div className="rounded-[22px] border border-black bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                        {current}
                        <span className="ml-1 text-sm font-medium text-slate-500">{unit}</span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">목표 {target}{unit}</p>
                </div>
                <span className="rounded-full border border-black px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: tone }}>
                    {status}
                </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                    className="h-full rounded-full"
                    style={{
                        width: `${Math.min(percent, 100)}%`,
                        backgroundColor: tone,
                    }}
                />
            </div>
            <p className="mt-2 text-xs text-slate-500">달성률 {percent}%</p>
        </div>
    );
}

export default NutritionSummary;
