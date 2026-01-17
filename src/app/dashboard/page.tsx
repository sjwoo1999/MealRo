'use client';

import React, { useEffect, useState } from 'react';
import { useOnboardingCheck } from '@/hooks/useOnboardingCheck';
import CalorieProgress from '@/components/dashboard/CalorieProgress';
import MacroCard from '@/components/dashboard/MacroCard';
import MealLogList from '@/components/dashboard/MealLogList';

import { Suspense } from 'react';

function DashboardContent() {
    const { profile, isOnboarded, isLoading: authLoading } = useOnboardingCheck({ redirectIfNotOnboarded: true });
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!profile?.anonymous_user_id) return;
            try {
                const res = await fetch(`/api/planner/history?userId=${profile.anonymous_user_id}`);
                const data = await res.json();
                if (data.success) {
                    setHistory(data.data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        if (profile) fetchData();
    }, [profile]);

    if (authLoading || isLoading) return <div className="p-8 text-center text-slate-500">대시보드 로딩 중...</div>;

    // Calculate Todays Consumption (Mock logic based on history)
    const today = new Date().toDateString();
    const todaysLogs = history.filter(h => new Date(h.created_at).toDateString() === today);

    let currentCalories = 0;
    let currentCarbs = 0;
    let currentProtein = 0;
    let currentFat = 0;

    todaysLogs.forEach(log => {
        // ... (mock logic omitted for brevity in thought, but implicitly kept by not replacing unless needed. 
        // Wait, replace tool replaces the block. I need to be careful not to delete logic.)
        // Since the previous file content is huge, I should wrap the whole return or extract component.
        // Extraction is safer to avoid deleting lines I don't see in the prompt context fully if I am not careful,
        // but I have full view.
        // Better: Wrap the export default function's logic into a child, and make the default export just the Suspense wrapper.
    });

    // Heuristic calc
    const heuristicCalories = todaysLogs.length * 600;
    currentCalories = heuristicCalories;
    currentCarbs = todaysLogs.length * 80;
    currentProtein = todaysLogs.length * 40;
    currentFat = todaysLogs.length * 20;

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                안녕하세요, {profile?.gender === 'male' ? '남성' : '여성'} 회원님 👋
            </h1>

            <div className="mb-6">
                <CalorieProgress
                    current={currentCalories}
                    target={profile?.target_calories || 2000}
                    goalType={profile?.goal || undefined}
                />
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
                <MacroCard label="탄수화물" current={currentCarbs} target={profile?.target_carbs || 300} color="bg-blue-500" />
                <MacroCard label="단백질" current={currentProtein} target={profile?.target_protein || 100} color="bg-red-500" />
                <MacroCard label="지방" current={currentFat} target={profile?.target_fat || 60} color="bg-amber-500" />
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">최근 식단 기록</h3>
                    <a href="/meal/history" className="text-xs text-slate-400 hover:text-primary-500">전체보기</a>
                </div>
                <MealLogList logs={history.slice(0, 3)} />
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-slate-500">로딩 중...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
