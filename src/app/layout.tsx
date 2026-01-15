import type { Metadata } from 'next';
import '@/styles/globals.css';
import { SnackbarProvider } from '@/components/Snackbar';

export const metadata: Metadata = {
    title: 'MealRo - 건강한 끼니 추천',
    description: '아침, 점심, 저녁 건강한 끼니를 추천해드립니다. 음식군 평균 영양값 기반의 추정치입니다.',
    keywords: ['끼니 추천', '건강 식단', '영양 정보', '아침', '점심', '저녁'],
    openGraph: {
        title: 'MealRo - 건강한 끼니 추천',
        description: '아침, 점심, 저녁 건강한 끼니를 추천해드립니다.',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </head>
            <body className="min-h-screen bg-slate-50 dark:bg-slate-900">
                <SnackbarProvider>
                    <div className="min-h-screen flex flex-col">
                        {/* Header */}
                        <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                            <div className="max-w-2xl mx-auto px-4 py-3">
                                <a
                                    href="/"
                                    className="flex items-center gap-2 text-xl font-bold text-primary-600 dark:text-primary-400"
                                >
                                    <span aria-hidden="true">🍽️</span>
                                    <span>MealRo</span>
                                </a>
                            </div>
                        </header>

                        {/* Main content */}
                        <main className="flex-1">
                            {children}
                        </main>

                        {/* Footer */}
                        <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                            <div className="max-w-2xl mx-auto px-4 py-6">
                                <nav className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                                    <a href="/about" className="hover:text-primary-600">소개</a>
                                    <a href="/disclaimer" className="hover:text-primary-600">면책조항</a>
                                </nav>
                                <p className="text-xs text-slate-400 dark:text-slate-500">
                                    {/* TODO(LEGAL_REVIEW): 면책 문구 법무 검토 필요 */}
                                    본 서비스의 영양 정보는 음식군 평균값 기반 추정치이며, 의료적 조언을 대체하지 않습니다.
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                                    © {new Date().getFullYear()} MealRo. All rights reserved.
                                </p>
                            </div>
                        </footer>
                    </div>
                </SnackbarProvider>
            </body>
        </html>
    );
}
