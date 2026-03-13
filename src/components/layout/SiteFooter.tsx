'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isShellHiddenPath } from './navigation';

export default function SiteFooter() {
    const pathname = usePathname();

    if (isShellHiddenPath(pathname)) {
        return null;
    }

    return (
        <footer
            className="mt-10 border-t"
            style={{
                backgroundColor: 'color-mix(in srgb, var(--color-surface) 86%, transparent)',
                borderColor: 'var(--color-border)',
            }}
        >
            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-md">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">MealRo</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                            AI 기반 영양 관리와 식사 추천을 연결하는 모바일 중심 헬스케어 서비스입니다.
                        </p>
                    </div>

                    <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
                        <Link href="/about" className="transition-colors hover:text-primary-600">소개</Link>
                        <Link href="/meal" className="transition-colors hover:text-primary-600">끼니 추천</Link>
                        <Link href="/scan" className="transition-colors hover:text-primary-600">음식 스캔</Link>
                        <Link href="/disclaimer" className="transition-colors hover:text-primary-600">면책조항</Link>
                    </nav>
                </div>

                <div className="mt-6 border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
                    <p className="text-xs leading-5 text-slate-400 dark:text-slate-500">
                        본 서비스의 영양 정보는 음식군 평균값 기반 추정치이며, 의료적 조언을 대체하지 않습니다.
                    </p>
                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                        © 2026 MealRo. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
