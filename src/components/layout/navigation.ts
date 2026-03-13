export type NavigationItem = {
    href: string;
    label: string;
    mobileLabel?: string;
    match?: 'exact' | 'prefix';
    showInDesktop?: boolean;
};

export const PRIMARY_NAV_ITEMS: NavigationItem[] = [
    { href: '/', label: '홈', match: 'exact', showInDesktop: true },
    { href: '/scan', label: '스캔', match: 'prefix', showInDesktop: false },
    { href: '/feed', label: '피드', match: 'prefix', showInDesktop: true },
    { href: '/mypage', label: '마이', mobileLabel: '마이', match: 'prefix', showInDesktop: true },
];

export const SHELL_HIDDEN_PREFIXES = ['/onboarding', '/auth', '/scan'];

export function isShellHiddenPath(pathname: string): boolean {
    return SHELL_HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function isActivePath(pathname: string, item: NavigationItem): boolean {
    if (item.match === 'exact') {
        return pathname === item.href;
    }

    if (item.href === '/') {
        return pathname === '/';
    }

    return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
