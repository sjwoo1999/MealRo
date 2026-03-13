'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Clock3, MapPin, RotateCcw, Save, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOnboardingCheck } from '@/hooks/useOnboardingCheck';
import { getAnonymousUserId } from '@/lib/userId';
import { Button, Card, DiagnosticCard, SuccessStateCard } from '@/components/common';
import { MealSlot, ReversePlanResult, SelectedMenu } from '@/types/planner';
import { buildRestaurantDetail, FALLBACK_RESTAURANTS } from '@/lib/restaurants';
import MealSlotPicker from './MealSlotPicker';
import MenuSelector from './MenuSelector';
import RecommendLoading from './RecommendLoading';
import NutritionSummary from './NutritionSummary';
import RecommendOptionCard from './RecommendOptionCard';
import RecommendStatusBanner from './RecommendStatusBanner';

const DEFAULT_PROFILE = {
    target_calories: 2000,
    target_protein: 100,
    target_carbs: 250,
    target_fat: 65,
};

const SLOT_LABELS: Record<MealSlot, string> = {
    breakfast: '아침',
    lunch: '점심',
    dinner: '저녁',
};

const PlannerForm = () => {
    const { profile } = useOnboardingCheck({ redirectIfNotOnboarded: false });
    const router = useRouter();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [slot, setSlot] = useState<MealSlot>('lunch');
    const [selectedMenu, setSelectedMenu] = useState<SelectedMenu | null>(null);
    const [plans, setPlans] = useState<ReversePlanResult[]>([]);
    const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveState, setSaveState] = useState<'idle' | 'success' | 'fallback'>('idle');
    const [saveDiagnostic, setSaveDiagnostic] = useState<string | null>(null);

    const effectiveProfile = profile || DEFAULT_PROFILE;
    const selectedPlan = plans[selectedPlanIndex];
    const exploreCandidates = useMemo(() => {
        if (!selectedPlan) {
            return [];
        }

        const orderByDietType: Record<ReversePlanResult['dietType'], string[]> = {
            balanced: ['rest-2', 'rest-1', 'rest-3'],
            lowCarb: ['rest-1', 'rest-3', 'rest-2'],
            highProtein: ['rest-2', 'rest-1', 'rest-3'],
        };

        return orderByDietType[selectedPlan.dietType]
            .map((id) => FALLBACK_RESTAURANTS.find((restaurant) => restaurant.id === id))
            .filter((restaurant): restaurant is (typeof FALLBACK_RESTAURANTS)[number] => Boolean(restaurant))
            .map((restaurant) => buildRestaurantDetail(restaurant, 'fallback'));
    }, [selectedPlan]);

    useEffect(() => {
        setSelectedMenu((current) => {
            if (!current) {
                return current;
            }

            if (current.mealSlot === slot) {
                return current;
            }

            return { ...current, mealSlot: slot };
        });
    }, [slot]);

    const handleAnalyze = async () => {
        if (!selectedMenu) {
            return;
        }

        setIsLoading(true);
        setStep(2);

        try {
            const response = await fetch('/api/planner/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    selectedMenu,
                    userTargetCalories: effectiveProfile.target_calories,
                    userTargetProtein: effectiveProfile.target_protein,
                    userTargetCarbs: effectiveProfile.target_carbs,
                    userTargetFat: effectiveProfile.target_fat,
                }),
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error('추천 생성에 실패했습니다.');
            }

            setPlans(data.data);
            setSelectedPlanIndex(0);
            setStep(3);
        } catch (error) {
            console.error(error);
            alert('추천 계산 중 오류가 발생했습니다. 다시 시도해주세요.');
            setStep(1);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!selectedMenu || !selectedPlan) {
            return;
        }

        setIsSaving(true);

        try {
            const response = await fetch('/api/planner/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    anonymous_user_id: getAnonymousUserId(),
                    selected_menu: selectedMenu,
                    selected_plan: selectedPlan,
                }),
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.detail ? `${result.error}: ${result.detail}` : (result.error || '추천안 저장에 실패했습니다.'));
            }

            const payload = {
                selectedMenu,
                selectedPlan,
                allPlans: plans,
                savedAt: new Date().toISOString(),
            };
            localStorage.setItem('mealro_planner_result', JSON.stringify(payload));
            setSaveState('success');
            setSaveDiagnostic('추천 저장이 끝났습니다. 전체 목록에는 잠시 후 반영될 수 있습니다.');
        } catch (error) {
            console.error(error);
            const payload = {
                selectedMenu,
                selectedPlan,
                allPlans: plans,
                savedAt: new Date().toISOString(),
            };
            localStorage.setItem('mealro_planner_result', JSON.stringify(payload));
            setSaveState('fallback');
            setSaveDiagnostic(`전체 목록 반영이 늦어질 수 있어 이 기기에 먼저 저장했습니다. 원인: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        setStep(1);
        setPlans([]);
        setSelectedPlanIndex(0);
        setSaveState('idle');
        setSaveDiagnostic(null);
    };

    if (step === 2 && isLoading) {
        return <RecommendLoading mealLabel={SLOT_LABELS[slot]} selectedMenu={selectedMenu?.name} />;
    }

    if (step === 3 && selectedPlan && selectedMenu) {
        return (
            <div className="space-y-5 pb-28 animate-fade-in-up">
                <Card padding="lg">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Step 04</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">추천안이 준비됐습니다</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        기준 메뉴를 바탕으로 남은 끼니 조합을 계산했습니다.
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <InfoTile label="기준 끼니" value={SLOT_LABELS[selectedMenu.mealSlot]} />
                        <InfoTile label="기준 메뉴" value={selectedMenu.name} />
                        <InfoTile label="선택안" value={selectedPlan.dietLabel} />
                    </div>
                </Card>

                <RecommendStatusBanner />

                <Card padding="lg">
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Choose Plan</p>
                            <h3 className="mt-2 text-xl font-semibold text-slate-900">추천안 선택</h3>
                        </div>
                        <span className="rounded-full border border-black px-3 py-1 text-xs font-semibold text-slate-700">
                            {plans.length} options
                        </span>
                    </div>

                    <div className="mt-5 grid gap-4">
                        {plans.map((plan, index) => (
                            <RecommendOptionCard
                                key={plan.dietType}
                                plan={plan}
                                isSelected={index === selectedPlanIndex}
                                onSelect={() => setSelectedPlanIndex(index)}
                            />
                        ))}
                    </div>
                </Card>

                <NutritionSummary current={selectedPlan.dailyTotal} target={selectedPlan.targetTotal} />

                <Card padding="lg">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Selected Flow</p>
                    <div className="mt-4 space-y-3">
                        <FlowRow
                            label={`${SLOT_LABELS[selectedMenu.mealSlot]} 기준`}
                            name={selectedMenu.name}
                            calories={`${selectedMenu.calories} kcal`}
                            active
                        />
                        {selectedPlan.recommendations.map((recommendation) => (
                            <FlowRow
                                key={recommendation.mealSlot}
                                label={SLOT_LABELS[recommendation.mealSlot]}
                                name={recommendation.menu.name}
                                calories={`${recommendation.menu.calories} kcal`}
                            />
                        ))}
                    </div>
                </Card>

                <Card padding="lg">
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Explore Preview</p>
                            <h3 className="mt-2 text-xl font-semibold text-slate-900">추천안과 같이 볼 주변 후보</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                거리, 영업시간, 가격대를 먼저 보고 탐색으로 넘어갈 수 있습니다.
                            </p>
                        </div>
                        <Link href="/nearby" className="hidden sm:block">
                            <Button variant="outline" size="sm">
                                전체 탐색 보기
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-5 space-y-3">
                        {exploreCandidates.map((candidate) => (
                            <div key={candidate.id} className="rounded-[20px] border border-black bg-slate-50 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-semibold text-slate-900">{candidate.name}</p>
                                            <span className="rounded-full border border-black bg-white px-2 py-1 text-[11px] font-semibold text-slate-600">
                                                {candidate.category || '음식점'}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-slate-500">{candidate.recommendationReason}</p>
                                    </div>
                                    <span className="shrink-0 rounded-full border border-black bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                                        {candidate.distance !== undefined ? `${candidate.distance.toFixed(1)}km` : '근처'}
                                    </span>
                                </div>

                                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                                    <PreviewMeta
                                        icon={<Clock3 className="h-4 w-4" />}
                                        label="영업시간"
                                        value={candidate.openingHours}
                                    />
                                    <PreviewMeta
                                        icon={<Wallet className="h-4 w-4" />}
                                        label="가격대"
                                        value={candidate.priceBand}
                                    />
                                    <PreviewMeta
                                        icon={<MapPin className="h-4 w-4" />}
                                        label="이동"
                                        value={`${candidate.etaMinutes || 7}분`}
                                    />
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {candidate.menuHighlights.slice(0, 2).map((menu) => (
                                        <span
                                            key={menu.name}
                                            className="rounded-full border border-black bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                                        >
                                            {menu.name} · {menu.calories}kcal
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-4">
                                    <Link href={`/nearby/${candidate.id}`}>
                                        <Button variant="outline" size="sm">
                                            상세 보기
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 sm:hidden">
                        <Link href="/nearby" className="block">
                            <Button variant="outline" fullWidth>
                                전체 탐색 보기
                            </Button>
                        </Link>
                    </div>
                </Card>

                {saveState !== 'idle' && (
                    <>
                        <SuccessStateCard
                            tone={saveState === 'success' ? 'success' : 'muted'}
                            title={saveState === 'success' ? '추천이 저장되었습니다' : '이 기기에 추천을 남겼습니다'}
                            description={saveState === 'success'
                                ? '이제 기록을 확인하거나 다음 단계로 넘어가면 됩니다.'
                                : '인터넷 상태에 따라 전체 목록 반영이 늦을 수 있어, 우선 이 기기에 추천을 남겨뒀습니다.'}
                        />
                        {saveDiagnostic && (
                            <DiagnosticCard
                                label="저장 상태"
                                tone={saveState === 'success' ? 'info' : 'warning'}
                                title={saveState === 'success' ? '전체 목록 반영 안내' : '저장 안내'}
                                description={saveDiagnostic}
                            />
                        )}
                    </>
                )}

                <div className="grid gap-3 sm:grid-cols-3">
                    <Button variant="outline" onClick={handleReset} leftIcon={<RotateCcw className="h-4 w-4" />}>
                        다시 계산
                    </Button>
                    <Button variant="outline" onClick={handleSave} leftIcon={<Save className="h-4 w-4" />} loading={isSaving}>
                        저장하기
                    </Button>
                    <Button onClick={() => router.push('/nearby')} rightIcon={<MapPin className="h-4 w-4" />}>
                        주변 탐색
                    </Button>
                </div>

                {saveState === 'success' && (
                    <div className="grid gap-3 sm:grid-cols-2">
                        <Link href="/feed" className="block">
                            <Button fullWidth>전체 기록 보기</Button>
                        </Link>
                        <Link href="/history" className="block">
                            <Button variant="outline" fullWidth>
                                보관함 보기
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-5 animate-fade-in-up">
            <RecommendStatusBanner />

            <Card padding="lg">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Step 01</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">기준 끼니를 고르세요</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                    한 끼를 기준으로 나머지 식사를 다시 계산합니다.
                </p>

                <div className="mt-5">
                    <MealSlotPicker value={slot} onChange={setSlot} />
                </div>
            </Card>

            <Card padding="lg">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Step 02</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">기준 메뉴를 검색하세요</h3>

                <div className="mt-5">
                    <MenuSelector currentSlot={slot} onSelect={setSelectedMenu} />
                </div>

                {selectedMenu && (
                    <div className="mt-5 rounded-[20px] border border-black bg-slate-50 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Current Meal
                        </p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">{selectedMenu.name}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                            <span className="rounded-full border border-black px-3 py-1">{SLOT_LABELS[slot]}</span>
                            <span className="rounded-full border border-black px-3 py-1">{selectedMenu.calories} kcal</span>
                            <span className="rounded-full border border-black px-3 py-1">탄수 {selectedMenu.carbs}g</span>
                            <span className="rounded-full border border-black px-3 py-1">단백질 {selectedMenu.protein}g</span>
                            <span className="rounded-full border border-black px-3 py-1">지방 {selectedMenu.fat}g</span>
                        </div>
                    </div>
                )}
            </Card>

            <Card padding="lg">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Step 03</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">추천 계산</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                    온보딩 정보가 있으면 개인 값으로, 없으면 기본 기준값으로 계산합니다.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <InfoTile label="목표 칼로리" value={`${effectiveProfile.target_calories} kcal`} />
                    <InfoTile label="목표 단백질" value={`${effectiveProfile.target_protein} g`} />
                    <InfoTile label="목표 탄수화물" value={`${effectiveProfile.target_carbs} g`} />
                    <InfoTile label="목표 지방" value={`${effectiveProfile.target_fat} g`} />
                </div>

                <div className="mt-5">
                    <Button fullWidth size="lg" disabled={!selectedMenu} onClick={handleAnalyze} rightIcon={<ChevronRight className="h-4 w-4" />}>
                        추천 계산하기
                    </Button>
                </div>
            </Card>
        </div>
    );
};

function InfoTile({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
            <p className="text-sm text-copy-subtle">{label}</p>
            <p className="mt-2 text-base font-semibold text-copy">{value}</p>
        </div>
    );
}

function FlowRow({
    label,
    name,
    calories,
    active = false,
}: {
    label: string;
    name: string;
    calories: string;
    active?: boolean;
}) {
    return (
        <div className={`rounded-2xl border p-4 transition-colors ${active ? 'border-accent bg-accent text-white shadow-md' : 'border-line-strong bg-surface text-copy hover:border-accent'}`}>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${active ? 'text-white/80' : 'text-copy-subtle'}`}>
                        {label}
                    </p>
                    <p className="mt-2 font-semibold">{name}</p>
                </div>
                <span className={`text-sm font-semibold ${active ? 'text-white/90' : 'text-copy-muted'}`}>{calories}</span>
            </div>
        </div>
    );
}

function PreviewMeta({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-line bg-surface px-3 py-3 shadow-sm">
            <div className="flex items-center gap-2 text-copy-subtle">
                {icon}
                <span className="text-xs font-medium">{label}</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-copy">{value}</p>
        </div>
    );
}

export default PlannerForm;
