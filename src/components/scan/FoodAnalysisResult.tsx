'use client';

import { useState, useMemo } from 'react';
import { FoodData, hasMultipleFoods } from '@/types/food';
import BoundingBoxOverlay from './BoundingBoxOverlay';
import FoodEditBottomSheet from './FoodEditBottomSheet';
import { Edit2 } from 'lucide-react';

interface FoodAnalysisResultProps {
    imageSrc: string;
    data: FoodData | { foods: FoodData[] };
    onSave: (data: FoodData | { foods: FoodData[] }) => void;
    onRetake: () => void;
}

// Extended type for local state with visual properties
interface VisualFoodData extends FoodData {
    id: string;
    portion: number; // Percentage (default 100)
}

// Helper to normalized single/multi structure
const normalizeFoods = (data: FoodData | { foods: FoodData[] }): VisualFoodData[] => {
    if (hasMultipleFoods(data)) {
        return data.foods.map((f, i) => ({
            ...f,
            id: `food-${i}`,
            portion: 100
        }));
    }
    return [{
        ...data,
        id: 'food-0',
        portion: 100
    }];
};

export default function FoodAnalysisResult({ imageSrc, data, onSave, onRetake }: FoodAnalysisResultProps) {
    // Local state for optimistic updates
    const [foods, setFoods] = useState<VisualFoodData[]>(() => normalizeFoods(data));
    const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | undefined>(undefined);

    // Totals
    const totalCalories = foods.reduce((sum, f) => sum + Math.round(f.nutrition.calories), 0);

    // Mock Bounding Boxes (Since API v1 doesn't return coordinates yet)
    // We distribute them evenly for demo purposes
    // Mock Bounding Boxes (Since API v1 doesn't return coordinates yet)
    // We try to distribute them in a way that likely matches a "Set Menu" (Tteokbokki/Fried/Sundae)
    const boxes = useMemo(() => {
        // If we have exactly 3 items, assume it's the demo set
        if (foods.length === 3) {
            return [
                {
                    id: foods[0].id || 'food-0',
                    label: foods[0].food_name, // e.g. 떡볶이
                    // Bottom-Left area
                    x: 0.05, y: 0.5, width: 0.45, height: 0.45
                },
                {
                    id: foods[1].id || 'food-1',
                    label: foods[1].food_name, // e.g. 모둠 튀김
                    // Top-Left area
                    x: 0.05, y: 0.05, width: 0.45, height: 0.4
                },
                {
                    id: foods[2].id || 'food-2',
                    label: foods[2].food_name, // e.g. 순대
                    // Right area (tall)
                    x: 0.55, y: 0.05, width: 0.4, height: 0.9
                }
            ];
        }

        // Fallback for other counts: Grid distribution
        return foods.map((food, index) => ({
            id: food.id || `food-${index}`,
            label: food.food_name,
            x: foods.length === 1 ? 0.25 : ((index % 2) * 0.5) + 0.05,
            y: foods.length === 1 ? 0.25 : (Math.floor(index / 2) * 0.45) + 0.05,
            width: foods.length === 1 ? 0.5 : 0.4,
            height: foods.length === 1 ? 0.5 : 0.4,
        }));
    }, [foods]);

    const handleEditSave = (updatedItem: any) => {
        setFoods(prev => prev.map(f => {
            if (f.id === updatedItem.id) {
                // Recalculate nutrition based on portion ratio change
                // Logic: newCalories = (baseCalories / oldPortion) * newPortion
                // But simplify: We store 'portion' as metadata. 
                // In real app, we might need base 100g values. 
                // Here, we just scale the CURRENT values if we tracked base values, 
                // OR we assume the input `calories` is the 100% value.
                // Let's assume the editing sheet returns the SCALED values or we calculate here.

                // For MVP: The BottomSheet updates the 'portion' field.
                // We should ideally revert to base if portion changes.
                // Let's just update the name and assume portion scaling logic is visual for now or simplistic.

                const ratio = updatedItem.portion / 100;
                // Note: In a real app, you'd store unit_nutrition and multiply. 
                // For this UI demo, we will update the displayed calories directly.

                return {
                    ...f,
                    food_name: updatedItem.name,
                    nutrition: {
                        ...f.nutrition,
                        // Simple hack: if portion changed, we'd need base values. 
                        // Let's just update calories for display
                        calories: Math.round(f.nutrition.calories * (updatedItem.portion / (f.portion || 100) || 1))
                    },
                    portion: updatedItem.portion
                };
            }
            return f;
        }));
        setSelectedFoodId(null);
    };

    const handleConfirm = () => {
        // Reconstruct original format
        const finalData = foods.length === 1 ? foods[0] : { foods };
        onSave(finalData);
    };

    const selectedFood = foods.find(f => f.id === selectedFoodId);

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 pb-20">

            {/* 1. Visual Analysis View */}
            <div className="relative w-full aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageSrc}
                    alt="Analysis"
                    className="w-full h-full object-contain"
                    onLoad={(e) => {
                        const img = e.currentTarget;
                        setImageDimensions({
                            width: img.naturalWidth,
                            height: img.naturalHeight
                        });
                    }}
                />

                {/* Bounding Boxes */}
                <BoundingBoxOverlay
                    boxes={boxes}
                    onBoxClick={setSelectedFoodId}
                    imageDimensions={imageDimensions}
                    objectFit="contain"
                />

                {/* Total Overlay */}
                <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full backdrop-blur-md text-sm font-bold">
                    Total {totalCalories.toLocaleString()} kcal
                </div>
            </div>

            {/* 2. List Summary (Tap items to edit as well) */}
            <div className="flex-1 p-5 space-y-4 overflow-y-auto">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">분석 결과 ({foods.length})</h3>
                    <button onClick={onRetake} className="text-sm text-slate-500 hover:text-slate-800">
                        다시 찍기
                    </button>
                </div>

                <div className="space-y-3">
                    {foods.map((food) => (
                        <div
                            key={food.id}
                            onClick={() => setSelectedFoodId(food.id!)}
                            className="flex justify-between items-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-800 active:scale-[0.98] transition-transform cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                                    {Math.round(food.nutrition.calories)}
                                </div>
                                <div>
                                    <p className="font-bold">{food.food_name}</p>
                                    <p className="text-xs text-slate-500">
                                        탄 {food.nutrition.carbohydrates} · 단 {food.nutrition.protein} · 지 {food.nutrition.fat}
                                    </p>
                                </div>
                            </div>
                            <Edit2 className="w-4 h-4 text-slate-300" />
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Bottom Fixed Action */}
            <div className="fixed bottom-0 left-0 right-0 p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 max-w-md mx-auto">
                <button
                    onClick={handleConfirm}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 text-lg"
                >
                    이대로 기록하기
                </button>
            </div>

            {/* 4. Edit Sheet */}
            <FoodEditBottomSheet
                isOpen={!!selectedFood}
                item={selectedFood ? {
                    id: selectedFood.id!,
                    name: selectedFood.food_name,
                    calories: selectedFood.nutrition.calories,
                    portion: (selectedFood as any).portion || 100
                } : undefined}
                onClose={() => setSelectedFoodId(null)}
                onSave={handleEditSave}
                onDelete={(id) => {
                    if (foods.length > 1) {
                        setFoods(prev => prev.filter(f => f.id !== id));
                    } else {
                        alert("최소 1개의 음식은 있어야 합니다.");
                    }
                }}
            />
        </div>
    );
}
