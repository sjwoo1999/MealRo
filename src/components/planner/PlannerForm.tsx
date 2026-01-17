'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingCheck } from '@/hooks/useOnboardingCheck';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/common';
import { SelectedMenu, MealSlot, ReversePlanResult } from '@/types/planner';

import MealSlotPicker from './MealSlotPicker';
import MenuSelector from './MenuSelector';
import RecommendOptionCard from './RecommendOptionCard';
import RecommendLoading from './RecommendLoading';
import NutritionSummary from './NutritionSummary';
import RecommendStatusBanner from './RecommendStatusBanner';

const PlannerForm = () => {
    // 1. Disable redirect for Guest Mode
    const { profile } = useOnboardingCheck({ redirectIfNotOnboarded: false });
    const { session } = useAuthContext();
    const router = useRouter();

    // State
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [slot, setSlot] = useState<MealSlot>('lunch');
    const [selectedMenu, setSelectedMenu] = useState<SelectedMenu | null>(null);
    const [plans, setPlans] = useState<ReversePlanResult[]>([]);
    const [selectedPlanIndex, setSelectedPlanIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);

    // Default Profile for Guests
    const DEFAULT_PROFILE = {
        target_calories: 2000,
        target_protein: 100,
        target_carbs: 250,
        target_fat: 65,
    };

    const effectiveProfile = profile || DEFAULT_PROFILE;

    // Restore Guest Data on Mount
    useEffect(() => {
        const savedData = localStorage.getItem('mealro_guest_data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.plans && parsed.selectedMenu) {
                    setPlans(parsed.plans);
                    setSelectedMenu(parsed.selectedMenu);
                    setStep(3); // Go directly to results

                    // Show simple feedback (Optional: Add Toast later)
                    console.log("📂 Guest data restored!");

                    // Clear after restore to prevent stale data
                    localStorage.removeItem('mealro_guest_data');
                }
            } catch (e) {
                console.error("Failed to restore guest data", e);
                localStorage.removeItem('mealro_guest_data');
            }
        }
    }, []);

    // Handlers
    const handleAnalyze = async () => {
        if (!selectedMenu) return;

        setIsLoading(true);
        setStep(2); // Show loading UI

        try {
            const res = await fetch('/api/planner/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    selectedMenu: selectedMenu,
                    userTargetCalories: effectiveProfile.target_calories,
                    userTargetProtein: effectiveProfile.target_protein,
                    userTargetCarbs: effectiveProfile.target_carbs,
                    userTargetFat: effectiveProfile.target_fat,
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
        // [Guest Logic] Save to LocalStorage and Redirect to Auth
        if (!session) {
            const guestData = {
                plans,
                selectedMenu,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('mealro_guest_data', JSON.stringify(guestData));

            if (confirm('이 식단을 저장하려면 로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?')) {
                router.push('/auth');
            }
            return;
        }

        // [Member Logic] TODO: Call History API
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

                {/* Banner for Context */}
                <RecommendStatusBanner />

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
                        {session ? '이 식단으로 결정하기' : '로그인하고 식단 저장하기'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Banner for Context */}
            <RecommendStatusBanner />

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
