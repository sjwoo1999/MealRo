'use client';

import React from 'react';
import { Card } from '@/components/common';
import Link from 'next/link';

interface MealLogListProps {
    logs: any[]; // Ideally defined type
}

const MealLogList = ({ logs }: MealLogListProps) => {
    if (logs.length === 0) {
        return (
            <Card className="border-dashed border-2 border-slate-200 dark:border-slate-700 bg-transparent text-center py-8">
                <p className="text-slate-500 mb-2">아직 기록된 식단이 없어요</p>
                <Link href="/meal" className="text-primary-500 text-sm font-bold hover:underline">
                    첫 끼니 기록하기
                </Link>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {logs.map((log) => (
                <div key={log.id} className="flex items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-lg">
                        {log.selected_meal_slot === 'breakfast' ? '🥪' : log.selected_meal_slot === 'lunch' ? '🍱' : '🥗'}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between">
                            <h4 className="font-bold text-slate-900 dark:text-white">{log.selected_menu_name}</h4>
                            <span className="text-xs text-slate-400">
                                {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500">
                            + {log.recommendations?.length}개 추천 메뉴
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MealLogList;
