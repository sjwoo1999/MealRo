
'use client';

import React, { Suspense } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';

interface AuthGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

function AuthGuardContent({ children, fallback }: AuthGuardProps) {
    const { isAuthenticated, isLoading } = useAuthGuard();

    if (isLoading) {
        // 로딩 상태 UI (스켈레톤 또는 스피너)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400 text-sm font-medium animate-pulse">인증 확인 중...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return fallback ? <>{fallback}</> : null;
    }

    return <>{children}</>;
}

export default function AuthGuard(props: AuthGuardProps) {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400 text-sm font-medium animate-pulse">페이지 로딩 중...</p>
                </div>
            </div>
        }>
            <AuthGuardContent {...props} />
        </Suspense>
    );
}
