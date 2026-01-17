
'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
    const { user, isLoading } = useAuth();

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 transition-colors">
            <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-xl font-bold text-green-600 dark:text-green-400 hover:opacity-80 transition-opacity"
                >
                    <span aria-hidden="true">🍽️</span>
                    <span>MealRo</span>
                </Link>

                <div className="flex items-center gap-3">
                    {!isLoading && (
                        user ? (
                            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                                {user.email.split('@')[0]}님
                            </span>
                        ) : (
                            <Link
                                href="/auth?mode=login"
                                className="text-sm font-semibold text-gray-500 hover:text-green-600 transition-colors bg-gray-100 hover:bg-green-50 px-3 py-1.5 rounded-lg"
                            >
                                로그인
                            </Link>
                        )
                    )}
                </div>
            </div>
        </header>
    );
}
