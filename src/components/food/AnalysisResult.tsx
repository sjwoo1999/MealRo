'use client';

import { useState } from 'react';
import { FoodData, needsVerification, hasMultipleFoods } from '@/types/food';
import NutritionChart, { NutritionMacros } from './NutritionChart';

interface AnalysisResultProps {
    data: FoodData | { foods: FoodData[] };
    processingTimeMs?: number;
    onEdit?: (editedData: FoodData | { foods: FoodData[] }) => void;
    onSave?: () => void;
}

export default function AnalysisResult({ data, processingTimeMs, onEdit, onSave }: AnalysisResultProps) {
    const foods = hasMultipleFoods(data) ? data.foods : [data];
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    // Calculate totals for multiple foods
    const totals = foods.reduce(
        (acc, food) => ({
            calories: acc.calories + food.nutrition.calories,
            protein: acc.protein + food.nutrition.protein,
            carbohydrates: acc.carbohydrates + food.nutrition.carbohydrates,
            fat: acc.fat + food.nutrition.fat,
            sodium: acc.sodium + food.nutrition.sodium,
            fiber: acc.fiber + food.nutrition.fiber,
        }),
        { calories: 0, protein: 0, carbohydrates: 0, fat: 0, sodium: 0, fiber: 0 }
    );

    return (
        <div className="space-y-4">
            {/* Individual Foods */}
            <div className="space-y-3">
                {foods.map((food, index) => (
                    <FoodCard
                        key={index}
                        food={food}
                        isEditing={editingIndex === index}
                        onEditStart={() => setEditingIndex(index)}
                        onEditEnd={() => setEditingIndex(null)}
                        onSave={(editedFood) => {
                            if (onEdit) {
                                const newFoods = [...foods];
                                newFoods[index] = editedFood;
                                onEdit(foods.length > 1 ? { foods: newFoods } : editedFood);
                            }
                            setEditingIndex(null);
                        }}
                    />
                ))}
            </div>

            {/* Totals (if multiple foods) */}
            {foods.length > 1 && (
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 text-white">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">총 영양 정보</span>
                        <span className="text-2xl font-bold">{totals.calories.toLocaleString()} kcal</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-orange-100">
                        <span>단백질 {totals.protein}g</span>
                        <span>탄수화물 {totals.carbohydrates}g</span>
                        <span>지방 {totals.fat}g</span>
                    </div>
                </div>
            )}

            {/* Single food total */}
            {foods.length === 1 && (
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 text-white">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">영양 정보</span>
                        <span className="text-2xl font-bold">{foods[0].nutrition.calories.toLocaleString()} kcal</span>
                    </div>
                    <NutritionMacros
                        nutrition={foods[0].nutrition}
                        className="mt-2 text-orange-100"
                    />
                </div>
            )}

            {/* Processing time */}
            {processingTimeMs && (
                <p className="text-xs text-slate-400 text-center">
                    ⏱️ 분석 시간: {processingTimeMs}ms
                </p>
            )}

            {/* Save button */}
            {onSave && (
                <button
                    onClick={onSave}
                    className="w-full py-3 bg-primary-500 text-white font-medium rounded-xl
                        hover:bg-primary-600 transition-colors"
                >
                    식사 기록 저장
                </button>
            )}
        </div>
    );
}

// Individual Food Card
interface FoodCardProps {
    food: FoodData;
    isEditing: boolean;
    onEditStart: () => void;
    onEditEnd: () => void;
    onSave: (food: FoodData) => void;
}

function FoodCard({ food, isEditing, onEditStart, onEditEnd, onSave }: FoodCardProps) {
    const [editedFood, setEditedFood] = useState(food);
    const needsCheck = needsVerification(food.confidence);

    if (isEditing) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-primary-300 dark:border-primary-600 p-4 space-y-3">
                <input
                    type="text"
                    value={editedFood.food_name}
                    onChange={(e) => setEditedFood({ ...editedFood, food_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg
                        bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    placeholder="음식명"
                />
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="number"
                        value={editedFood.nutrition.calories}
                        onChange={(e) => setEditedFood({
                            ...editedFood,
                            nutrition: { ...editedFood.nutrition, calories: Number(e.target.value) }
                        })}
                        className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm
                            bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        placeholder="칼로리"
                    />
                    <input
                        type="number"
                        value={editedFood.nutrition.protein}
                        onChange={(e) => setEditedFood({
                            ...editedFood,
                            nutrition: { ...editedFood.nutrition, protein: Number(e.target.value) }
                        })}
                        className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm
                            bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        placeholder="단백질(g)"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onSave(editedFood)}
                        className="flex-1 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium"
                    >
                        저장
                    </button>
                    <button
                        onClick={onEditEnd}
                        className="flex-1 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
                    >
                        취소
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <p className="font-semibold text-lg text-slate-900 dark:text-white">
                            {food.food_name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {food.serving_size}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Confidence Badge */}
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${needsCheck
                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                }`}
                        >
                            {needsCheck ? '⚠️ 확인 필요' : '✓ 확인됨'}
                        </span>
                        {/* Edit button */}
                        <button
                            onClick={onEditStart}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            aria-label="수정"
                        >
                            ✏️
                        </button>
                    </div>
                </div>

                {/* Nutrition Chart */}
                <NutritionChart nutrition={food.nutrition} />

                {/* Tags */}
                {food.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                        {food.tags.map((tag, i) => (
                            <span
                                key={i}
                                className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full text-xs text-slate-600 dark:text-slate-400"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Warnings */}
                {food.warnings.length > 0 && (
                    <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <p className="text-xs text-red-600 dark:text-red-400">
                            ⚠️ {food.warnings.join(', ')}
                        </p>
                    </div>
                )}

                {/* Ingredients */}
                {food.ingredients.length > 0 && (
                    <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-medium">재료:</span> {food.ingredients.join(', ')}
                    </div>
                )}
            </div>
        </div>
    );
}
