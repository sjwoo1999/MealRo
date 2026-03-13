'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, MapPin } from 'lucide-react';
import { Button, Card, PageShell, SuccessStateCard } from '@/components/common';
import type { RestaurantDetail } from '@/lib/restaurants';

export default function NearbyArrivedPage({
    params,
}: {
    params: { id: string };
}) {
    const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmed, setConfirmed] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/restaurants/${params.id}`);
                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.error || '식당 정보를 불러오지 못했습니다.');
                }

                setRestaurant(result.data);
            } catch (fetchError) {
                console.error(fetchError);
                setError(fetchError instanceof Error ? fetchError.message : '식당 정보를 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        };

        void fetchDetail();
    }, [params.id]);

    return (
        <PageShell
            title="도착 확인"
            description="탐색 이후 실제 방문까지 이어지는 루프입니다."
            width="narrow"
            actions={(
                <Link href={`/nearby/${params.id}`}>
                    <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                        상세로 돌아가기
                    </Button>
                </Link>
            )}
        >
            {loading ? (
                <Card padding="lg" className="border border-black shadow-none">
                    <p className="text-sm text-slate-600">도착 확인 화면을 준비하는 중...</p>
                </Card>
            ) : error || !restaurant ? (
                <Card padding="lg" className="border border-black shadow-none">
                    <p className="text-sm font-semibold text-slate-900">{error || '식당 정보를 찾을 수 없습니다.'}</p>
                </Card>
            ) : (
                <div className="space-y-5">
                    <Card padding="lg" className="text-center">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Arrived</p>
                        <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                            {restaurant.name}에 도착했나요?
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            도착을 확인하면 오늘 선택 흐름을 마무리하고 다음 기록이나 피드 확인으로 이동할 수 있습니다.
                        </p>

                        <div className="mt-5 rounded-[24px] border border-black bg-slate-50 p-5 text-left">
                            <div className="flex items-start gap-2 text-sm text-slate-600">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>{restaurant.address || '주소 정보 없음'}</span>
                            </div>
                            <p className="mt-3 text-sm text-slate-500">
                                예상 이동 시간 {restaurant.etaMinutes || 7}분 · {restaurant.openingHours}
                            </p>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <Button
                                fullWidth
                                leftIcon={<CheckCircle2 className="h-4 w-4" />}
                                onClick={() => setConfirmed(true)}
                            >
                                도착했어요
                            </Button>
                            <Link href="/nearby" className="block">
                                <Button variant="outline" fullWidth>
                                    다른 식당 보기
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    {confirmed && (
                        <>
                            <SuccessStateCard
                                title="방문 흐름이 확인되었습니다"
                                description="이제 피드에서 기록을 보거나, 인사이트 화면으로 이동해 다음 단계로 넘어갈 수 있습니다."
                            />

                            <div className="grid gap-3 sm:grid-cols-3">
                                <Link href="/feed" className="block">
                                    <Button fullWidth>전체 기록 보기</Button>
                                </Link>
                                <Link href="/insights" className="block">
                                    <Button variant="outline" fullWidth>
                                        분석 보기
                                    </Button>
                                </Link>
                                <Link href="/scan" className="block">
                                    <Button variant="outline" fullWidth>
                                        다시 기록
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            )}
        </PageShell>
    );
}
