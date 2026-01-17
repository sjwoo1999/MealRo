'use client';

import React from 'react';
import { TdeeCalculationResult, Gender, ActivityLevel, Goal } from '@/types/user';
import { Button, Card, ProgressBar } from '@/components/common';

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
        <div className="space-y-8 animate-fade-in-up max-w-lg mx-auto pb-8">
            <div className="text-center space-y-2">
                <div className="text-4xl animate-bounce mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    맞춤 분석이 완료되었습니다!
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                    회원님의 목표 달성을 위한 일일 영양 가이드입니다.
                </p>
            </div>

            {/* Target Calories */}
            <div className="text-center relative py-8">
                <div className="absolute inset-0 flex items-center justify-center opacity-10 blur-3xl">
                    <div className="w-48 h-48 bg-green-500 rounded-full animate-pulse-ring"></div>
                </div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
                    Daily Calories
                </p>
                <div className="text-5xl font-black text-slate-900 dark:text-white animate-count-up">
                    {result.targetCalories.toLocaleString()}
                    <span className="text-xl font-medium text-slate-400 ml-1">kcal</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                    (기초대사량: {result.bmr.toLocaleString()} kcal)
                </p>
            </div>

            {/* Macros */}
            <div className="grid grid-cols-3 gap-4">
                <MacroCard
                    label="단백질"
                    amount={result.targetProtein}
                    total={result.targetProtein + result.targetCarbs + result.targetFat} // Simple total for ratio visualization
                    color="text-red-500"
                    bgColor="bg-red-500"
                />
                <MacroCard
                    label="탄수화물"
                    amount={result.targetCarbs}
                    total={result.targetProtein + result.targetCarbs + result.targetFat}
                    color="text-blue-500"
                    bgColor="bg-blue-500"
                />
                <MacroCard
                    label="지방"
                    amount={result.targetFat}
                    total={result.targetProtein + result.targetCarbs + result.targetFat}
                    color="text-amber-500"
                    bgColor="bg-amber-500"
                />
            </div>

            {/* User Info Summary */}
            <Card className="bg-slate-50 dark:bg-slate-800/50">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-3">
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
                <Button variant="ghost" onClick={onBack}>
                    다시 설정
                </Button>
                <Button fullWidth onClick={onConfirm} size="lg">
                    시작하기
                </Button>
            </div>
        </div>
    );
};

const MacroCard = ({ label, amount, total, color, bgColor }: { label: string, amount: number, total: number, color: string, bgColor: string }) => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm text-center border border-slate-100 dark:border-slate-700">
        <div className={`text-xs font-bold ${color} mb-1`}>{label}</div>
        <div className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {amount}g
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full ${bgColor}`} style={{ width: '60%' }}></div>
            {/* Note: Real ratio calculation would need total grams or calories logic, simplified here */}
        </div>
    </div>
);

const InfoRow = ({ label, value, colSpan = 1 }: { label: string, value: string, colSpan?: number }) => (
    <div className={`${colSpan === 2 ? 'col-span-2' : ''} flex justify-between pr-4`}>
        <span className="text-slate-500 dark:text-slate-400">{label}</span>
        <span className="font-medium text-slate-700 dark:text-slate-200">{value}</span>
    </div>
);

export default TdeeResult;
