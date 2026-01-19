'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24">
            <header className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-10">
                <div className="flex items-center h-14 px-4">
                    <Link href="/mypage" className="p-2 -ml-2">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-lg font-bold ml-2">설정</h1>
                </div>
            </header>

            <main className="pt-20 px-4 space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
                    <h2 className="font-bold mb-4">일반 설정</h2>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-center">
                            <span>테마 설정</span>
                            <span className="text-slate-500">시스템 설정 따름</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>언어</span>
                            <span className="text-slate-500">한국어</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>버전 정보</span>
                            <span className="text-slate-500">v1.2.0 (Beta)</span>
                        </div>
                    </div>
                </div>

                <div className="text-center pt-8">
                    <button className="text-sm text-red-500 font-medium underline">
                        로그아웃
                    </button>
                </div>
            </main>
        </div>
    );
}
