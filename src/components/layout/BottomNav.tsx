'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import UpgradePromptModal from '@/components/auth/UpgradePromptModal';

export default function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth();
    const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);

    // Hide on specific pages
    if (pathname?.startsWith('/onboarding') || pathname?.startsWith('/collect') || pathname?.startsWith('/auth')) {
        return null;
    }

    const handleTabClick = (e: React.MouseEvent, href: string, isLocked: boolean) => {
        if (isLocked) {
            e.preventDefault();
            setShowUpgradeModal(true);
        }
    };

    const tabs = [
        { name: '홈', href: '/', icon: <HomeIcon />, locked: false },
        { name: '끼니추천', href: '/meal', icon: <MealIcon />, locked: false },
        { name: '주변맛집', href: '/nearby', icon: <MapIcon />, locked: false },
        { name: '대시보드', href: '/dashboard', icon: <ChartIcon />, locked: !isAuthenticated }, // Lock if not auth
    ];

    // NOTE: History is accessible via dashboard or separate tab if needed. 
    // For MVP, we stick to 4 items or add History as 5th.
    // Let's add '기록' (History) as 5th item per PRD v2.0
    const allTabs = [
        ...tabs,
        { name: '기록', href: '/history', icon: <HistoryIcon />, locked: !isAuthenticated }
    ];

    return (
        <>
            <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe">
                <div className="flex justify-around items-center h-16 max-w-2xl mx-auto">
                    {allTabs.map((tab) => {
                        const isActive = pathname === tab.href || (tab.href !== '/' && pathname?.startsWith(tab.href));
                        const isLocked = tab.locked && !isLoading; // Only lock if loaded and unauth

                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                onClick={(e) => handleTabClick(e, tab.href, isLocked)}
                                className={`flex flex-col items-center justify-center flex-1 h-full px-1 transition-colors relative ${isActive
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                                    }`}
                            >
                                <div className="mb-1 relative">
                                    {isLocked ? <LockIcon /> : tab.icon}
                                    {/* Optional: Show small notification dot if needed */}
                                </div>
                                <span className="text-[10px] font-medium">{tab.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Upgrade Modal */}
            <UpgradePromptModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
            />
        </>
    );
}

// Icons (Simple SVGs)
const HomeIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
);
const MealIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
);
const MapIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const ChartIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
);
const LockIcon = () => (
    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
);
const HistoryIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
