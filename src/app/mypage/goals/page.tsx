'use client';

import { useState } from 'react';
import { ChevronLeft, Info } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

export default function GoalsEditPage() {
    const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('lose');
    const [activity, setActivity] = useState('light');
    const [useKDRI, setUseKDRI] = useState(true);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24">
            <header className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-10">
                <div className="flex items-center h-14 px-4">
                    <Link href="/mypage" className="p-2 -ml-2">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-lg font-bold ml-2">목표 설정</h1>
                </div>
            </header>

            <main className="pt-20 px-4 space-y-8">

                {/* Goal Type */}
                <section className="space-y-3">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">나의 목표</h2>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { id: 'lose', label: '다이어트', emoji: '🥗' },
                            { id: 'maintain', label: '유지어터', emoji: '⚖️' },
                            { id: 'gain', label: '벌크업', emoji: '💪' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setGoal(item.id as any)}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${goal === item.id
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                                    : 'border-transparent bg-white dark:bg-slate-800 shadow-sm'
                                    }`}
                            >
                                <span className="text-2xl mb-1">{item.emoji}</span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Activity Level */}
                <section className="space-y-3">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">평소 활동량</h2>
                    <div className="space-y-2">
                        <select
                            value={activity}
                            onChange={(e) => setActivity(e.target.value)}
                            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 appearance-none"
                        >
                            <option value="sedentary">비활동적 (주로 앉아서 생활)</option>
                            <option value="light">가벼운 활동 (주 1-3회 운동)</option>
                            <option value="moderate">보통 활동 (주 3-5회 운동)</option>
                            <option value="active">활동적 (주 6-7회 운동)</option>
                            <option value="very_active">매우 활동적 (육체 노동/선수)</option>
                        </select>
                    </div>
                </section>

                {/* KDRI Toggle */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">영양 목표 설정 기준</h2>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${useKDRI ? 'text-emerald-500' : 'text-slate-400'}`}>KDRI 2025</span>
                            <button
                                onClick={() => setUseKDRI(!useKDRI)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${useKDRI ? 'bg-emerald-500' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${useKDRI ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    <Card className="p-4 bg-slate-50 dark:bg-slate-800/50 border-0">
                        <div className="flex gap-3">
                            <Info className="w-5 h-5 text-emerald-500 shrink-0" />
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                <strong>2025 한국인 영양소 섭취기준</strong>을 적용하여,
                                회원님의 연령과 체성분에 맞는 최적의 섭취량을 자동으로 계산합니다.
                            </p>
                        </div>
                    </Card>
                </section>

                <div className="pt-4">
                    <Button fullWidth onClick={() => alert('Updated!')}>목표 저장하기</Button>
                </div>
            </main>
        </div>
    );
}
