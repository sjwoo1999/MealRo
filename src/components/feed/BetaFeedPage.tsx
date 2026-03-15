'use client';

import Link from 'next/link';
import { Camera, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Button, Card, DiagnosticCard, PageShell } from '@/components/common';
import { db } from '@/lib/db';

type FeedMeal = {
    id: string;
    beta_name?: string;
    meal_type?: string;
    created_at: string;
    total_calories: number;
    total_protein?: number;
    total_carbs?: number;
    total_fat?: number;
    foods?: Array<{ food_name?: string }>;
    image_url?: string | null;
    notes?: string | null;
};

type OfflineFood = {
    food_name?: string;
    nutrition?: {
        calories?: number;
        protein?: number;
        carbohydrates?: number;
        fat?: number;
    };
};

const MEAL_TYPE_LABELS: Record<string, string> = {
    breakfast: '아침',
    lunch: '점심',
    dinner: '저녁',
    snack: '간식',
};

interface BetaFeedPageProps {
    title?: string;
    description?: string;
    label?: string;
    mode?: 'feed' | 'history';
}

export default function BetaFeedPage({
    title = '공개 기록',
    description = '최근 기록을 바로 볼 수 있어요.',
    label = '기록',
    mode = 'feed',
}: BetaFeedPageProps) {
    const [meals, setMeals] = useState<FeedMeal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const offlineMeals = useLiveQuery(() => db.meals.toArray(), []);
    const unsyncedMeals = offlineMeals?.filter((meal) => !meal.synced) || [];
    const syncedLocalMeals = offlineMeals?.filter((meal) => meal.synced) || [];

    const fetchFeed = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/user/history?scope=beta', {
                cache: 'no-store',
            });
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || '피드를 불러오지 못했습니다.');
            }

            setMeals(result.data?.meals || []);
        } catch (fetchError) {
            console.error(fetchError);
            setError(fetchError instanceof Error ? fetchError.message : '피드를 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchFeed();
    }, []);

    const mergedMeals = mergeMealsWithLocalCache(meals, syncedLocalMeals);
    const totalCalories = mergedMeals.reduce((sum, meal) => sum + (meal.total_calories || 0), 0);
    const photoCount = mergedMeals.filter((meal) => !meal.notes?.startsWith('planner:')).length;
    const plannerCount = mergedMeals.filter((meal) => meal.notes?.startsWith('planner:')).length;
    const latestDate = mergedMeals[0]?.created_at
        ? new Date(mergedMeals[0].created_at).toLocaleString('ko-KR')
        : '-';

    const pageTitle = mode === 'history' ? title || '기록 보관함' : title;
    const pageDescription =
        mode === 'history'
            ? description || '저장한 기록을 다시 볼 수 있어요.'
            : description;
    const pageLabel = mode === 'history' ? label || '보관함' : label;

    return (
        <PageShell width="narrow" className="py-6">
            <div className="space-y-5">
                <Card padding="lg">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{pageLabel}</p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                                {pageTitle}
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                {pageDescription}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => void fetchFeed()}
                            className="rounded-full border border-black p-3 text-slate-900"
                            aria-label="새로고침"
                        >
                            <RefreshCcw className="h-4 w-4" />
                        </button>
                    </div>
                </Card>

                {!loading && unsyncedMeals.length > 0 && (
                    <DiagnosticCard
                        label="저장 안내"
                        tone="warning"
                        title="아직 이 기기에서만 보이는 기록이 있어요"
                        description={`기록 ${unsyncedMeals.length}건이 아직 이 기기에 남아 있어요. 잠시 후 전체 목록에 반영될 수 있습니다.`}
                    />
                )}

                {!loading && unsyncedMeals.length === 0 && syncedLocalMeals.length > 0 && (
                    <DiagnosticCard
                        label="기기 저장"
                        tone="info"
                        title="이 기기에 최근 기록이 남아 있어요"
                        description={`최근 기록 ${syncedLocalMeals.length}건이 이 기기에 함께 저장되어 있어요. 방금 저장한 기록이 먼저 보일 수 있습니다.`}
                    />
                )}

                {!loading && !error && mergedMeals.length > 0 && mode === 'history' && (
                    <div className="grid gap-3 sm:grid-cols-2">
                        <MiniSummaryCard label="총 기록" value={`${mergedMeals.length}개`} />
                        <MiniSummaryCard label="총 칼로리" value={`${Math.round(totalCalories).toLocaleString()} kcal`} />
                        <MiniSummaryCard label="최근 기록" value={latestDate} />
                        <MiniSummaryCard label="추천 저장" value={`${plannerCount}개`} />
                    </div>
                )}

                {!loading && !error && mergedMeals.length > 0 && mode === 'feed' && (
                    <Card padding="lg" className="border border-black shadow-none">
                        <div className="grid gap-3 sm:grid-cols-3">
                            <MiniSummaryCard label="지금 공개된 기록" value={`${mergedMeals.length}개`} inset />
                            <MiniSummaryCard label="최근 업데이트" value={latestDate} inset />
                            <MiniSummaryCard label="누적 칼로리" value={`${Math.round(totalCalories).toLocaleString()} kcal`} inset />
                        </div>
                    </Card>
                )}

                {loading ? (
                    <Card padding="lg" className="border border-black shadow-none">
                        <p className="text-sm text-slate-600">불러오는 중...</p>
                    </Card>
                ) : error ? (
                    <Card padding="lg" className="border border-black shadow-none">
                        <p className="text-sm font-semibold text-slate-900">{error}</p>
                    </Card>
                ) : mergedMeals.length === 0 ? (
                    <div className="space-y-3">
                        <Card padding="lg" className="border border-black shadow-none">
                            <p className="text-sm font-semibold text-slate-900">아직 올라온 기록이 없어요.</p>
                            <div className="mt-4">
                                <Link href="/scan">
                                    <Button
                                        size="lg"
                                        className="w-full border border-black bg-black text-white shadow-none"
                                        leftIcon={<Camera className="h-4 w-4" />}
                                    >
                                        첫 기록 올리기
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                        {unsyncedMeals.length > 0 && (
                            <DiagnosticCard
                                label="안내"
                                tone="warning"
                                title="이 기기에는 최근 기록이 남아 있어요"
                                description="방금 저장한 기록이 바로 안 보여도, 잠시 후 다시 보면 반영될 수 있어요."
                            />
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {mergedMeals.map((meal) => {
                            const isLocalCachedMeal = meal.id.startsWith('local-');
                            const primaryFood = meal.foods?.[0]?.food_name || '저장된 식사';
                            const extraCount = meal.foods && meal.foods.length > 1 ? meal.foods.length - 1 : 0;
                            const mealType = meal.meal_type ? MEAL_TYPE_LABELS[meal.meal_type] || meal.meal_type : null;
                            const sourceLabel = isLocalCachedMeal
                                ? '이 기기 기록'
                                : meal.notes?.startsWith('planner:') ? '추천 저장' : '사진 기록';

                            if (mode === 'history') {
                                return (
                                    <CompactHistoryCard
                                        key={meal.id}
                                        meal={meal}
                                        primaryFood={primaryFood}
                                        extraCount={extraCount}
                                        mealType={mealType}
                                        isLocal={isLocalCachedMeal}
                                    />
                                );
                            }

                            return (
                                <Card key={meal.id} padding="lg" className="border border-black shadow-none">
                                    <div className="flex items-start gap-4">
                                        {meal.image_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={meal.image_url}
                                                alt={primaryFood}
                                                className="h-24 w-24 shrink-0 rounded-[20px] border border-black object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[20px] border border-black bg-slate-50 text-xs font-semibold text-slate-500">
                                                {sourceLabel}
                                            </div>
                                        )}

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {isLocalCachedMeal ? (
                                                        <span className="rounded-full border border-black bg-black px-2.5 py-1 text-[11px] font-semibold text-white">
                                                            방금 저장
                                                        </span>
                                                    ) : (
                                                        <span className="rounded-full border border-black bg-[#f7f7f7] px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                                                            {meal.beta_name || '테스터'}
                                                        </span>
                                                    )}
                                                    {mealType && (
                                                        <span className="rounded-full border border-black bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                                                            {mealType}
                                                        </span>
                                                    )}
                                                    <span className="rounded-full border border-black bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                                                        {sourceLabel}
                                                    </span>
                                                </div>
                                                <div className="shrink-0 text-right">
                                                    <p className="text-lg font-semibold text-slate-900">
                                                        {Math.round(meal.total_calories || 0)}
                                                    </p>
                                                    <p className="text-xs text-slate-500">kcal</p>
                                                </div>
                                            </div>
                                            <p className="mt-3 text-base font-semibold text-slate-900">
                                                {extraCount > 0 ? `${primaryFood} 외 ${extraCount}개` : primaryFood}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {new Date(meal.created_at).toLocaleString('ko-KR')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 rounded-[18px] border border-black bg-slate-50 p-4">
                                        <p className="text-sm text-slate-600">
                                            탄수 {Math.round(meal.total_carbs || 0)}g · 단백질 {Math.round(meal.total_protein || 0)}g · 지방 {Math.round(meal.total_fat || 0)}g
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        {isLocalCachedMeal ? (
                                            <Button variant="outline" size="sm" className="border-black bg-white text-slate-500" disabled>
                                                곧 전체 목록에 반영돼요
                                            </Button>
                                        ) : (
                                            <Link href={`/history/${meal.id}`}>
                                                <Button variant="outline" size="sm" className="border-black bg-white">
                                                    자세히 보기
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </PageShell>
    );
}

function mergeMealsWithLocalCache(meals: FeedMeal[], syncedLocalMeals: Array<{
    id?: number;
    name: string;
    calories: number;
    timestamp: Date;
    food_data?: unknown;
}>): FeedMeal[] {
    const localMeals = syncedLocalMeals
        .map((meal) => toFeedMealFromLocal(meal))
        .filter((meal): meal is FeedMeal => Boolean(meal));

    const localOnlyMeals = localMeals.filter((localMeal) => {
        return !meals.some((serverMeal) => isSameMeal(serverMeal, localMeal));
    });

    return [...localOnlyMeals, ...meals].sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
}

function toFeedMealFromLocal(meal: {
    id?: number;
    name: string;
    calories: number;
    timestamp: Date;
    food_data?: unknown;
}): FeedMeal | null {
    const data = meal.food_data as
        | { foods?: OfflineFood[]; nutrition?: OfflineFood['nutrition']; food_name?: string }
        | undefined;

    const foods = Array.isArray(data?.foods)
        ? data.foods
        : [{ food_name: data?.food_name || meal.name, nutrition: data?.nutrition }];

    const totalProtein = foods.reduce((sum, food) => sum + (food.nutrition?.protein || 0), 0);
    const totalCarbs = foods.reduce((sum, food) => sum + (food.nutrition?.carbohydrates || 0), 0);
    const totalFat = foods.reduce((sum, food) => sum + (food.nutrition?.fat || 0), 0);

    const createdAt = new Date(meal.timestamp).toISOString();
    if (Number.isNaN(new Date(createdAt).getTime())) {
        return null;
    }

    return {
        id: `local-${meal.id ?? createdAt}`,
        beta_name: '방금 저장',
        meal_type: inferMealTypeFromDate(meal.timestamp),
        created_at: createdAt,
        total_calories: meal.calories,
        total_protein: totalProtein,
        total_carbs: totalCarbs,
        total_fat: totalFat,
        foods: foods.map((food) => ({ food_name: food.food_name || meal.name })),
        image_url: null,
        notes: 'local-cache',
    };
}

function isSameMeal(serverMeal: FeedMeal, localMeal: FeedMeal): boolean {
    const serverPrimary = serverMeal.foods?.[0]?.food_name || '';
    const localPrimary = localMeal.foods?.[0]?.food_name || '';
    const samePrimary = serverPrimary === localPrimary;
    const sameCalories = Math.abs((serverMeal.total_calories || 0) - (localMeal.total_calories || 0)) <= 10;
    const timeDiff = Math.abs(new Date(serverMeal.created_at).getTime() - new Date(localMeal.created_at).getTime());

    return samePrimary && sameCalories && timeDiff <= 15 * 60 * 1000;
}

function inferMealTypeFromDate(date: Date): string {
    const hour = date.getHours();

    if (hour >= 5 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 15) return 'lunch';
    if (hour >= 15 && hour < 21) return 'dinner';
    return 'snack';
}

const MEAL_TYPE_EMOJI: Record<string, string> = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
    snack: '🍎',
};

function CompactHistoryCard({
    meal,
    primaryFood,
    extraCount,
    mealType,
    isLocal,
}: {
    meal: FeedMeal;
    primaryFood: string;
    extraCount: number;
    mealType: string | null;
    isLocal: boolean;
}) {
    const time = new Date(meal.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    const foodLabel = extraCount > 0 ? `${primaryFood} 외 ${extraCount}개` : primaryFood;

    return (
        <div className="flex items-center gap-3 rounded-[18px] border border-black bg-white px-4 py-3">
            {meal.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={meal.image_url}
                    alt={primaryFood}
                    className="h-10 w-10 shrink-0 rounded-[10px] border border-black object-cover"
                />
            ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-black bg-slate-50 text-lg">
                    {MEAL_TYPE_EMOJI[meal.meal_type || ''] || '🍽️'}
                </div>
            )}

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">{foodLabel}</p>
                    <p className="shrink-0 text-sm font-semibold text-slate-900">
                        {Math.round(meal.total_calories || 0)} kcal
                    </p>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                    탄수 {Math.round(meal.total_carbs || 0)}g · 단백 {Math.round(meal.total_protein || 0)}g · 지방 {Math.round(meal.total_fat || 0)}g
                </p>
                <div className="mt-1 flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                        {mealType && `${mealType} · `}{time}
                    </p>
                    {isLocal ? (
                        <span className="text-xs text-slate-400">반영 중</span>
                    ) : (
                        <Link href={`/history/${meal.id}`} className="text-xs font-medium text-slate-700 hover:underline">
                            →
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

function MiniStat({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-[16px] border border-black bg-slate-50 px-3 py-2">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
        </div>
    );
}

function MiniSummaryCard({
    label,
    value,
    inset = false,
}: {
    label: string;
    value: string;
    inset?: boolean;
}) {
    return (
        <div className={`rounded-[18px] border border-black p-4 ${inset ? 'bg-slate-50' : 'bg-white'}`}>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
        </div>
    );
}
