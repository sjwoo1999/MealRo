'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { MenuItemWithNutrition } from '@/lib/supabase/types';
import GradeBadge from './GradeBadge';
import { trackItemImpression, trackItemClick } from '@/lib/analytics';

interface RecoCardProps {
    item: MenuItemWithNutrition;
    mealType?: string;
}

export default function RecoCard({ item, mealType }: RecoCardProps) {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const hasTrackedImpression = useRef(false);

    // Track impression when card is visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasTrackedImpression.current) {
                        hasTrackedImpression.current = true;
                        trackItemImpression(
                            '/meal',
                            item.id,
                            mealType as 'breakfast' | 'lunch' | 'dinner'
                        );
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [item.id, mealType]);

    const handleClick = () => {
        trackItemClick(
            '/meal',
            item.id,
            mealType as 'breakfast' | 'lunch' | 'dinner'
        );
    };

    const nutrition = item.nutrition;

    return (
        <Link
            ref={cardRef}
            href={`/item/${item.id}`}
            onClick={handleClick}
            className="
        block p-4 bg-white dark:bg-slate-800 
        rounded-xl border border-slate-200 dark:border-slate-700
        shadow-sm hover:shadow-md
        transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
      "
        >
            {/* Header: Name + Grade */}
            <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-semibold text-slate-900 dark:text-white text-lg leading-tight">
                    {item.name}
                </h3>
                <GradeBadge grade={item.grade} size="md" />
            </div>

            {/* Category */}
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                {item.category}
            </p>

            {/* Nutrition Info */}
            {nutrition ? (
                <div className="grid grid-cols-4 gap-2 text-center">
                    <NutritionItem
                        label="칼로리"
                        value={Math.round(nutrition.kcal_per_100g)}
                        unit="kcal"
                    />
                    <NutritionItem
                        label="단백질"
                        value={Math.round(nutrition.protein_per_100g)}
                        unit="g"
                    />
                    <NutritionItem
                        label="탄수화물"
                        value={Math.round(nutrition.carbs_per_100g)}
                        unit="g"
                    />
                    <NutritionItem
                        label="지방"
                        value={Math.round(nutrition.fat_per_100g)}
                        unit="g"
                    />
                </div>
            ) : (
                <p className="text-sm text-slate-400 dark:text-slate-500 italic">
                    영양 정보 없음
                </p>
            )}

            {/* Estimation Notice */}
            <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                * 100g 기준 추정치
            </p>
        </Link>
    );
}

function NutritionItem({
    label,
    value,
    unit
}: {
    label: string;
    value: number;
    unit: string;
}) {
    return (
        <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-slate-400">
                {label}
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
                {value}
                <span className="text-xs font-normal ml-0.5">{unit}</span>
            </span>
        </div>
    );
}
