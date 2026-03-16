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
            <h3 className="text-base font-semibold text-copy">목표 대비 영양 요약</h3>
            <p className="mt-1 text-sm leading-6 text-copy-subtle">
                선택한 추천안이 하루 목표에 얼마나 근접하는지 먼저 확인합니다.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
    const isOver = percent > 110;
    const isUnder = percent < 90;

    const badgeClass = isOver
        ? 'text-red-600 bg-red-50 border-red-200'
        : isUnder
        ? 'text-copy-subtle bg-surface-muted border-line'
        : 'text-green-600 bg-green-50 border-green-200';

    const barColor = isOver ? '#ef4444' : isUnder ? '#9ca3af' : '#22c55e';
    const status = isOver ? '초과' : isUnder ? '부족' : '적정';

    return (
        <div className="rounded-[22px] border border-line-strong bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm text-copy-subtle">{label}</p>
                    <p className="mt-2 text-lg font-semibold text-copy">
                        {current}
                        <span className="ml-1 text-sm font-medium text-copy-subtle">{unit}</span>
                    </p>
                    <p className="mt-1 text-xs text-copy-subtle">목표 {target}{unit}</p>
                </div>
                <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${badgeClass}`}>
                    {status}
                </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-muted">
                <div
                    className="h-full rounded-full"
                    style={{
                        width: `${Math.min(percent, 100)}%`,
                        backgroundColor: barColor,
                    }}
                />
            </div>
            <p className="mt-2 text-xs text-copy-subtle">{percent}%</p>
        </div>
    );
}

export default NutritionSummary;
