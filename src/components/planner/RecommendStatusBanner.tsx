
'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/contexts/AuthContext';
import { useOnboardingContext } from '@/contexts/OnboardingContext';

const RecommendStatusBanner = () => {
    const { session } = useAuthContext();
    const { isOnboarded } = useOnboardingContext();

    // 1. Guest (비로그인)
    if (!session) {
        return (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <h3 className="font-bold text-blue-900 dark:text-blue-100 text-sm">
                            ⚡️ 체험 모드로 실행 중입니다.
                        </h3>
                        <p className="text-blue-700 dark:text-blue-300 text-xs mt-1">
                            성인 남성 표준(2000kcal) 기준으로 식단을 추천합니다.
                        </p>
                    </div>
                    <Link
                        href="/auth"
                        className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition-colors whitespace-nowrap"
                    >
                        로그인하고 맞춤 추천 받기 &gt;
                    </Link>
                </div>
            </div>
        );
    }

    // 2. Partial Member (로그인 O, 온보딩 X)
    if (session && !isOnboarded) {
        return (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <h3 className="font-bold text-amber-900 dark:text-amber-100 text-sm">
                            📝 신체 정보가 없습니다.
                        </h3>
                        <p className="text-amber-700 dark:text-amber-300 text-xs mt-1">
                            표준 데이터로 분석 중입니다. 내 정보를 입력하면 정확도가 올라갑니다!
                        </p>
                    </div>
                    <Link
                        href="/onboarding"
                        className="text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-md transition-colors whitespace-nowrap"
                    >
                        1분 만에 정보 입력하기 &gt;
                    </Link>
                </div>
            </div>
        );
    }

    // 3. Full Member (정상) -> 아무것도 안 보여줌
    return null;
};

export default RecommendStatusBanner;
