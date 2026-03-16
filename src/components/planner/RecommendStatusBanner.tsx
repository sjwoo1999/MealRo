'use client';

import React from 'react';
import Link from 'next/link';
import { useOnboardingContext } from '@/contexts/OnboardingContext';

const RecommendStatusBanner = () => {
    const { isOnboarded } = useOnboardingContext();

    if (!isOnboarded) {
        return (
            <Banner
                title="기본 기준값으로 추천을 계산합니다"
                description="온보딩을 입력하면 목표 칼로리와 영양 비율이 개인 데이터 기준으로 더 정확해집니다."
                ctaHref="/onboarding"
                ctaLabel="온보딩 입력"
            />
        );
    }

    return (
        <div className="rounded-[24px] border border-line-strong bg-surface-muted p-5">
            <p className="text-sm font-semibold text-copy">개인화 추천 기준 활성화</p>
            <p className="mt-1 text-sm leading-6 text-copy-subtle">
                온보딩 정보 기준으로 오늘의 목표 칼로리와 영양 비율을 반영해 추천합니다.
            </p>
        </div>
    );
};

function Banner({
    title,
    description,
    ctaHref,
    ctaLabel,
}: {
    title: string;
    description: string;
    ctaHref: string;
    ctaLabel: string;
}) {
    return (
        <div className="rounded-[24px] border border-line-strong bg-surface-muted p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-copy">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-copy-subtle">{description}</p>
                </div>
                <Link
                    href={ctaHref}
                    className="inline-flex items-center justify-center rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-semibold text-copy transition-colors hover:bg-surface-muted"
                >
                    {ctaLabel}
                </Link>
            </div>
        </div>
    );
}

export default RecommendStatusBanner;
