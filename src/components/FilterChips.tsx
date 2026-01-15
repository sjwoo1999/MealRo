'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { trackFilterApplied } from '@/lib/analytics';
import { MealType } from '@/lib/supabase/types';

interface FilterOption {
    value: string;
    label: string;
}

interface FilterChipsProps {
    filterKey: string;
    options: FilterOption[];
    label: string;
    mealType?: MealType;
    allowMultiple?: boolean;
}

export default function FilterChips({
    filterKey,
    options,
    label,
    mealType,
    allowMultiple = false,
}: FilterChipsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentValues = searchParams.getAll(filterKey);

    const handleToggle = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (currentValues.includes(value)) {
            // Remove filter
            params.delete(filterKey);
            currentValues
                .filter((v) => v !== value)
                .forEach((v) => params.append(filterKey, v));
        } else {
            // Add filter
            if (allowMultiple) {
                params.append(filterKey, value);
            } else {
                params.set(filterKey, value);
            }
        }

        // Track analytics
        trackFilterApplied('/meal', filterKey, value, mealType);

        router.push(`/meal?${params.toString()}`);
    };

    const handleClearAll = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete(filterKey);
        router.push(`/meal?${params.toString()}`);
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                </span>
                {currentValues.length > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                        초기화
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
                {options.map(({ value, label: optionLabel }) => {
                    const isActive = currentValues.includes(value);

                    return (
                        <button
                            key={value}
                            onClick={() => handleToggle(value)}
                            aria-pressed={isActive}
                            className={`
                px-3 py-1.5 rounded-full text-sm font-medium
                transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
                ${isActive
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                }
              `}
                        >
                            {optionLabel}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
