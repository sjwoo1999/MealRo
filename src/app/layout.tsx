import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { SnackbarProvider } from '@/components/Snackbar';
import { OnboardingProvider } from '@/contexts/OnboardingContext';

export const metadata: Metadata = {
    title: 'MealRo',
    description: 'AI 기반 식단 관리 솔루션',
    manifest: '/manifest.json',
    keywords: ['끼니 추천', '건강 식단', '영양 정보', '아침', '점심', '저녁'],
    openGraph: {
        title: 'MealRo - 건강한 끼니 추천',
        description: '아침, 점심, 저녁 건강한 끼니를 추천해드립니다.',
        type: 'website',
    },
};

export const viewport: Viewport = {
    themeColor: '#546f52',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    viewportFit: 'cover',
};

import BottomNavigation from '@/components/layout/BottomNavigation';
import SiteFooter from '@/components/layout/SiteFooter';

import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </head>
            <body className="min-h-screen">
                <AuthProvider>
                    <SnackbarProvider>
                        <OnboardingProvider>
                            <div className="flex min-h-screen flex-col pb-24 lg:pb-0">
                                <Header />

                                <main className="flex-1">
                                    {children}
                                </main>

                                <SiteFooter />
                                <BottomNavigation />
                            </div>
                        </OnboardingProvider>
                    </SnackbarProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
