'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Camera, MapPin, User } from 'lucide-react';

export default function BottomNavigation() {
    const pathname = usePathname();

    // Hide on onboarding and scan pages if needed, or maintain consistency
    // Usually hidden on full-screen flows like onboarding
    if (pathname.startsWith('/onboarding') || pathname.startsWith('/auth')) {
        return null;
    }

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe-area-bottom lg:hidden">
            <div className="flex justify-around items-center h-16">
                {/* Home */}
                <Link href="/" className="flex flex-col items-center justify-center w-full h-full">
                    <Home className={`w-6 h-6 ${pathname === '/' ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span className={`text-[10px] mt-1 ${pathname === '/' ? 'text-emerald-500 font-medium' : 'text-slate-400'}`}>홈</span>
                </Link>

                {/* Insights */}
                <Link href="/insights" className="flex flex-col items-center justify-center w-full h-full">
                    <BarChart2 className={`w-6 h-6 ${isActive('/insights') ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span className={`text-[10px] mt-1 ${isActive('/insights') ? 'text-emerald-500 font-medium' : 'text-slate-400'}`}>분석</span>
                </Link>

                {/* FAB (Scan) - Centered & Elevated */}
                <div className="relative -top-6">
                    <Link href="/scan" className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-colors">
                        <Camera className="w-7 h-7" />
                    </Link>
                </div>

                {/* Feed */}
                <Link href="/feed" className="flex flex-col items-center justify-center w-full h-full">
                    <MapPin className={`w-6 h-6 ${isActive('/feed') ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span className={`text-[10px] mt-1 ${isActive('/feed') ? 'text-emerald-500 font-medium' : 'text-slate-400'}`}>피드</span>
                </Link>

                {/* MyPage */}
                <Link href="/mypage" className="flex flex-col items-center justify-center w-full h-full">
                    <User className={`w-6 h-6 ${isActive('/mypage') ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span className={`text-[10px] mt-1 ${isActive('/mypage') ? 'text-emerald-500 font-medium' : 'text-slate-400'}`}>마이</span>
                </Link>
            </div>
        </nav>
    );
}
