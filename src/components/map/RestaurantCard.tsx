'use client';

import React from 'react';
import { Card, Button } from '@/components/common';
import { openKakaoMapSearch } from '@/lib/kakao-maps';

interface Restaurant {
    id: string;
    name: string;
    category?: string;
    address?: string;
    rating?: number;
    review_count?: number;
    distance?: number; // Optional distance from user
}

interface RestaurantCardProps {
    restaurant: Restaurant;
    onClick?: () => void;
}

const RestaurantCard = ({ restaurant, onClick }: RestaurantCardProps) => {
    const handleFindRoute = (e: React.MouseEvent) => {
        e.stopPropagation();
        openKakaoMapSearch(restaurant.name);
    };

    return (
        <Card
            className="mb-3 active:scale-[0.98] transition-transform cursor-pointer border border-slate-100 dark:border-slate-700"
            onClick={onClick}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                        {restaurant.name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-1">
                        {restaurant.category || '음식점'}
                        {restaurant.distance && ` • ${restaurant.distance.toFixed(1)}km`}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                        {restaurant.address || '주소 정보 없음'}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs">
                        <span className="text-yellow-500">⭐ {restaurant.rating || '0.0'}</span>
                        <span className="text-slate-400">({restaurant.review_count || 0})</span>
                    </div>
                </div>
                <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                    onClick={handleFindRoute}
                >
                    길찾기
                </Button>
            </div>
        </Card>
    );
};

export default RestaurantCard;
