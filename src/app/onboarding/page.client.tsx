'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingForm } from '@/components/onboarding';
import { UserProfile } from '@/types/user';
import { useOnboardingContext } from '@/contexts/OnboardingContext';

export default function ClientOnboardingPage() {
    const router = useRouter();
    const { updateProfile } = useOnboardingContext();

    const handleComplete = async (profile: UserProfile) => {
        try {
            await updateProfile(profile);
            router.push('/');
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("프로필 저장 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center pt-8 md:pt-16">
            <div className="w-full max-w-md px-4 mb-8 text-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    환영합니다! 👋
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    건강한 식습관을 위해 몇 가지 질문에 답해주세요.
                </p>
            </div>

            <OnboardingForm onComplete={handleComplete} />
        </div>
    );
}
