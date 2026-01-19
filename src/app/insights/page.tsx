'use client';

import { useState } from 'react';
import Card from '@/components/common/Card';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

export default function InsightsPage() {
    const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24">
            <header className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-10 px-4 h-14 flex items-center justify-between">
                <h1 className="text-xl font-bold">분석</h1>

                {/* Period Toggle */}
                <div className="bg-slate-100 dark:bg-slate-700 p-1 rounded-lg flex text-xs font-medium">
                    <button
                        onClick={() => setPeriod('weekly')}
                        className={`px-3 py-1.5 rounded-md transition-all ${period === 'weekly'
                            ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        주간
                    </button>
                    <button
                        onClick={() => setPeriod('monthly')}
                        className={`px-3 py-1.5 rounded-md transition-all ${period === 'monthly'
                            ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        월간
                    </button>
                </div>
            </header>

            <main className="pt-20 px-4 space-y-6">

                {/* Date Navigator */}
                <div className="flex items-center justify-center gap-4 py-2">
                    <button className="p-1 hover:bg-slate-200 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
                    <span className="font-bold text-lg">1월 3주차 (1.15 - 1.21)</span>
                    <button className="p-1 hover:bg-slate-200 rounded-full"><ChevronRight className="w-5 h-5" /></button>
                </div>

                {/* Calorie Chart Skeleton */}
                <Card className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold">섭취 칼로리</h3>
                        <span className="text-xs text-slate-500">일평균 1,850 kcal</span>
                    </div>
                    <div className="h-40 flex items-end justify-between gap-2 px-2">
                        {[65, 80, 45, 90, 70, 85, 60].map((h, i) => (
                            <div key={i} className="flex flex-col items-center gap-1 flex-1">
                                <div
                                    className={`w-full rounded-t-sm transition-all ${i === 3 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                                    style={{ height: `${h}%` }}
                                />
                                <span className="text-[10px] text-slate-400">
                                    {['월', '화', '수', '목', '금', '토', '일'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Macro Breakdown Skeleton */}
                <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 flex flex-col items-center justify-center">
                        <div className="relative w-24 h-24 rounded-full border-[10px] border-slate-100 flex items-center justify-center mb-2">
                            {/* Fake Pie Chart Segments would go here */}
                            <div className="absolute inset-0 rounded-full border-[10px] border-emerald-500 border-r-transparent border-b-transparent rotate-45" />
                            <span className="font-bold text-xl">58%</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-600">탄수화물 적정</span>
                    </Card>

                    <div className="space-y-2">
                        <Card className="p-3 flex justify-between items-center text-xs">
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" />탄수화물</span>
                            <span className="font-medium">210g</span>
                        </Card>
                        <Card className="p-3 flex justify-between items-center text-xs">
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" />단백질</span>
                            <span className="font-medium">85g</span>
                        </Card>
                        <Card className="p-3 flex justify-between items-center text-xs">
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500" />지방</span>
                            <span className="font-medium">45g</span>
                        </Card>
                    </div>
                </div>

                {/* KDRI Radar Chart Placeholder */}
                <Card className="p-5">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold flex items-center gap-1">
                            KDRI 달성도 <Info className="w-3 h-3 text-slate-400" />
                        </h3>
                    </div>
                    <div className="aspect-square bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-4 border border-slate-200 rounded-full border-dashed" />
                        <div className="absolute inset-12 border border-slate-200 rounded-full border-dashed" />
                        <span className="text-xs text-slate-400">Radar Chart Visualization</span>
                    </div>
                </Card>

                {/* Streak Counter */}
                <div className="bg-gradient-to-r from-orange-400 to-rose-500 p-4 rounded-xl text-white flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium opacity-90">연속 기록 도전 중 🔥</p>
                        <p className="text-2xl font-bold">12일째</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs opacity-90">다음 목표</p>
                        <p className="font-bold">14일</p>
                    </div>
                </div>

            </main>
        </div>
    );
}
