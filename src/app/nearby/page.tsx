'use client';

import React, { useEffect, useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import Map from '@/components/map/Map';
import RestaurantCard from '@/components/map/RestaurantCard';
import { Button } from '@/components/common';

export default function NearbyPage() {
    const { latitude, longitude, error: geoError, isLoading: geoLoading } = useGeolocation();
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Mock if no DB data
        const MOCK_DATA = [
            { id: '1', name: '건강한 밥상', category: '한식', latitude: 37.5665, longitude: 126.9780, address: '서울 중구', rating: 4.5, review_count: 120 },
            { id: '2', name: '샐러드 팜', category: '양식', latitude: 37.5660, longitude: 126.9784, address: '서울 중구', rating: 4.8, review_count: 50 },
        ];

        const fetchRestaurants = async () => {
            if (!latitude || !longitude) return;
            setIsLoading(true);
            try {
                const res = await fetch(`/api/restaurants/nearby?lat=${latitude}&lng=${longitude}&range=1`);
                const data = await res.json();
                if (data.success && data.data.length > 0) {
                    setRestaurants(data.data);
                } else {
                    // Fallback to mock if empty (during dev)
                    // In real app, just empty state
                    // Use a mock slightly offset from user
                    setRestaurants(MOCK_DATA.map(r => ({
                        ...r,
                        latitude: latitude + (Math.random() - 0.5) * 0.002,
                        longitude: longitude + (Math.random() - 0.5) * 0.002
                    })));
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        if (latitude && longitude) {
            fetchRestaurants();
        }
    }, [latitude, longitude]);

    if (geoLoading) {
        return <div className="p-8 text-center text-slate-500">위치 정보를 불러오는 중...</div>;
    }

    if (geoError && !latitude) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-500 mb-4">{geoError}</p>
                <p className="text-sm text-slate-500">위치 권한을 허용해주세요.</p>
            </div>
        );
    }

    const center = { lat: latitude || 37.5665, lng: longitude || 126.9780 };
    const markers = restaurants.map(r => ({
        id: r.id,
        lat: r.latitude,
        lng: r.longitude,
        title: r.name
    }));

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                주변 맛집 찾기 📍
            </h1>

            <div className="mb-6 relative z-0">
                <Map
                    center={center}
                    markers={markers}
                    className="shadow-lg"
                    level={4}
                />
            </div>

            <div className="space-y-4">
                <h2 className="font-bold text-lg text-slate-800 dark:text-slate-200">
                    추천 식당 ({restaurants.length})
                </h2>

                {isLoading ? (
                    <div className="text-center py-4 text-slate-500">목록 불러오는 중...</div>
                ) : (
                    restaurants.map(r => (
                        <RestaurantCard key={r.id} restaurant={r} />
                    ))
                )}
            </div>
        </div>
    );
}
