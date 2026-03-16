'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import { UserProfile } from '@/types/user';
import ValueProp from './ValueProp';
import SoftQuestion from './SoftQuestion';
import OnboardingForm from './OnboardingForm';

type OnboardingStep = 'value-prop' | 'soft-question' | 'account-creation';

export default function ProgressiveOnboarding() {
    const router = useRouter();
    const { updateProfile } = useOnboardingContext();
    const [step, setStep] = useState<OnboardingStep>('value-prop');
    const [softGoal, setSoftGoal] = useState<string | undefined>();

    const handleNext = (nextStep: OnboardingStep) => {
        setStep(nextStep);
    };

    const handleFinalComplete = async (profile: UserProfile) => {
        try {
            await updateProfile(profile);
            router.push('/scan');
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("프로필 저장 중 오류가 발생했습니다.");
        }
    };

    switch (step) {
        case 'value-prop':
            return <ValueProp onNext={() => handleNext('soft-question')} />;

        case 'soft-question':
            return <SoftQuestion onNext={(goal) => {
                setSoftGoal(goal);
                handleNext('account-creation');
            }} />;

        case 'account-creation':
            return <OnboardingForm prefilledGoal={softGoal} onComplete={handleFinalComplete} />;

        default:
            return null;
    }
}
