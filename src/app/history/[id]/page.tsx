'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Button, Card, PageShell } from '@/components/common';

type MealFood = {
    food_name?: string;
    serving_size?: string;
    meal_slot?: string;
    nutrition?: {
        calories?: number;
        protein?: number;
        carbohydrates?: number;
        fat?: number;
    };
};

type MealDetail = {
    id: string;
    beta_name?: string;
    meal_type?: string;
    created_at: string;
    total_calories?: number;
    total_protein?: number;
    total_carbs?: number;
    total_fat?: number;
    foods?: MealFood[];
    image_url?: string | null;
    notes?: string | null;
};

const MEAL_TYPE_LABELS: Record<string, string> = {
    breakfast: '아침',
    lunch: '점심',
    dinner: '저녁',
    snack: '간식',
};

export default function HistoryDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const [meal, setMeal] = useState<MealDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/user/history/${params.id}`);
                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.error || '기록을 불러오지 못했습니다.');
                }

                setMeal(result.data.meal);
            } catch (fetchError) {
                console.error(fetchError);
                setError(fetchError instanceof Error ? fetchError.message : '기록을 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        };

        void fetchDetail();
    }, [params.id]);

    const foods = useMemo(() => meal?.foods || [], [meal]);
    const sourceLabel = meal?.notes?.startsWith('planner:') ? '추천 저장' : '사진 기록';

    return (
        <PageShell
            title="기록 상세"
            description="저장된 식사 기록을 다시 확인하는 화면입니다."
            width="narrow"
            actions={(
                <Link href="/history">
                    <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                        목록으로 돌아가기
                    </Button>
                </Link>
            )}
        >
            {loading ? (
                <Card padding="lg" className="border border-black shadow-none">
                    <p className="text-sm text-slate-600">불러오는 중...</p>
                </Card>
            ) : error || !meal ? (
                <Card padding="lg" className="border border-black shadow-none">
                    <p className="text-sm font-semibold text-slate-900">{error || '기록을 찾을 수 없습니다.'}</p>
                </Card>
            ) : (
                <div className="space-y-5">
                    <Card padding="lg">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-black bg-[#f7f7f7] px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                                {meal.beta_name || '테스터'}
                            </span>
                            <span className="rounded-full border border-black bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                                {MEAL_TYPE_LABELS[meal.meal_type || ''] || '식사'}
                            </span>
                            <span className="rounded-full border border-black bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                                {sourceLabel}
                            </span>
                        </div>

                        <h2 className="mt-4 text-2xl font-semibold text-slate-900">
                            {foods[0]?.food_name || '저장된 식사'}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            {new Date(meal.created_at).toLocaleString('ko-KR')}
                        </p>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <InfoTile label="총 칼로리" value={`${Math.round(meal.total_calories || 0)} kcal`} />
                            <InfoTile label="단백질" value={`${Math.round(meal.total_protein || 0)} g`} />
                            <InfoTile label="탄수화물" value={`${Math.round(meal.total_carbs || 0)} g`} />
                            <InfoTile label="지방" value={`${Math.round(meal.total_fat || 0)} g`} />
                        </div>
                    </Card>

                    {meal.image_url && (
                        <Card padding="none" className="overflow-hidden border border-black shadow-none">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={meal.image_url} alt="기록 이미지" className="aspect-[4/3] w-full object-cover" />
                        </Card>
                    )}

                    {!meal.image_url && (
                        <Card padding="lg" className="border border-black shadow-none">
                            <p className="text-sm text-slate-500">이미지 없이 저장된 기록입니다.</p>
                        </Card>
                    )}

                    <Card padding="lg">
                        <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-500">음식 목록</p>
                        <div className="mt-4 space-y-3">
                            {foods.map((food, index) => (
                                <div key={`${food.food_name || 'food'}-${index}`} className="rounded-[20px] border border-black bg-slate-50 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-slate-900">{food.food_name || '음식'}</p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {food.serving_size || food.meal_slot || '기록된 항목'}
                                            </p>
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700">
                                            {Math.round(food.nutrition?.calories || 0)} kcal
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-600">
                                        탄수 {Math.round(food.nutrition?.carbohydrates || 0)}g · 단백질 {Math.round(food.nutrition?.protein || 0)}g · 지방 {Math.round(food.nutrition?.fat || 0)}g
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <Link href="/scan" className="block">
                            <Button fullWidth>다시 기록</Button>
                        </Link>
                        <Link href="/nearby" className="block">
                            <Button variant="outline" fullWidth leftIcon={<MapPin className="h-4 w-4" />}>
                                주변 탐색
                            </Button>
                        </Link>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <Link href="/feed" className="block">
                            <Button variant="outline" fullWidth>
                                전체 기록 보기
                            </Button>
                        </Link>
                        <Link href="/meal" className="block">
                            <Button variant="outline" fullWidth>
                                추천 받기
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </PageShell>
    );
}

function InfoTile({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-[20px] border border-black bg-slate-50 p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
        </div>
    );
}
