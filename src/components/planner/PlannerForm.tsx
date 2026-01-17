'use client';

import React, { useState } from 'react';
import { useOnboardingCheck } from '@/hooks/useOnboardingCheck';
import { Button } from '@/components/common';
import { SelectedMenu, MealSlot, ReversePlanResult } from '@/types/planner';

import MealSlotPicker from './MealSlotPicker';
import MenuSelector from './MenuSelector';
import RecommendOptionCard from './RecommendOptionCard';
import RecommendLoading from './RecommendLoading';
import NutritionSummary from './NutritionSummary';

const PlannerForm = () => {
    const { profile } = useOnboardingCheck({ redirectIfNotOnboarded: true });

    // State
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [slot, setSlot] = useState<MealSlot>('lunch');
    const [selectedMenu, setSelectedMenu] = useState<SelectedMenu | null>(null);
    const [plans, setPlans] = useState<ReversePlanResult[]>([]);
    const [selectedPlanIndex, setSelectedPlanIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);

    // Handlers
    const handleAnalyze = async () => {
        if (!selectedMenu || !profile) return;

        setIsLoading(true);
        setStep(2); // Show loading UI

        try {
            const res = await fetch('/api/planner/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    selectedMenu: selectedMenu,
                    userTargetCalories: profile.target_calories,
                    userTargetProtein: profile.target_protein,
                    userTargetCarbs: profile.target_carbs,
                    userTargetFat: profile.target_fat,
                })
            });
            const data = await res.json();

            if (data.success) {
                setPlans(data.data);
                setStep(3); // Show results
            } else {
                alert('분석에 실패했습니다. 다시 시도해주세요.');
                setStep(1);
            }
        } catch (e) {
            console.error(e);
            alert('오류가 발생했습니다.');
            setStep(1);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        // TODO: Save to history API
        alert("식단이 저장되었습니다! (History API 호출 예정)");
    };

    if (step === 2 && isLoading) {
        return <RecommendLoading />;
    }

    if (step === 3 && plans.length > 0) {
        const selectedPlan = plans[selectedPlanIndex];
        return (
            <div className="space-y-6 animate-fade-in-up pb-20">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">추천 식단</h2>
                    <Button variant="ghost" size="sm" onClick={() => setStep(1)}>다시 하기</Button>
                </div>

                <NutritionSummary
                    current={selectedPlan.dailyTotal}
                    target={selectedPlan.targetTotal}
                />

                <div className="space-y-4">
                    {plans.map((plan, idx) => (
                        <RecommendOptionCard
                            key={plan.dietType}
                            plan={plan}
                            isSelected={idx === selectedPlanIndex}
                            onSelect={() => setSelectedPlanIndex(idx)}
                        />
                    ))}
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex max-w-md mx-auto">
                    <Button fullWidth onClick={handleSave}>
                        이 식단으로 결정하기
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                    어떤 끼니를 드실 예정인가요?
                </label>
                <MealSlotPicker value={slot} onChange={setSlot} />
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                    메뉴를 선택해주세요
                </label>
                <MenuSelector currentSlot={slot} onSelect={setSelectedMenu} />
            </div>

            <Button
                fullWidth
                size="lg"
                disabled={!selectedMenu}
                onClick={handleAnalyze}
            >
                나머지 식단 추천받기
            </Button>
        </div>
    );
};

export default PlannerForm;
