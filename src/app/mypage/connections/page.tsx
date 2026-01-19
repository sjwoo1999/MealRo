'use client';

import Link from 'next/link';
import { ChevronLeft, Smartphone, Watch } from 'lucide-react';
import { Card } from '@/components/common/Card';

export default function ConnectionsPage() {
    const apps = [
        { id: 'samsung', name: 'Samsung Health', icon: '🏃', connected: false },
        { id: 'apple', name: 'Apple Health', icon: '🍎', connected: true },
        { id: 'google', name: 'Google Fit', icon: '🏋️', connected: false },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24">
            <header className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-10">
                <div className="flex items-center h-14 px-4">
                    <Link href="/mypage" className="p-2 -ml-2">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-lg font-bold ml-2">기기 연동</h1>
                </div>
            </header>

            <main className="pt-20 px-4 space-y-6">
                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl flex items-start gap-3">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                        <Smartphone className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-400">데이터 자동 동기화</h3>
                        <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-1">
                            건강 앱을 연결하면 걸음 수, 소모 칼로리, 체중 데이터를 자동으로 불러옵니다.
                        </p>
                    </div>
                </div>

                <section className="space-y-3">
                    {apps.map((app) => (
                        <Card key={app.id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{app.icon}</span>
                                <div>
                                    <p className="font-medium">{app.name}</p>
                                    <p className="text-xs text-slate-500">
                                        {app.connected ? '동기화 중' : '연결되지 않음'}
                                    </p>
                                </div>
                            </div>
                            <button
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${app.connected
                                        ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                                    }`}
                            >
                                {app.connected ? '해제' : '연결'}
                            </button>
                        </Card>
                    ))}
                </section>
            </main>
        </div>
    );
}
