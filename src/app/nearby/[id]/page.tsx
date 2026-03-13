'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Clock3, MapPin, Navigation, Wallet } from 'lucide-react';
import { Button, Card, PageShell } from '@/components/common';
import { openKakaoMapSearch } from '@/lib/kakao-maps';
import type { RestaurantDetail } from '@/lib/restaurants';

export default function NearbyDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            title="식당 상세"
            description="추천 이후 실제로 갈 후보를 확인하는 단계입니다."
            width="narrow"
            actions={(
                <Link href="/nearby">
                    <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                        탐색으로 돌아가기
                    </Button>
                </Link>
            )}
        >
            {loading ? (
                <Card padding="lg" className="border border-black shadow-none">
                    <p className="text-sm text-slate-600">식당 정보를 불러오는 중...</p>
                </Card>
            ) : error || !restaurant ? (
                <Card padding="lg" className="border border-black shadow-none">
                    <p className="text-sm font-semibold text-slate-900">{error || '식당 정보를 찾을 수 없습니다.'}</p>
                </Card>
            ) : (
                <div className="space-y-5">
                    <Card padding="lg">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-black bg-[#f7f7f7] px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                                {restaurant.category || '음식점'}
                            </span>
                            <span className="rounded-full border border-black bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                                {restaurant.source === 'live' ? '실데이터' : '샘플 데이터'}
                            </span>
                            {restaurant.distance !== undefined && (
                                <span className="rounded-full border border-black bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                                    {restaurant.distance.toFixed(1)}km
                                </span>
                            )}
                        </div>

                        <h2 className="mt-4 text-2xl font-semibold text-slate-900">{restaurant.name}</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{restaurant.recommendationReason}</p>

                        <div className="mt-5 space-y-3 text-sm text-slate-600">
                            <div className="flex items-start gap-2">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>{restaurant.address || '주소 정보 없음'}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Clock3 className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>{restaurant.openingHours}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Wallet className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>{restaurant.priceBand}</span>
                            </div>
                        </div>
                    </Card>

                    <Card padding="lg">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Recommended Menu</p>
                        <div className="mt-4 space-y-3">
                            {restaurant.menuHighlights.map((menu) => (
                                <div key={menu.name} className="rounded-[20px] border border-black bg-slate-50 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-slate-900">{menu.name}</p>
                                            <p className="mt-1 text-sm text-slate-500">{menu.note}</p>
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700">{menu.calories} kcal</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="grid gap-3 sm:grid-cols-3">
                        <InfoTile label="예상 이동" value={`${restaurant.etaMinutes || 7}분`} />
                        <InfoTile label="평점" value={restaurant.rating ? `${restaurant.rating} / 5` : '정보 없음'} />
                        <InfoTile label="리뷰" value={`${restaurant.review_count || 0}개`} />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <Button
                            variant="outline"
                            fullWidth
                            leftIcon={<Navigation className="h-4 w-4" />}
                            onClick={() => openKakaoMapSearch(restaurant.name)}
                        >
                            길찾기 열기
                        </Button>
                        <Link href={`/nearby/${restaurant.id}/arrived`} className="block">
                            <Button fullWidth>도착 확인으로 이동</Button>
                        </Link>
                    </div>
                </div>
            )}
        </PageShell>
    );
}

function InfoTile({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-[20px] border border-black bg-white p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
        </div>
    );
}
