'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { MealType } from '@/lib/supabase/types';
import { trackMealSelected } from '@/lib/analytics';

interface MealTabsProps {
    currentMeal?: MealType;
}

const MEAL_OPTIONS: { value: MealType; label: string; icon: string }[] = [
    { value: 'breakfast', label: '아침', icon: '🌅' },
    { value: 'lunch', label: '점심', icon: '☀️' },
    { value: 'dinner', label: '저녁', icon: '🌙' },
];

export default function MealTabs({ currentMeal }: MealTabsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const activeMeal = currentMeal || (searchParams.get('meal') as MealType) || 'lunch';

    const handleMealSelect = (meal: MealType) => {
        // Track analytics event
        trackMealSelected('/meal', meal);

        // Update URL
        const params = new URLSearchParams(searchParams.toString());
        params.set('meal', meal);
        router.push(`/meal?${params.toString()}`);
    };

    return (
        <nav
            role="tablist"
            aria-label="끼니 선택"
            className="flex gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl"
        >
            {MEAL_OPTIONS.map(({ value, label, icon }) => {
                const isActive = activeMeal === value;

                return (
                    <button
                        key={value}
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`${value}-panel`}
                        onClick={() => handleMealSelect(value)}
                        className={`
              flex-1 flex items-center justify-center gap-2 
              px-4 py-3 rounded-lg
              font-medium text-sm
              transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
              ${isActive
                                ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
                            }
            `}
                    >
                        <span aria-hidden="true">{icon}</span>
                        <span>{label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
