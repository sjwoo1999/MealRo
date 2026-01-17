'use client';

import React, { useEffect, useState } from 'react';
import { useOnboardingContext } from '@/contexts/OnboardingContext'; // Safe to use directly if provider wraps
import { useOnboardingCheck } from '@/hooks/useOnboardingCheck';
import { Card, Button } from '@/components/common';
import Link from 'next/link';

export default function MealHistoryPage() {
    const { profile, isLoading: isAuthLoading } = useOnboardingCheck({ redirectIfNotOnboarded: true });
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!profile?.anonymous_user_id) return;

            try {
                const res = await fetch(`/api/planner/history?userId=${profile.anonymous_user_id}`);
                const data = await res.json();
                if (data.success) {
                    setHistory(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch history", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (profile) {
            fetchHistory();
        }
    }, [profile]);

    if (isAuthLoading || isLoading) return <div className="p-8 text-center text-slate-500">로딩 중...</div>;

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 text-slate-900 dark:text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">식단 기록 📅</h1>
                <Link href="/meal">
                    <Button variant="outline" size="sm">새 식단 짜기</Button>
                </Link>
            </div>

            {history.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <p className="text-slate-500 mb-4">저장된 식단이 없습니다.</p>
                    <Link href="/meal">
                        <Button>지금 추천 받기</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((plan) => (
                        <Card key={plan.id} className="border border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="text-sm text-slate-500">
                                        {new Date(plan.created_at).toLocaleDateString()} {new Date(plan.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <h3 className="font-bold text-lg">
                                        {plan.selected_menu_name} ({plan.selected_meal_slot === 'lunch' ? '점심' : plan.selected_meal_slot === 'dinner' ? '저녁' : '아침'})
                                    </h3>
                                </div>
                                <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    Target: {plan.user_target_calories}kcal
                                </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                                <p className="text-sm font-medium mb-2">추천 결과:</p>
                                <div className="space-y-1">
                                    {plan.recommendations.map((rec: any, idx: number) => (
                                        <div key={idx} className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                                            <span>
                                                <span className="font-bold text-xs uppercase mr-2 bg-slate-200 dark:bg-slate-600 px-1 rounded">
                                                    {rec.mealSlot.substr(0, 1)}
                                                </span>
                                                {rec.menu.name}
                                            </span>
                                            <span>{rec.menu.calories}kcal</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
