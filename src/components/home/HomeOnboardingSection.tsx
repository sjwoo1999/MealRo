'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Target } from 'lucide-react';
import { useOnboardingCheck } from '@/hooks/useOnboardingCheck';
import { Card, ProgressBar, Button } from '@/components/common';

export default function HomeOnboardingSection() {
    const { isOnboarded, isLoading, profile } = useOnboardingCheck();

    if (isLoading) {
        return null;
    }

    if (!isOnboarded) {
        return (
            <section className="rounded-[28px] border border-black bg-white p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="inline-flex rounded-full border border-black px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700">
                            STEP 00
                        </div>
                        <h2 className="mt-4 text-2xl font-semibold text-slate-900">
                            맞춤 목표 설정
                        </h2>
                        <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
                            추천 정확도를 높이려면 온보딩에서 목표 칼로리와 영양 기준을 먼저 정합니다.
                        </p>
                    </div>
                    <div className="hidden h-12 w-12 items-center justify-center rounded-[18px] border border-black bg-[#f7f7f7] lg:flex">
                        <Target className="h-5 w-5" />
                    </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <MiniWireBlock title="입력" description="신체 정보와 활동량" />
                    <MiniWireBlock title="계산" description="권장 칼로리와 탄단지" />
                    <MiniWireBlock title="반영" description="추천 기준과 기록 목표" />
                </div>

                <div className="mt-6">
                    <Link href="/onboarding" className="inline-flex">
                        <Button variant="outline" className="border-black bg-white shadow-none" rightIcon={<ArrowRight className="h-4 w-4" />}>
                            온보딩 시작
                        </Button>
                    </Link>
                </div>
            </section>
        );
    }

    if (!profile) {
        return null;
    }

    return (
        <Card padding="lg" className="overflow-hidden border border-black shadow-none">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">PERSONAL GOAL</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">
                        오늘 기준 목표
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                        {profile.goal === 'lose' ? '체중 감량' : profile.goal === 'gain' ? '근육 증가' : '체중 유지'} 모드
                    </p>
                </div>
                <Link href="/onboarding" className="text-sm font-medium text-slate-900 hover:underline">
                    설정 변경
                </Link>
            </div>

            <div className="mt-5 rounded-[24px] border border-black bg-[#f7f7f7] p-5">
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-semibold text-slate-900">0</span>
                    <span className="mb-1 text-sm text-slate-500">/ {profile.target_calories?.toLocaleString()} kcal</span>
                </div>

                <div className="mt-4">
                    <ProgressBar
                        current={0}
                        max={profile.target_calories || 2000}
                        color="primary"
                        showValue
                    />
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                    <MacroMiniCard label="탄수화물" current={0} target={profile.target_carbs || 0} />
                    <MacroMiniCard label="단백질" current={0} target={profile.target_protein || 0} />
                    <MacroMiniCard label="지방" current={0} target={profile.target_fat || 0} />
                </div>
            </div>
        </Card>
    );
}

function MiniWireBlock({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-[18px] border border-black bg-[#f7f7f7] p-4">
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
    );
}

function MacroMiniCard({
    label,
    current,
    target,
}: {
    label: string;
    current: number;
    target: number;
}) {
    const width = target > 0 ? Math.min((current / target) * 100, 100) : 0;

    return (
        <div className="rounded-[18px] border border-black bg-white p-3 text-center text-xs">
            <div className="text-slate-500">{label}</div>
            <div className="mt-1 font-semibold text-slate-900">{current}/{target}g</div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full bg-black" style={{ width: `${width}%` }} />
            </div>
        </div>
    );
}
