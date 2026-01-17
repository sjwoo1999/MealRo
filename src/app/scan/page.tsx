import { Metadata } from 'next';
import FoodScanner from '@/components/FoodScanner';
import Link from 'next/link';

export const metadata: Metadata = {
    title: '음식 스캔 - MealRo',
    description: 'AI로 음식 사진을 분석하고 영양 정보를 확인하세요',
};

export default function ScanPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
            <div className="max-w-md mx-auto px-4 py-6">
                {/* Header */}
                <header className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mb-4"
                    >
                        ← 홈으로
                    </Link>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            📸 음식 스캔
                        </h1>
                        <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300 rounded-full border border-violet-200 dark:border-violet-800">
                            Powered by Gen AI
                        </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                        AI가 음식 사진을 분석하여 영양 정보를 알려드려요
                    </p>
                </header>

                {/* Scanner Component */}
                <FoodScanner />

                {/* Info */}
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h3 className="font-medium text-blue-900 dark:text-blue-300 flex items-center gap-2">
                        <span>💡</span> 사용 팁
                    </h3>
                    <ul className="mt-2 text-sm text-blue-700 dark:text-blue-400 space-y-1">
                        <li>• 음식이 잘 보이도록 밝은 곳에서 촬영하세요</li>
                        <li>• 여러 음식이 있으면 모두 인식됩니다</li>
                        <li>• 영양 정보는 추정치이며 실제와 다를 수 있습니다</li>
                    </ul>
                </div>

                {/* Privacy Notice */}
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <h3 className="font-medium text-green-900 dark:text-green-300 flex items-center gap-2">
                        <span>🔒</span> 개인정보 보호
                    </h3>
                    <p className="mt-2 text-sm text-green-700 dark:text-green-400">
                        업로드한 이미지는 <strong>서비스 품질 향상 및 데이터셋 구축</strong>을 위해 안전하게 저장될 수 있습니다.
                    </p>
                </div>

                {/* Disclaimer */}
                <p className="mt-6 text-xs text-slate-400 dark:text-slate-500 text-center leading-relaxed">
                    * 본 결과는 <strong>생성형 인공지능</strong>에 의해 생성되었으며, 실제와 다를 수 있습니다.
                    <br />
                    정확한 영양 정보는 제품 라벨을 확인하세요.
                </p>
            </div>
        </main>
    );
}
