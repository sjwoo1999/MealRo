import { Metadata } from 'next';
import ClientOnboardingPage from './page.client';

export const metadata: Metadata = {
    title: '시작하기 - MealRo',
    description: '맞춤 영양 목표를 설정하고 건강한 식습관을 시작하세요',
};

export default function OnboardingPage() {
    return <ClientOnboardingPage />;
}
