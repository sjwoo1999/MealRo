'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getAnonymousUserId } from '@/lib/userId';
import { DailySummaryResponse, FoodData } from '@/types/food';
import { NutritionMacros } from '@/components/food/NutritionChart';

interface MealLog {
    id: string;
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    meal_date: string;
    foods: FoodData[];
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fat: number;
    created_at: string;
}

const MEAL_TYPE_LABELS: Record<string, { label: string; icon: string }> = {
    breakfast: { label: '아침', icon: '🌅' },
    lunch: { label: '점심', icon: '☀️' },
    dinner: { label: '저녁', icon: '🌙' },
    snack: { label: '간식', icon: '🍪' },
};

import { Suspense } from 'react';

function HistoryContent() {
    const [summary, setSummary] = useState<DailySummaryResponse | null>(null);
    const [meals, setMeals] = useState<MealLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const userId = getAnonymousUserId();

        if (!userId) {
            setIsLoading(false);
            return;
        }

        try {
            // Fetch summary
            const summaryRes = await fetch(`/api/food/summary?user_id=${userId}&date=${selectedDate}`);
            const summaryData = await summaryRes.json();
            if (summaryData.success) {
                setSummary(summaryData.data);
            }

            // Fetch meals for the day
            const historyRes = await fetch(
                `/api/food/history?user_id=${userId}&start_date=${selectedDate}&end_date=${selectedDate}`
            );
            const historyData = await historyRes.json();
            if (historyData.success) {
                setMeals(historyData.data.meals);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const changeDate = (offset: number) => {
        const current = new Date(selectedDate);
        current.setDate(current.getDate() + offset);
        setSelectedDate(current.toISOString().split('T')[0]);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const target = new Date(dateStr);
        target.setHours(0, 0, 0, 0);

        const diff = Math.round((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

        if (diff === 0) return '오늘';
        if (diff === 1) return '어제';
        if (diff === -1) return '내일';

        return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
            <div className="max-w-md mx-auto px-4 py-6">
                {/* Header */}
                <header className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mb-4"
                    >
                        ← 홈으로
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        📊 식사 기록
                    </h1>
                </header>

                {/* Date Navigator */}
                <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl p-3 mb-6 shadow-sm">
                    <button
                        onClick={() => changeDate(-1)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                    >
                        ←
                    </button>
                    <span className="font-medium text-slate-900 dark:text-white">
                        {formatDate(selectedDate)}
                    </span>
                    <button
                        onClick={() => changeDate(1)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                    >
                        →
                    </button>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="text-center py-12">
                        <div className="animate-spin text-4xl mb-2">⏳</div>
                        <p className="text-slate-500">불러오는 중...</p>
                    </div>
                )}

                {/* Daily Summary */}
                {!isLoading && summary && (
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 mb-6 text-white">
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-medium">일일 섭취량</span>
                            <span className="text-2xl font-bold">{summary.total_calories} kcal</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                            <div className="flex justify-between text-sm text-orange-100 mb-1">
                                <span>목표 달성률</span>
                                <span>{summary.goal_achievement}%</span>
                            </div>
                            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full transition-all"
                                    style={{ width: `${summary.goal_achievement}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 text-sm text-orange-100">
                            <span>단백질 {summary.total_protein}g</span>
                            <span>탄수화물 {summary.total_carbs}g</span>
                            <span>지방 {summary.total_fat}g</span>
                        </div>

                        <p className="mt-2 text-xs text-orange-200">
                            {summary.meal_count}끼 기록됨
                        </p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && meals.length === 0 && (
                    <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl">
                        <div className="text-5xl mb-4">📜</div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                            식단 기록이 비어있어요
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            저장한 식단 기록이 여기에 표시됩니다.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-medium rounded-xl shadow-md hover:bg-primary-600 transition-colors"
                        >
                            음식 스캔하러 가기
                        </Link>
                    </div>
                )}

                {/* Meal List */}
                {!isLoading && meals.length > 0 && (
                    <div className="space-y-4">
                        {meals.map((meal) => (
                            <div
                                key={meal.id}
                                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <span className="text-lg mr-2">
                                            {MEAL_TYPE_LABELS[meal.meal_type]?.icon}
                                        </span>
                                        <span className="font-medium text-slate-900 dark:text-white">
                                            {MEAL_TYPE_LABELS[meal.meal_type]?.label}
                                        </span>
                                    </div>
                                    <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                        {meal.total_calories} kcal
                                    </span>
                                </div>

                                {/* Foods */}
                                <div className="space-y-2">
                                    {meal.foods.map((food, idx) => (
                                        <div key={idx} className="text-sm text-slate-600 dark:text-slate-400">
                                            • {food.food_name} ({food.nutrition?.calories || 0}kcal)
                                        </div>
                                    ))}
                                </div>

                                {/* Macros */}
                                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                    <NutritionMacros
                                        nutrition={{
                                            calories: meal.total_calories,
                                            protein: meal.total_protein,
                                            carbohydrates: meal.total_carbs,
                                            fat: meal.total_fat,
                                            sodium: 0,
                                            fiber: 0,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Meal Button */}
                <Link
                    href="/scan"
                    className="fixed bottom-6 right-6 w-14 h-14 bg-primary-500 text-white rounded-full 
                        flex items-center justify-center text-2xl shadow-lg hover:bg-primary-600 transition-colors"
                >
                    📸
                </Link>
            </div>
        </main>
    );
}

export default function HistoryPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-slate-500">로딩 중...</div>}>
            <HistoryContent />
        </Suspense>
    );
}
