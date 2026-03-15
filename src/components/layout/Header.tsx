
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/common/Button';
import { PRIMARY_NAV_ITEMS, isActivePath, isShellHiddenPath } from './navigation';

export default function Header() {
    const { user, isLoading, logout } = useAuth();
    const pathname = usePathname();

    if (isShellHiddenPath(pathname)) {
        return null;
    }

    const desktopItems = PRIMARY_NAV_ITEMS.filter((item) => item.showInDesktop);

    return (
        <header
            className="sticky top-0 z-50 border-b border-black bg-white transition-colors"
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
                <div className="flex min-w-0 items-center gap-4 lg:gap-8">
                    <Link
                        href="/"
                        className="flex min-w-0 items-center gap-3 rounded-2xl px-1 py-1"
                    >
                        <span
                            aria-hidden="true"
                            className="flex h-10 w-10 items-center justify-center rounded-[16px] border border-black bg-white text-lg"
                        >
                            🍽️
                        </span>
                        <span className="min-w-0">
                            <span className="block truncate text-lg font-bold tracking-tight text-slate-900">
                                MealRo
                            </span>
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-2 lg:flex">
                        {desktopItems.map((item) => {
                            const isActive = isActivePath(pathname, item);
                            if (item.comingSoon) {
                                return (
                                    <span
                                        key={item.href}
                                        className="cursor-not-allowed rounded-full px-4 py-2 text-sm font-medium text-slate-400"
                                        title="준비 중"
                                    >
                                        {item.label}
                                    </span>
                                );
                            }
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                                        isActive ? 'bg-neutral-100 text-slate-900' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex shrink-0 items-center gap-2 lg:gap-3">
                    <Link
                        href="/scan"
                        className="hidden items-center gap-2 rounded-full border border-black bg-black px-4 py-2 text-sm font-semibold text-white lg:inline-flex"
                    >
                        <Camera className="h-4 w-4" />
                        기록하기
                    </Link>

                    {!isLoading && (
                        user ? (
                            <div className="flex items-center gap-2">
                                <div
                                    className="hidden rounded-full border border-black px-3 py-1.5 text-sm font-medium text-slate-600 md:block"
                                >
                                    {user.email?.split('@')[0]}
                                </div>
                                <Button
                                    onClick={logout}
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-full px-3"
                                    aria-label="로그아웃"
                                >
                                    로그아웃
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Link href="/auth?mode=login" className="hidden md:block">
                                    <Button variant="ghost" size="sm">로그인</Button>
                                </Link>
                                <Link href="/auth?mode=signup">
                                    <Button size="sm" className="rounded-full px-4">
                                        가입하기
                                    </Button>
                                </Link>
                            </>
                        )
                    )}
                </div>
            </div>
        </header>
    );
}
