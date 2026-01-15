'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MealTabs from '@/components/MealTabs';
import FilterChips from '@/components/FilterChips';
import RecoCard from '@/components/RecoCard';
import SkeletonCard from '@/components/SkeletonCard';
import EmptyState from '@/components/EmptyState';
import { createClient } from '@/lib/supabase/client';
import { computeGrade } from '@/lib/grade';
import { trackPageView, trackExcludedItemEncountered } from '@/lib/analytics';
import { MealType, MenuItemWithNutrition, NutritionGroupAvg, MenuItem } from '@/lib/supabase/types';

// Category filter options
const CATEGORY_OPTIONS = [
    { value: 'korean', label: '한식' },
    { value: 'western', label: '양식' },
    { value: 'asian', label: '아시안' },
    { value: 'snack', label: '간식' },
    { value: 'drink', label: '음료' },
];

export default function MealContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const mealType = (searchParams.get('meal') as MealType) || 'lunch';
    const categoryFilter = searchParams.get('category');

    const [items, setItems] = useState<MenuItemWithNutrition[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Track page view on mount
    useEffect(() => {
        trackPageView('/meal');
    }, []);

    // Fetch menu items
    const fetchItems = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const supabase = createClient();

            // Build query for menu items
            let query = supabase
                .from('menu_items')
                .select('*')
                .eq('meal_type', mealType)
                .eq('is_allowed', true);  // Only show allowed items

            // Apply category filter if set
            if (categoryFilter) {
                query = query.eq('category', categoryFilter);
            }

            const menuResponse = await query.order('name');
            const menuItems = (menuResponse.data || []) as MenuItem[];

            if (menuResponse.error) {
                throw menuResponse.error;
            }

            if (menuItems.length === 0) {
                setItems([]);
                setIsLoading(false);
                return;
            }

            // Fetch nutrition data for food groups
            const foodGroups = Array.from(new Set(menuItems.map(item => item.food_group)));

            const nutritionResponse = await supabase
                .from('nutrition_group_avg')
                .select('*')
                .in('food_group', foodGroups);

            const nutritionData = (nutritionResponse.data || []) as NutritionGroupAvg[];

            if (nutritionResponse.error) {
                console.error('Failed to fetch nutrition data:', nutritionResponse.error);
            }

            // Create lookup map for nutrition
            const nutritionMap = new Map<string, NutritionGroupAvg>();
            nutritionData.forEach(n => nutritionMap.set(n.food_group, n));

            // Combine and compute grades
            const itemsWithNutrition: MenuItemWithNutrition[] = menuItems
                .filter(item => {
                    // Log excluded items internally
                    if (!item.is_allowed && item.exclusion_reason) {
                        trackExcludedItemEncountered('/meal', item.id, item.exclusion_reason);
                    }
                    return item.is_allowed;
                })
                .map(item => {
                    const nutrition = nutritionMap.get(item.food_group) || null;
                    const grade = computeGrade(nutrition);

                    return {
                        ...item,
                        nutrition,
                        grade,
                    };
                });

            // Sort by grade (A > B > C > D)
            const gradeOrder: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
            itemsWithNutrition.sort((a, b) => gradeOrder[a.grade] - gradeOrder[b.grade]);

            setItems(itemsWithNutrition);
        } catch (err) {
            console.error('Failed to fetch items:', err);
            setError('데이터를 불러오는데 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }, [mealType, categoryFilter]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    return (
        <div className="space-y-6">
            {/* Meal Type Tabs */}
            <MealTabs currentMeal={mealType} />

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <FilterChips
                    filterKey="category"
                    options={CATEGORY_OPTIONS}
                    label="카테고리"
                    mealType={mealType}
                />
            </div>

            {/* Results */}
            <section
                aria-label={`${mealType === 'breakfast' ? '아침' : mealType === 'lunch' ? '점심' : '저녁'} 추천 메뉴`}
                className="space-y-4"
            >
                {/* Loading State */}
                {isLoading && (
                    <div className="space-y-4">
                        <SkeletonCard count={4} />
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                        <p className="text-red-700 dark:text-red-400 text-center">
                            ⚠️ {error}
                        </p>
                        <button
                            onClick={fetchItems}
                            className="mt-4 w-full py-2 text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                            다시 시도
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && items.length === 0 && (
                    <EmptyState
                        icon="🔍"
                        title="추천 항목이 없습니다"
                        description="다른 조건으로 검색해보세요."
                        action={{
                            label: '필터 초기화',
                            onClick: () => router.push(`/meal?meal=${mealType}`),
                        }}
                    />
                )}

                {/* Results List */}
                {!isLoading && !error && items.length > 0 && (
                    <>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {items.length}개의 추천 메뉴
                        </p>
                        <div className="space-y-4">
                            {items.map(item => (
                                <RecoCard
                                    key={item.id}
                                    item={item}
                                    mealType={mealType}
                                />
                            ))}
                        </div>
                    </>
                )}
            </section>

            {/* Disclaimer */}
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">
                {/* TODO(LEGAL_REVIEW): 면책 문구 법무 검토 필요 */}
                * 영양 정보는 음식군 평균값 기반 추정치이며 실제와 다를 수 있습니다.
            </p>
        </div>
    );
}
