'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, Camera, Home, User, UtensilsCrossed } from 'lucide-react';
import { PRIMARY_NAV_ITEMS, isActivePath, isShellHiddenPath } from './navigation';
import { cn } from '@/lib/utils';

export default function BottomNavigation() {
    const pathname = usePathname();

    if (isShellHiddenPath(pathname)) {
        return null;
    }

    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 lg:hidden" aria-label="하단 내비게이션">
            <div className="mx-auto max-w-md px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
                <div className="rounded-2xl border border-line bg-white/88 px-2 py-2 shadow-sm backdrop-blur-xl">
                    <div className="grid grid-cols-5 items-center gap-1">
                        <NavLink pathname={pathname} item={{ href: '/', label: '홈', match: 'exact' }} />
                        <NavLink pathname={pathname} item={{ href: '/insights', label: '분석', match: 'prefix' }} />
                        <NavLink pathname={pathname} item={{ href: '/scan', label: '기록', match: 'prefix' }} isFab />
                        <NavLink pathname={pathname} item={{ href: '/meal', label: '추천', match: 'prefix' }} />
                        <NavLink pathname={pathname} item={{ href: '/mypage', label: '마이', match: 'prefix' }} />
                    </div>
                </div>
            </div>
        </nav>
    );
}

function NavLink({
    pathname,
    item,
    isFab = false,
}: {
    pathname: string;
    item: (typeof PRIMARY_NAV_ITEMS)[number];
    isFab?: boolean;
}) {
    const active = isActivePath(pathname, item);

    return (
        <Link
            href={item.href}
            className={cn(
                'flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl px-2 text-center transition-colors',
                active
                    ? 'bg-surface-muted text-accent font-semibold'
                    : 'text-copy-subtle hover:text-copy-muted hover:bg-surface-muted/50',
            )}
            aria-current={active ? 'page' : undefined}
        >
            {isFab ? (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white shadow-sm">
                    <Camera className="h-5 w-5" />
                </span>
            ) : (
                getIcon(item.href)
            )}
            <span className="text-[11px] font-medium">
                {item.mobileLabel ?? item.label}
            </span>
        </Link>
    );
}

function getIcon(href: string) {
    const className = 'h-5 w-5';

    switch (href) {
        case '/':
            return <Home className={className} />;
        case '/insights':
            return <BarChart2 className={className} />;
        case '/scan':
            return <Camera className={className} />;
        case '/meal':
            return <UtensilsCrossed className={className} />;
        case '/mypage':
            return <User className={className} />;
        default:
            return <Camera className={className} />;
    }
}
