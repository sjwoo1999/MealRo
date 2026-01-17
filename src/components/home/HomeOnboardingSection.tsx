'use client';

import React from 'react';
import Link from 'next/link';
import { useOnboardingCheck } from '@/hooks/useOnboardingCheck';
import { Card, ProgressBar, Button } from '@/components/common';

export default function HomeOnboardingSection() {
    const { isOnboarded, isLoading, profile } = useOnboardingCheck();

    if (isLoading) return null; // Or skeleton

    if (!isOnboarded) {
        return (
            <div className="mb-8 animate-fade-in-up">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold mb-1">
                                맞춤 영양 목표를 설정해보세요! 🥗
                            </h2>
                            <p className="text-green-50 opacity-90 text-sm">
                                내 몸에 딱 맞는 하루 권장 칼로리와 영양소를 알려드려요.
                            </p>
                        </div>
                        <Link href="/onboarding">
                            <Button
                                variant="secondary"
                                className="bg-white text-green-600 hover:bg-green-50 border-none font-bold whitespace-nowrap"
                            >
                                시작하기
                            </Button>
                        </Link>
                    </div>

                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-yellow-300 opacity-10 rounded-full blur-xl"></div>
                </div>
            </div>
        );
    }

    if (profile) {
        return (
            <div className="mb-8 animate-fade-in-up">
                <Card className="border-green-100 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">
                                오늘의 목표 칼로리
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {profile.goal === 'lose' ? '체중 감량' : profile.goal === 'gain' ? '근육 증가' : '체중 유지'} 모드
                            </p>
                        </div>
                        <Link href="/onboarding" className="text-xs text-slate-400 hover:text-green-500 underline">
                            설정 변경
                        </Link>
                    </div>

                    {/* Progress Mockup - In real app, fetch consumption data */}
                    <div className="space-y-4">
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-slate-900 dark:text-white">0</span>
                            <span className="text-sm text-slate-400 mb-1">/ {profile.target_calories?.toLocaleString()} kcal</span>
                        </div>

                        <ProgressBar
                            current={0}
                            max={profile.target_calories || 2000}
                            color="primary"
                            showValue
                        />

                        <div className="grid grid-cols-3 gap-2 mt-2">
                            <MacroMiniCard label="탄수화물" current={0} target={profile.target_carbs || 0} color="bg-blue-500" />
                            <MacroMiniCard label="단백질" current={0} target={profile.target_protein || 0} color="bg-red-500" />
                            <MacroMiniCard label="지방" current={0} target={profile.target_fat || 0} color="bg-amber-500" />
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return null;
}

const MacroMiniCard = ({ label, current, target, color }: { label: string, current: number, target: number, color: string }) => (
    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2 text-center text-xs">
        <div className="text-slate-500 dark:text-slate-400 mb-1">{label}</div>
        <div className="font-bold text-slate-900 dark:text-slate-200">{current}/{target}g</div>
        <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
            <div className={`h-full ${color}`} style={{ width: `${Math.min((current / target) * 100, 100)}%` }}></div>
        </div>
    </div>
);
