import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { computeGrade, getGradeInfo } from '@/lib/grade';
import GradeBadge from '@/components/GradeBadge';
import { MenuItem, NutritionGroupAvg } from '@/lib/supabase/types';

interface ItemPageProps {
    params: Promise<{ id: string }>;
}

export default async function ItemPage({ params }: ItemPageProps) {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    // Fetch menu item
    const itemResponse = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', id)
        .eq('is_allowed', true)
        .single();

    const item = itemResponse.data as MenuItem | null;

    if (itemResponse.error || !item) {
        notFound();
    }

    // Fetch nutrition data
    const nutritionResponse = await supabase
        .from('nutrition_group_avg')
        .select('*')
        .eq('food_group', item.food_group)
        .single();

    const nutrition = nutritionResponse.data as NutritionGroupAvg | null;

    const grade = computeGrade(nutrition);
    const gradeInfo = getGradeInfo(grade);

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            {/* Back button */}
            <Link
                href="/meal"
                className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 mb-6"
            >
                <span aria-hidden="true">←</span>
                <span>목록으로</span>
            </Link>

            {/* Item Header */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {item.name}
                    </h1>
                    <GradeBadge grade={grade} size="lg" showLabel />
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span>
                        {item.meal_type === 'breakfast' ? '아침' :
                            item.meal_type === 'lunch' ? '점심' : '저녁'}
                    </span>
                </div>

                {/* Grade Explanation */}
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-medium">{gradeInfo.icon} {gradeInfo.label}:</span>{' '}
                        {gradeInfo.description}
                    </p>
                </div>
            </div>

            {/* Nutrition Info */}
            {nutrition && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
                    <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
                        영양 정보 (100g 기준)
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <NutritionRow label="칼로리" value={nutrition.kcal_per_100g} unit="kcal" />
                        <NutritionRow label="단백질" value={nutrition.protein_per_100g} unit="g" />
                        <NutritionRow label="탄수화물" value={nutrition.carbs_per_100g} unit="g" />
                        <NutritionRow label="지방" value={nutrition.fat_per_100g} unit="g" />
                    </div>

                    <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                        {/* TODO(LEGAL_REVIEW): 면책 문구 법무 검토 필요 */}
                        * 음식군 평균값 기반 추정치이며 실제와 다를 수 있습니다.
                    </p>
                </div>
            )}

            {/* External Link CTA */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
                    구매하기
                </h2>

                <Link
                    href={`/item/${id}/go`}
                    className="
            block w-full py-3 px-4 
            bg-primary-500 text-white text-center font-semibold
            rounded-lg hover:bg-primary-600
            transition-colors duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
          "
                >
                    외부에서 구매하기 →
                </Link>

                <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 text-center">
                    {/* TODO(LEGAL_REVIEW): 제휴 고지 문구 확인 필요 */}
                    외부 링크로 이동합니다. 고지 사항을 확인해주세요.
                </p>
            </div>
        </div>
    );
}

function NutritionRow({
    label,
    value,
    unit
}: {
    label: string;
    value: number;
    unit: string;
}) {
    return (
        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <span className="text-slate-600 dark:text-slate-300">{label}</span>
            <span className="font-semibold text-slate-900 dark:text-white">
                {Math.round(value)}{unit}
            </span>
        </div>
    );
}
