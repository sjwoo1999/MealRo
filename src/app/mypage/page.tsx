'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowRight, Camera, RefreshCcw, Settings2, UserRound } from 'lucide-react';
import { Button, Card, PageShell } from '@/components/common';
import { clearAnonymousUserId, getAnonymousUserId } from '@/lib/userId';

export default function MyPage() {
    const testerId = useMemo(() => getAnonymousUserId().slice(-4) || '0000', []);

    return (
        <PageShell
            title="마이"
            description="설정과 바로가기를 모아뒀어요."
            width="narrow"
        >
            <div className="space-y-5">
                <Card padding="lg">
                    <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-black bg-slate-50">
                            <UserRound className="h-6 w-6 text-slate-900" />
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Beta Tester</p>
                            <h2 className="mt-2 text-2xl font-semibold text-slate-900">테스터 {testerId}</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                로그인 없이 쓰는 베타 모드예요.
                            </p>
                        </div>
                    </div>
                </Card>

                <Card padding="lg">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Quick Actions</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <Link href="/scan" className="block">
                            <Button fullWidth leftIcon={<Camera className="h-4 w-4" />}>
                                기록 남기기
                            </Button>
                        </Link>
                        <Link href="/feed" className="block">
                            <Button variant="outline" fullWidth leftIcon={<ArrowRight className="h-4 w-4" />}>
                                전체 기록 보기
                            </Button>
                        </Link>
                    </div>
                </Card>

                <Card padding="lg">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Settings</p>
                    <div className="mt-4 space-y-3">
                        <ActionLink
                            href="/onboarding"
                            title="온보딩 다시 입력"
                            description="추천 기준으로 쓰는 기본 신체 정보와 목표를 다시 설정합니다."
                        />
                        <ActionLink
                            href="/mypage/goals"
                            title="목표 설정 보기"
                            description="현재 목표와 활동량 설정 화면으로 이동합니다."
                        />
                        <ActionLink
                            href="/mypage/connections"
                            title="연동 기능 보기"
                            description="헬스 앱 연동 계획 화면을 확인합니다."
                        />
                    </div>
                </Card>

                <Card padding="lg">
                    <div className="flex items-start gap-3">
                        <Settings2 className="mt-0.5 h-5 w-5 text-slate-900" />
                        <div className="flex-1">
                            <p className="font-semibold text-slate-900">테스터 ID 초기화</p>
                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                이 브라우저의 테스터 ID를 새로 만들 수 있어요.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <Button
                            variant="outline"
                            leftIcon={<RefreshCcw className="h-4 w-4" />}
                            onClick={() => {
                                clearAnonymousUserId();
                                window.location.reload();
                            }}
                        >
                            테스터 ID 초기화
                        </Button>
                    </div>
                </Card>
            </div>
        </PageShell>
    );
}

function ActionLink({
    href,
    title,
    description,
}: {
    href: string;
    title: string;
    description: string;
}) {
    return (
        <Link href={href} className="block rounded-[20px] border border-black bg-slate-50 p-4 transition-colors hover:bg-white">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="font-semibold text-slate-900">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-500" />
            </div>
        </Link>
    );
}
