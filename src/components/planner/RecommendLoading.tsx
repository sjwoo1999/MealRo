'use client';

import React, { useEffect, useState } from 'react';

const MESSAGES = [
    "영양소 분석 중...",
    "칼로리 계산 중...",
    "최적의 메뉴 조합 찾는 중...",
    "식단 구성 중..."
];

const RecommendLoading = () => {
    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in-up">
            <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-xl animate-pulse">
                    🤖
                </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                AI가 식단을 짜고 있어요
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 min-h-[20px] transition-all duration-300">
                {MESSAGES[msgIndex]}
            </p>
        </div>
    );
};

export default RecommendLoading;
