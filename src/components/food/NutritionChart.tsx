'use client';

import { NutritionData } from '@/types/food';

interface NutritionChartProps {
    nutrition: NutritionData;
    className?: string;
}

// Daily recommended values (일일 권장량 기준)
const DAILY_RECOMMENDED = {
    calories: 2000,
    protein: 50,
    carbohydrates: 300,
    fat: 65,
    sodium: 2300,
    fiber: 25,
};

const NUTRIENT_LABELS: Record<keyof NutritionData, { label: string; unit: string; color: string }> = {
    calories: { label: '칼로리', unit: 'kcal', color: 'bg-amber-500' },
    protein: { label: '단백질', unit: 'g', color: 'bg-rose-500' },
    carbohydrates: { label: '탄수화물', unit: 'g', color: 'bg-blue-500' },
    fat: { label: '지방', unit: 'g', color: 'bg-yellow-500' },
    sodium: { label: '나트륨', unit: 'mg', color: 'bg-purple-500' },
    fiber: { label: '식이섬유', unit: 'g', color: 'bg-green-500' },
};

export default function NutritionChart({ nutrition, className = '' }: NutritionChartProps) {
    // Main macros to display prominently
    const mainNutrients: (keyof NutritionData)[] = ['calories', 'protein', 'carbohydrates', 'fat'];
    const subNutrients: (keyof NutritionData)[] = ['sodium', 'fiber'];

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Main Macros - Bar Chart */}
            <div className="space-y-3">
                {mainNutrients.map((key) => {
                    const value = nutrition[key];
                    const recommended = DAILY_RECOMMENDED[key];
                    const percentage = Math.min((value / recommended) * 100, 100);
                    const { label, unit, color } = NUTRIENT_LABELS[key];

                    return (
                        <div key={key} className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
                                <span className="text-slate-600 dark:text-slate-400">
                                    {value.toLocaleString()}{unit}
                                    <span className="ml-1 text-xs text-slate-400">
                                        ({Math.round(percentage)}%)
                                    </span>
                                </span>
                            </div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${color} rounded-full transition-all duration-500`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Sub Nutrients - Compact */}
            <div className="flex gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                {subNutrients.map((key) => {
                    const value = nutrition[key];
                    const { label, unit, color } = NUTRIENT_LABELS[key];

                    return (
                        <div key={key} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${color}`} />
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                {label}: <span className="font-medium">{value.toLocaleString()}{unit}</span>
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Compact version for card display
export function NutritionMacros({ nutrition, className = '' }: NutritionChartProps) {
    return (
        <div className={`flex gap-3 text-xs ${className}`}>
            <span className="text-rose-600 dark:text-rose-400">
                단백질 {nutrition.protein}g
            </span>
            <span className="text-blue-600 dark:text-blue-400">
                탄수화물 {nutrition.carbohydrates}g
            </span>
            <span className="text-yellow-600 dark:text-yellow-400">
                지방 {nutrition.fat}g
            </span>
        </div>
    );
}
