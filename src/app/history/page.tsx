'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useOnboardingCheck } from '@/hooks/useOnboardingCheck';
import {
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    Bars3Icon,
    Squares2X2Icon
} from '@heroicons/react/24/outline';
import { NutritionMacros } from '@/components/food/NutritionChart';

// Meal Type Icons moved from Home
const MEAL_TYPE_LABELS: Record<string, { label: string; icon: string }> = {
    breakfast: { label: '아침', icon: '🌅' },
    lunch: { label: '점심', icon: '☀️' },
    dinner: { label: '저녁', icon: '🌙' },
    snack: { label: '간식', icon: '🍪' },
};

export default function HistoryPage() {
    const { user, isLoading: authLoading } = useAuth();
    const { isLoading: onboardingLoading } = useOnboardingCheck();
    const router = useRouter();

    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [history, setHistory] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    // UI State: 'list' | 'grid'
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

    useEffect(() => {
        if (!user && !authLoading) {
            router.replace('/auth?mode=login');
            return;
        }

        const fetchHistory = async () => {
            if (!user) return;
            setLoading(true);

            // Fetch meals for the day
            const userId = user.id; // useAuth provides 'id'
            // NOTE: The API expects 'user_id' which matches 'anonymous_user_id' in logs if not migrated.
            // If the user upgraded, their ID might be different from the anon ID used in old logs.
            // But for now, let's assume useAuth().user.id is the correct identifier.

            try {
                const historyRes = await fetch(
                    `/api/user/history?user_id=${userId}&start_date=${selectedDate}&end_date=${selectedDate}`
                );
                const historyData = await historyRes.json();
                if (historyData.success) {
                    setHistory(historyData.data);
                }
            } catch (error) {
                console.error("Failed to fetch history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user, authLoading, router, selectedDate]);

    const handleDateChange = (offset: number) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + offset);
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    if (authLoading || onboardingLoading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    식사 기록 📅
                </h1>

                {/* View Toggle */}
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'list'
                            ? 'bg-white dark:bg-slate-600 shadow-sm text-primary-600 dark:text-primary-300'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                        aria-label="List View"
                    >
                        <Bars3Icon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'grid'
                            ? 'bg-white dark:bg-slate-600 shadow-sm text-primary-600 dark:text-primary-300'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                        aria-label="Grid View"
                    >
                        <Squares2X2Icon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Date Navigation */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
                <button
                    onClick={() => handleDateChange(-1)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                    <ChevronLeftIcon className="w-5 h-5 text-slate-600" />
                </button>
                <div className="flex items-center gap-2 font-semibold text-lg text-slate-900 dark:text-white">
                    <CalendarIcon className="w-5 h-5 text-primary-500" />
                    {selectedDate}
                </div>
                <button
                    onClick={() => handleDateChange(1)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                    <ChevronRightIcon className="w-5 h-5 text-slate-600" />
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-500">기록을 불러오는 중...</p>
                </div>
            ) : !history?.meals?.length ? (
                <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    <span className="text-4xl mb-3 block">🍽️</span>
                    <p className="text-slate-500 font-medium">검색된 식사 기록이 없어요</p>
                    <p className="text-sm text-slate-400 mt-1">오늘 맛있는 음식을 드셨나요?</p>
                </div>
            ) : viewMode === 'grid' ? (
                /* View: Grid Mode */
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {history.meals.map((meal: any) => (
                        <div
                            key={meal.id}
                            className="relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group cursor-pointer"
                        >
                            {meal.image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={meal.image_url}
                                    alt="식사 사진"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center w-full h-full text-slate-300 dark:text-slate-600 bg-slate-50">
                                    <span className="text-4xl mb-2">{MEAL_TYPE_LABELS[meal.meal_type]?.icon}</span>
                                </div>
                            )}

                            {/* Overlay Info */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                                <span className="text-white font-bold text-sm truncate">
                                    {MEAL_TYPE_LABELS[meal.meal_type]?.label}
                                </span>
                                <span className="text-white/90 text-xs font-medium">
                                    {meal.total_calories} kcal
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* View: List Mode (Existing) */
                <div className="space-y-4">
                    {history.meals.map((meal: any) => (
                        <div
                            key={meal.id}
                            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <div className="flex items-center">
                                            <span className="text-lg mr-2">
                                                {MEAL_TYPE_LABELS[meal.meal_type]?.icon}
                                            </span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {MEAL_TYPE_LABELS[meal.meal_type]?.label}
                                            </span>
                                        </div>
                                        {/* Secure Image Display */}
                                        {(meal as any).image_url && (
                                            <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 relative group cursor-pointer">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={(meal as any).image_url}
                                                    alt="식사 사진"
                                                    className="w-full h-full object-cover transition-transform hover:scale-105"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                    {meal.total_calories} kcal
                                </span>
                            </div>

                            {/* Foods */}
                            <div className="space-y-2">
                                {meal.foods.map((food: any, idx: number) => (
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
        </div>
    );
}
