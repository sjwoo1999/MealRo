'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Button, Card, DiagnosticCard, PageShell } from '@/components/common';
import { db } from '@/lib/db';

type InsightMeal = {
    id: string;
    beta_name?: string;
    meal_type?: string;
    created_at: string;
    total_calories?: number;
    total_protein?: number;
    total_carbs?: number;
    total_fat?: number;
    foods?: Array<{ food_name?: string }>;
    notes?: string | null;
};

const MEAL_LABELS: Record<string, string> = {
    breakfast: '아침',
    lunch: '점심',
    dinner: '저녁',
    snack: '간식',
};

const MEAL_ORDER = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function InsightsPage() {
    const [meals, setMeals] = useState<InsightMeal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const offlineMeals = useLiveQuery(() => db.meals.toArray(), []);
    const unsyncedMeals = offlineMeals?.filter((meal) => !meal.synced) || [];

    useEffect(() => {
        const fetchInsights = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch('/api/user/history?scope=beta', {
                    cache: 'no-store',
                });
                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.error || '분석 데이터를 불러오지 못했습니다.');
                }

                setMeals(result.data?.meals || []);
            } catch (fetchError) {
                console.error(fetchError);
                setError(fetchError instanceof Error ? fetchError.message : '분석 데이터를 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        };

        void fetchInsights();
    }, []);

    const summary = useMemo(() => {
        const totalRecords = meals.length;
        const totalCalories = meals.reduce((sum, meal) => sum + (meal.total_calories || 0), 0);
        const averageCalories = totalRecords > 0 ? Math.round(totalCalories / totalRecords) : 0;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentMeals = meals.filter((meal) => new Date(meal.created_at) >= sevenDaysAgo);
        const recentCalories = recentMeals.reduce((sum, meal) => sum + (meal.total_calories || 0), 0);

        const mealTypeCounts = MEAL_ORDER.map((key) => {
            const count = meals.filter((meal) => meal.meal_type === key).length;
            return {
                key,
                label: MEAL_LABELS[key],
                count,
                ratio: totalRecords > 0 ? Math.round((count / totalRecords) * 100) : 0,
            };
        });

        const sourceCounts = [
            {
                label: '사진 기록',
                count: meals.filter((meal) => !meal.notes?.startsWith('planner:')).length,
            },
            {
                label: '추천 저장',
                count: meals.filter((meal) => meal.notes?.startsWith('planner:')).length,
            },
        ];

        const byDayMap = new Map<string, number>();
        meals.forEach((meal) => {
            const day = new Date(meal.created_at).toLocaleDateString('ko-KR', {
                month: 'numeric',
                day: 'numeric',
            });
            byDayMap.set(day, (byDayMap.get(day) || 0) + 1);
        });

        const recentDays = Array.from(byDayMap.entries())
            .slice(0, 5)
            .map(([day, count]) => ({ day, count }));

        return {
            totalRecords,
            totalCalories,
            averageCalories,
            recentCount: recentMeals.length,
            recentCalories,
            mealTypeCounts,
            sourceCounts,
            recentDays,
            latestMeals: meals.slice(0, 5),
        };
    }, [meals]);

    return (
        <PageShell
            title="분석"
            description="저장한 기록을 한눈에 볼 수 있어요."
            width="default"
        >
            {loading ? (
                <Card padding="lg" className="border border-black shadow-none">
                    <p className="text-sm text-slate-600">분석 데이터를 불러오는 중...</p>
                </Card>
            ) : error ? (
                <Card padding="lg" className="border border-black shadow-none">
                    <p className="text-sm font-semibold text-slate-900">{error}</p>
                </Card>
            ) : summary.totalRecords === 0 ? (
                <Card padding="lg" className="border border-black shadow-none">
                    <p className="text-sm font-semibold text-slate-900">아직 분석할 기록이 없어요.</p>
                    <p className="mt-2 text-sm text-slate-500">기록을 남기면 여기서 바로 볼 수 있어요.</p>
                    <div className="mt-4">
                        <Link href="/scan">
                            <Button>기록 남기기</Button>
                        </Link>
                    </div>
                </Card>
            ) : (
                <div className="space-y-5">
                    {unsyncedMeals.length > 0 && (
                        <DiagnosticCard
                            label="저장 안내"
                            tone="warning"
                            title="이 기기에만 남아 있는 기록이 있어요"
                            description={`기록 ${unsyncedMeals.length}건이 아직 이 기기에 남아 있어요. 잠시 후 집계에 반영될 수 있습니다.`}
                        />
                    )}

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <MetricCard label="총 기록 수" value={`${summary.totalRecords}개`} />
                        <MetricCard label="총 칼로리" value={`${Math.round(summary.totalCalories).toLocaleString()} kcal`} />
                        <MetricCard label="평균 칼로리" value={`${summary.averageCalories.toLocaleString()} kcal`} />
                        <MetricCard label="최근 7일" value={`${summary.recentCount}개 / ${Math.round(summary.recentCalories).toLocaleString()} kcal`} />
                    </div>

                    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                        <Card padding="lg">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Meal Distribution</p>
                            <h2 className="mt-2 text-xl font-semibold text-slate-900">끼니 분포</h2>
                            <div className="mt-5 space-y-3">
                                {summary.mealTypeCounts.map((item) => (
                                    <div key={item.key} className="rounded-[18px] border border-black bg-slate-50 p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="font-semibold text-slate-900">{item.label}</p>
                                                <p className="mt-1 text-sm text-slate-500">{item.count}개 기록</p>
                                            </div>
                                            <span className="text-sm font-semibold text-slate-900">{item.ratio}%</span>
                                        </div>
                                        <div className="mt-3 h-2 rounded-full bg-white">
                                            <div
                                                className="h-2 rounded-full bg-black"
                                                style={{ width: `${Math.max(item.ratio, item.count > 0 ? 8 : 0)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <div className="space-y-5">
                            <Card padding="lg">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Save Source</p>
                                <h2 className="mt-2 text-xl font-semibold text-slate-900">저장 방식</h2>
                                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                                    {summary.sourceCounts.map((item) => (
                                        <div key={item.label} className="rounded-[18px] border border-black bg-white p-4">
                                            <p className="text-sm text-slate-500">{item.label}</p>
                                            <p className="mt-2 text-lg font-semibold text-slate-900">{item.count}개</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card padding="lg">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Recent Days</p>
                                <h2 className="mt-2 text-xl font-semibold text-slate-900">최근 기록 빈도</h2>
                                <div className="mt-5 space-y-3">
                                    {summary.recentDays.map((item) => (
                                        <div key={item.day} className="flex items-center justify-between rounded-[18px] border border-black bg-slate-50 px-4 py-3">
                                            <p className="font-medium text-slate-900">{item.day}</p>
                                            <span className="text-sm font-semibold text-slate-700">{item.count}개</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>

                    <Card padding="lg">
                        <div className="flex items-end justify-between gap-3">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Latest Records</p>
                                <h2 className="mt-2 text-xl font-semibold text-slate-900">최근 저장된 기록</h2>
                            </div>
                            <Link href="/history">
                                <Button variant="outline" size="sm">보관함 보기</Button>
                            </Link>
                        </div>

                        <div className="mt-5 space-y-3">
                            {summary.latestMeals.map((meal) => {
                                const title = meal.foods?.[0]?.food_name || '저장된 식사';
                                const sourceLabel = meal.notes?.startsWith('planner:') ? '추천 저장' : '사진 기록';

                                return (
                                    <Link
                                        key={meal.id}
                                        href={`/history/${meal.id}`}
                                        className="block rounded-[20px] border border-black bg-slate-50 p-4 transition-colors hover:bg-white"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="font-semibold text-slate-900">{title}</p>
                                                    <span className="rounded-full border border-black bg-white px-2 py-1 text-[11px] font-semibold text-slate-600">
                                                        {sourceLabel}
                                                    </span>
                                                    <span className="rounded-full border border-black bg-white px-2 py-1 text-[11px] font-semibold text-slate-600">
                                                        {MEAL_LABELS[meal.meal_type || ''] || '식사'}
                                                    </span>
                                                </div>
                                                <p className="mt-2 text-sm text-slate-500">
                                                    {new Date(meal.created_at).toLocaleString('ko-KR')}
                                                </p>
                                            </div>
                                            <span className="text-sm font-semibold text-slate-900">
                                                {Math.round(meal.total_calories || 0)} kcal
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            )}
        </PageShell>
    );
}

function MetricCard({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <Card padding="lg" className="border border-black shadow-none">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
        </Card>
    );
}
