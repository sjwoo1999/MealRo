
'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
    const { user, isLoading, logout } = useAuth();

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
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                                    {user.email?.split('@')[0]}
                                </span>
                                <button
                                    onClick={logout}
                                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    aria-label="로그아웃"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                </button>
                            </div>
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
