'use client';

import React, { useState, useEffect } from 'react';
import {
    OnboardingFormData,
    UserProfile,
    OnboardingStep,
    TdeeCalculationResult
} from '@/types/user';
import { calculateAll } from '@/lib/tdee-calculator';
import { validateOnboardingForm } from '@/lib/validators/onboarding';
import { Button } from '@/components/common';

import StepIndicator from './StepIndicator';
import StepBasicInfo from './StepBasicInfo';
import StepBodyInfo from './StepBodyInfo';
import StepActivityLevel from './StepActivityLevel';
import StepGoal from './StepGoal';
import TdeeResult from './TdeeResult';

interface OnboardingFormProps {
    onComplete: (profile: UserProfile) => void;
}

const INITIAL_DATA: Partial<OnboardingFormData> = {
    gender: 'male',
    age: 25,
    height: 175,
    weight: 70,
};

const OnboardingForm = ({ onComplete }: OnboardingFormProps) => {
    // State
    const [step, setStep] = useState<OnboardingStep>(1);
    const [formData, setFormData] = useState<Partial<OnboardingFormData>>(INITIAL_DATA);
    const [result, setResult] = useState<TdeeCalculationResult | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Helpers
    const updateData = (data: Partial<OnboardingFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
        // Clear errors for updated fields
        const newErrors = { ...errors };
        Object.keys(data).forEach(key => delete newErrors[key]);
        setErrors(newErrors);
    };

    const handleNext = () => {
        const validation = validateOnboardingForm(formData);
        let stepIsValid = true;
        const currentErrors: Record<string, string> = {};

        // Validations per step
        if (step === 1) {
            if (!formData.gender) { currentErrors.gender = '성별을 선택해주세요'; stepIsValid = false; }
            if (!formData.age) { currentErrors.age = '나이를 입력해주세요'; stepIsValid = false; }
        } else if (step === 2) {
            if (!formData.height) { currentErrors.height = '키를 입력해주세요'; stepIsValid = false; }
            if (!formData.weight) { currentErrors.weight = '몸무게를 입력해주세요'; stepIsValid = false; }
        } else if (step === 3) {
            if (!formData.activity_level) { currentErrors.activityLevel = '활동량을 선택해주세요'; stepIsValid = false; }
        } else if (step === 4) {
            if (!formData.goal) { currentErrors.goal = '목표를 선택해주세요'; stepIsValid = false; }
        }

        if (!stepIsValid) {
            setErrors(currentErrors);
            return;
        }

        if (step === 4) {
            // Calculate and show result
            const calculated = calculateAll(formData as OnboardingFormData);
            setResult(calculated);
            setStep('complete');
        } else {
            setStep((prev) => (typeof prev === 'number' ? (prev + 1) as OnboardingStep : prev));
        }
    };

    const handleBack = () => {
        if (step === 'complete') {
            setStep(4);
            setResult(null);
        } else if (step > 1) {
            setStep((prev) => (typeof prev === 'number' ? (prev - 1) as OnboardingStep : prev));
        }
    };

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Construct UserProfile object (mock ID/timestamps for client callback)
            // The real saving happens in the page/API handler passed via onComplete
            // But we can just pass the formData and let the parent handle the API call
            // Or we assume onComplete takes the full profile.

            // Let's assume the parent handles the API call using the form data.
            // But the type signature says UserProfile.
            // We'll construct a temporary one.
            const profile: any = {
                ...formData,
                ...result,
                onboarding_completed: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            await onComplete(profile);
        } catch (error) {
            console.error('Onboarding failed', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render Actions
    const renderActions = () => {
        if (step === 'complete') return null;

        return (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center max-w-md mx-auto w-full md:relative md:border-none md:p-0 md:mt-8">
                {step > 1 ? (
                    <Button variant="ghost" onClick={handleBack} disabled={isSubmitting}>
                        이전
                    </Button>
                ) : (
                    <div></div> // Spacer
                )}

                <Button onClick={handleNext} disabled={isSubmitting} className="min-w-[120px]">
                    {step === 4 ? '결과 보기' : '다음'}
                </Button>
            </div>
        );
    };

    // Render Step Content
    const renderContent = () => {
        switch (step) {
            case 1:
                return <StepBasicInfo data={formData} onChange={updateData} errors={errors} />;
            case 2:
                return <StepBodyInfo data={formData} onChange={updateData} errors={errors} />;
            case 3:
                return <StepActivityLevel value={formData.activity_level} onChange={(val) => updateData({ activity_level: val })} error={errors.activityLevel} />;
            case 4:
                return <StepGoal value={formData.goal} onChange={(val) => updateData({ goal: val })} error={errors.goal} />;
            case 'complete':
                if (!result) return null;
                return (
                    <TdeeResult
                        result={result}
                        userInfo={formData as any}
                        onConfirm={handleFinalSubmit}
                        onBack={handleBack}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 pb-24 md:pb-4">
            {typeof step === 'number' && (
                <StepIndicator currentStep={step} totalSteps={4} />
            )}

            <div className="min-h-[400px]">
                {renderContent()}
            </div>

            {renderActions()}
        </div>
    );
};

export default OnboardingForm;
