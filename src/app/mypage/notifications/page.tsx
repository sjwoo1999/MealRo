'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Bell } from 'lucide-react';
import ToggleSwitch from '@/components/ui/ToggleSwitch';

export default function NotificationsPage() {
    const [settings, setSettings] = useState({
        mealReminder: true,
        waterReminder: false,
        weeklyReport: true,
        marketing: false,
    });

    const toggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24">
            <header className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-10">
                <div className="flex items-center h-14 px-4">
                    <Link href="/mypage" className="p-2 -ml-2">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-lg font-bold ml-2">알림 설정</h1>
                </div>
            </header>

            <main className="pt-20 px-4 space-y-6">

                <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">

                    {/* Meal Reminder */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">식사 기록 알림</h3>
                            <p className="text-xs text-slate-500 mt-1">아침, 점심, 저녁 시간에 기록 알림을 받습니다.</p>
                        </div>
                        <ToggleSwitch checked={settings.mealReminder} onChange={() => toggle('mealReminder')} label="식사 기록 알림" />
                    </div>

                    {/* Water Reminder */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">물 마시기 알림</h3>
                            <p className="text-xs text-slate-500 mt-1">2시간 간격으로 수분 섭취를 권장합니다.</p>
                        </div>
                        <ToggleSwitch checked={settings.waterReminder} onChange={() => toggle('waterReminder')} label="물 마시기 알림" />
                    </div>

                    {/* Weekly Report */}
                    <div className="p-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">주간 리포트</h3>
                            <p className="text-xs text-slate-500 mt-1">매주 일요일 지난 주의 식단 요약을 받습니다.</p>
                        </div>
                        <ToggleSwitch checked={settings.weeklyReport} onChange={() => toggle('weeklyReport')} label="주간 리포트" />
                    </div>
                </section>

                <section className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <Bell className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-500">마케팅 정보</span>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">이벤트 및 혜택 알림</h3>
                            <p className="text-xs text-slate-500 mt-1">서비스 관련 프로모션 정보를 수신합니다.</p>
                        </div>
                        <ToggleSwitch checked={settings.marketing} onChange={() => toggle('marketing')} label="이벤트 및 혜택 알림" />
                    </div>
                </section>

            </main>
        </div>
    );
}
