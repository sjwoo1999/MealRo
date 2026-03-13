'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Crosshair, MapPin, RefreshCcw } from 'lucide-react';
import { Button, Card, PageShell } from '@/components/common';
import Map from '@/components/map/Map';
import RestaurantCard from '@/components/map/RestaurantCard';
import { FALLBACK_CENTER, FALLBACK_RESTAURANTS, type RestaurantSummary, normalizeRestaurant } from '@/lib/restaurants';

export default function NearbyPage() {
    const [restaurants, setRestaurants] = useState<RestaurantSummary[]>(FALLBACK_RESTAURANTS);
    const [selectedId, setSelectedId] = useState<string>(FALLBACK_RESTAURANTS[0].id);
    const [center, setCenter] = useState(FALLBACK_CENTER);
    const [status, setStatus] = useState<'idle' | 'locating' | 'loaded' | 'fallback'>('idle');

    useEffect(() => {
        if (!navigator.geolocation) {
            setStatus('fallback');
            return;
        }

        setStatus('locating');
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const nextCenter = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                setCenter(nextCenter);

                try {
                    const response = await fetch(`/api/restaurants/nearby?lat=${nextCenter.lat}&lng=${nextCenter.lng}&range=1`);
                    const payload = await response.json();

                    if (payload.success && Array.isArray(payload.data) && payload.data.length > 0) {
                        const normalized: RestaurantSummary[] = payload.data.map((item: any, index: number) =>
                            normalizeRestaurant(item, index)
                        );

                        setRestaurants(normalized);
                        setSelectedId(normalized[0].id);
                        setStatus('loaded');
                        return;
                    }
                } catch (error) {
                    console.error('Failed to load nearby restaurants', error);
                }

                setStatus('fallback');
            },
            () => {
                setStatus('fallback');
            },
            { enableHighAccuracy: true, timeout: 7000 }
        );
    }, []);

    const selectedRestaurant = restaurants.find((restaurant) => restaurant.id === selectedId) || restaurants[0];

    const markers = useMemo(
        () =>
            restaurants
                .filter((restaurant) => restaurant.latitude && restaurant.longitude)
                .map((restaurant) => ({
                    id: restaurant.id,
                    lat: restaurant.latitude as number,
                    lng: restaurant.longitude as number,
                    title: restaurant.name,
                })),
        [restaurants]
    );

    return (
        <PageShell
            title="주변 탐색"
            description="기록 후 바로 갈 수 있는 식당을 확인하는 단계입니다."
            width="wide"
        >
            <div className="space-y-5">
                <Card padding="lg">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Explore</p>
                            <h2 className="mt-2 text-2xl font-semibold text-copy">지금 바로 갈 수 있는 식당</h2>
                            <p className="mt-2 text-sm leading-6 text-copy-subtle">
                                추천 이후 바로 탐색하는 MVP 흐름입니다.
                            </p>
                        </div>
                        <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-copy-muted">
                            {restaurants.length} places
                        </span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2 text-xs">
                        <StatusPill active={status === 'loaded'}>현재 위치 반영</StatusPill>
                        <StatusPill active={status === 'fallback'}>샘플 데이터</StatusPill>
                        <StatusPill active={status === 'locating'}>위치 확인 중</StatusPill>
                    </div>
                </Card>

                <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-5">
                        <Card padding="lg">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Map</p>
                                    <p className="mt-2 text-sm text-copy-muted">지도에서 위치를 확인하고 식당을 선택하세요.</p>
                                </div>
                                <div className="rounded-full border border-line-strong px-3 py-1 text-xs text-copy-muted">
                                    1km
                                </div>
                            </div>

                            <div className="mt-5 overflow-hidden rounded-2xl border border-line shadow-sm">
                                <Map
                                    center={center}
                                    markers={markers}
                                    onMarkerClick={setSelectedId}
                                />
                            </div>
                        </Card>

                        <Card padding="lg">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">List</p>
                                    <h3 className="mt-2 text-xl font-semibold text-copy">주변 후보</h3>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    leftIcon={<RefreshCcw className="h-4 w-4" />}
                                    onClick={() => window.location.reload()}
                                >
                                    새로고침
                                </Button>
                            </div>

                            <div className="mt-5 space-y-3">
                                {restaurants.map((restaurant) => (
                                    <RestaurantCard
                                        key={restaurant.id}
                                        restaurant={restaurant}
                                        selected={restaurant.id === selectedId}
                                        onClick={() => setSelectedId(restaurant.id)}
                                    />
                                ))}
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-5">
                        <Card padding="lg">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Selected Place</p>
                            <h3 className="mt-2 text-xl font-semibold text-copy">{selectedRestaurant?.name || '식당을 선택하세요'}</h3>
                            <div className="mt-4 space-y-3 text-sm text-copy-muted">
                                <div className="flex items-start gap-2">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                    <span>{selectedRestaurant?.address || '주소 정보 없음'}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Crosshair className="mt-0.5 h-4 w-4 shrink-0" />
                                    <span>
                                        {selectedRestaurant?.distance !== undefined
                                            ? `${selectedRestaurant.distance.toFixed(1)}km 거리`
                                            : '거리 정보 없음'}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <InfoBox label="카테고리" value={selectedRestaurant?.category || '음식점'} />
                                <InfoBox
                                    label="평점"
                                    value={
                                        selectedRestaurant?.rating
                                            ? `${selectedRestaurant.rating} / 5`
                                            : '정보 없음'
                                    }
                                />
                            </div>
                        </Card>

                        <Card padding="lg">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Next Action</p>
                            <div className="mt-4 space-y-3">
                                <Link href={`/nearby/${selectedRestaurant.id}`} className="block">
                                    <Button fullWidth>
                                        상세 보기
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    fullWidth
                                    onClick={() => window.location.href = '/feed'}
                                >
                                    베타 피드로 돌아가기
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}

function StatusPill({
    children,
    active = false,
}: {
    children: React.ReactNode;
    active?: boolean;
}) {
    return (
        <span className={`rounded-full border px-3 py-1 transition-colors ${active ? 'border-accent bg-accent text-white shadow-sm' : 'border-line-strong bg-surface text-copy-muted'}`}>
            {children}
        </span>
    );
}

function InfoBox({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
            <p className="text-sm text-copy-subtle">{label}</p>
            <p className="mt-2 text-base font-semibold text-copy">{value}</p>
        </div>
    );
}
