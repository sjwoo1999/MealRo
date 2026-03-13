'use client';

import React from 'react';
import { TdeeCalculationResult, Gender, ActivityLevel, Goal } from '@/types/user';
import { Button, Card } from '@/components/common';

interface TdeeResultProps {
    result: TdeeCalculationResult;
    userInfo: {
        gender: Gender;
        age: number;
        height: number;
        weight: number;
        activityLevel: ActivityLevel;
        goal: Goal;
    };
    onConfirm: () => void;
    onBack: () => void;
}

const TdeeResult = ({ result, userInfo, onConfirm, onBack }: TdeeResultProps) => {
    return (
        <div className="mx-auto max-w-lg animate-fade-in-up space-y-6 pb-8">
            <div className="space-y-2 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Result</p>
                <h2 className="text-2xl font-bold text-slate-900">
                    맞춤 기준이 준비됐습니다
                </h2>
                <p className="text-slate-500">
                    이 값을 기준으로 식사 기록과 추천을 계산합니다.
                </p>
            </div>

            <div className="rounded-[24px] border border-black bg-white py-8 text-center">
                <p className="mb-2 text-sm font-medium uppercase tracking-wider text-slate-500">
                    Daily Calories
                </p>
                <div className="text-5xl font-black text-slate-900">
                    {result.targetCalories.toLocaleString()}
                    <span className="ml-1 text-xl font-medium text-slate-400">kcal</span>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                    (기초대사량: {result.bmr.toLocaleString()} kcal)
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <MacroCard
                    label="단백질"
                    amount={result.targetProtein}
                    total={result.targetProtein + result.targetCarbs + result.targetFat} // Simple total for ratio visualization
                />
                <MacroCard
                    label="탄수화물"
                    amount={result.targetCarbs}
                    total={result.targetProtein + result.targetCarbs + result.targetFat}
                />
                <MacroCard
                    label="지방"
                    amount={result.targetFat}
                    total={result.targetProtein + result.targetCarbs + result.targetFat}
                />
            </div>

            <Card className="bg-slate-50">
                <h3 className="mb-3 text-sm font-bold text-slate-900">
                    나의 정보
                </h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <InfoRow label="성별" value={userInfo.gender === 'male' ? '남성' : '여성'} />
                    <InfoRow label="나이" value={`${userInfo.age}세`} />
                    <InfoRow label="신장" value={`${userInfo.height}cm`} />
                    <InfoRow label="체중" value={`${userInfo.weight}kg`} />
                    <InfoRow label="활동량" value={userInfo.activityLevel || '-'} colSpan={2} />
                    <InfoRow label="목표" value={userInfo.goal === 'lose' ? '감량' : userInfo.goal === 'gain' ? '증량' : '유지'} colSpan={2} />
                </div>
            </Card>

            <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={onBack}>
                    다시 설정
                </Button>
                <Button fullWidth onClick={onConfirm} size="lg">
                    시작하기
                </Button>
            </div>
        </div>
    );
};

const MacroCard = ({ label, amount, total }: { label: string, amount: number, total: number }) => (
    <div className="rounded-2xl border border-black bg-white p-4 text-center">
        <div className="mb-1 text-xs font-bold text-slate-500">{label}</div>
        <div className="mb-2 text-xl font-bold text-slate-900">
            {amount}g
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-black" style={{ width: `${Math.min((amount / total) * 100, 100)}%` }}></div>
        </div>
    </div>
);

const InfoRow = ({ label, value, colSpan = 1 }: { label: string, value: string, colSpan?: number }) => (
    <div className={`${colSpan === 2 ? 'col-span-2' : ''} flex justify-between pr-4`}>
        <span className="text-slate-500">{label}</span>
        <span className="font-medium text-slate-700">{value}</span>
    </div>
);

export default TdeeResult;
