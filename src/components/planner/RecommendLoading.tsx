'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Card } from '@/components/common';

const MESSAGES = [
    '입력한 메뉴를 기준값으로 정리하는 중...',
    '남은 칼로리를 끼니별로 다시 배분하는 중...',
    '식단 옵션 3가지를 비교하는 중...',
    '와이어프레임 결과 화면을 준비하는 중...',
];

const RecommendLoading = ({
    mealLabel,
    selectedMenu,
}: {
    mealLabel?: string;
    selectedMenu?: string;
}) => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
        }, 900);

        return () => clearInterval(interval);
    }, []);

    return (
        <Card padding="lg">
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-black bg-white text-slate-900">
                    <Sparkles className="h-7 w-7 animate-pulse" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-900">
                    {mealLabel ? `${mealLabel} 기준 추천을 계산하고 있어요` : '추천 식단을 계산하고 있어요'}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                    {selectedMenu ? `${selectedMenu}를 기준 메뉴로 사용 중입니다.` : '입력한 메뉴를 기반으로 나머지 끼니를 재구성합니다.'}
                </p>

                <div className="mt-6 w-full max-w-md rounded-[24px] border border-black bg-slate-50 p-5 text-left">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">In Progress</p>
                    <div className="mt-4 space-y-3">
                        {MESSAGES.map((message, index) => (
                            <div key={message} className="flex gap-3">
                                <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold ${
                                    index <= messageIndex ? 'border-black bg-black text-white' : 'border-black bg-white text-slate-500'
                                }`}>
                                    <span className="text-[11px] font-semibold">{index + 1}</span>
                                </div>
                                <p className="text-sm leading-6 text-slate-600">{message}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="mt-4 text-sm font-medium text-slate-500">
                    {MESSAGES[messageIndex]}
                </p>
            </div>
        </Card>
    );
};

export default RecommendLoading;
