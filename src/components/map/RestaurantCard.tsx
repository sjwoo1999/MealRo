'use client';

import React from 'react';
import { MapPin, Navigation, Star } from 'lucide-react';
import { Card, Button } from '@/components/common';
import { openKakaoMapSearch } from '@/lib/kakao-maps';

interface Restaurant {
    id: string;
    name: string;
    category?: string;
    address?: string;
    rating?: number;
    review_count?: number;
    distance?: number;
}

interface RestaurantCardProps {
    restaurant: Restaurant;
    onClick?: () => void;
    selected?: boolean;
}

const RestaurantCard = ({ restaurant, onClick, selected = false }: RestaurantCardProps) => {
    const handleFindRoute = (event: React.MouseEvent) => {
        event.stopPropagation();
        openKakaoMapSearch(restaurant.name);
    };

    return (
        <Card
            padding="lg"
            hover
            className="cursor-pointer border border-black shadow-none"
            onClick={onClick}
        >
            <div className={`rounded-[24px] border p-5 transition-colors ${selected ? 'border-black bg-black text-white' : 'border-black bg-slate-50 text-slate-900'}`}>
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold">
                                {restaurant.name}
                            </h3>
                            <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${selected ? 'border-white/20 bg-white/10 text-white' : 'border-black bg-white text-slate-600'}`}>
                                {restaurant.category || '음식점'}
                            </span>
                        </div>

                        <div className={`mt-3 flex flex-wrap items-center gap-3 text-sm ${selected ? 'text-white/70' : 'text-slate-500'}`}>
                            <span className="inline-flex items-center gap-1">
                                <Star className="h-4 w-4" />
                                {restaurant.rating || '0.0'}
                            </span>
                            <span>{restaurant.review_count || 0} reviews</span>
                            {restaurant.distance !== undefined && <span>{restaurant.distance.toFixed(1)} km</span>}
                        </div>

                        <p className={`mt-3 flex items-start gap-2 text-sm leading-6 ${selected ? 'text-white/70' : 'text-slate-600'}`}>
                            <MapPin className={`mt-1 h-4 w-4 shrink-0 ${selected ? 'text-white/70' : 'text-slate-400'}`} />
                            <span>{restaurant.address || '주소 정보 없음'}</span>
                        </p>
                    </div>

                    <Button
                        size="sm"
                        variant={selected ? 'primary' : 'outline'}
                        className="shrink-0"
                        leftIcon={<Navigation className="h-4 w-4" />}
                        onClick={handleFindRoute}
                    >
                        길찾기
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default RestaurantCard;
