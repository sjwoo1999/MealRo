'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Edit2, RotateCcw } from 'lucide-react';
import { FoodData, hasMultipleFoods } from '@/types/food';
import BoundingBoxOverlay from './BoundingBoxOverlay';
import FoodEditBottomSheet from './FoodEditBottomSheet';
import { Button, Card } from '@/components/common';

interface FoodAnalysisResultProps {
    imageSrc: string;
    data: FoodData | { foods: FoodData[] };
    onSave: (data: FoodData | { foods: FoodData[] }) => void;
    onRetake: () => void;
    mealLabel?: string;
}

interface VisualFoodData extends FoodData {
    id: string;
    portion: number;
}

const normalizeFoods = (data: FoodData | { foods: FoodData[] }): VisualFoodData[] => {
    if (hasMultipleFoods(data)) {
        return data.foods.map((food, index) => ({
            ...food,
            id: `food-${index}`,
            portion: 100,
        }));
    }

    return [
        {
            ...data,
            id: 'food-0',
            portion: 100,
        },
    ];
};

export default function FoodAnalysisResult({
    imageSrc,
    data,
    onSave,
    onRetake,
    mealLabel,
}: FoodAnalysisResultProps) {
    const [foods, setFoods] = useState<VisualFoodData[]>(() => normalizeFoods(data));
    const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | undefined>(undefined);

    const totals = foods.reduce((acc, food) => ({
        calories: acc.calories + Math.round(food.nutrition.calories),
        carbohydrates: acc.carbohydrates + food.nutrition.carbohydrates,
        protein: acc.protein + food.nutrition.protein,
        fat: acc.fat + food.nutrition.fat,
    }), {
        calories: 0,
        carbohydrates: 0,
        protein: 0,
        fat: 0,
    });

    const boxes = useMemo(() => {
        return foods.map((food, index) => {
            const name = food.food_name;
            let coords = { x: 0, y: 0, width: 0, height: 0 };

            if (name.includes('떡볶이')) {
                coords = { x: 0.05, y: 0.5, width: 0.45, height: 0.45 };
            } else if (name.includes('튀김')) {
                coords = { x: 0.05, y: 0.05, width: 0.45, height: 0.4 };
            } else if (name.includes('순대')) {
                coords = { x: 0.55, y: 0.05, width: 0.4, height: 0.9 };
            } else {
                coords = {
                    x: foods.length === 1 ? 0.25 : ((index % 2) * 0.5) + 0.05,
                    y: foods.length === 1 ? 0.25 : (Math.floor(index / 2) * 0.45) + 0.05,
                    width: foods.length === 1 ? 0.5 : 0.4,
                    height: foods.length === 1 ? 0.5 : 0.4,
                };
            }

            return {
                id: food.id,
                label: food.food_name,
                ...coords,
            };
        });
    }, [foods]);

    const handleEditSave = (updatedItem: { id: string; name: string; calories: number; portion: number }) => {
        setFoods((prev) => prev.map((food) => {
            if (food.id !== updatedItem.id) {
                return food;
            }

            const currentPortion = food.portion || 100;
            const nextPortion = updatedItem.portion || 100;
            const portionRatio = currentPortion === 0 ? 1 : nextPortion / currentPortion;

            return {
                ...food,
                food_name: updatedItem.name,
                nutrition: {
                    ...food.nutrition,
                    calories: Math.round(food.nutrition.calories * portionRatio),
                    carbohydrates: Math.round(food.nutrition.carbohydrates * portionRatio * 10) / 10,
                    protein: Math.round(food.nutrition.protein * portionRatio * 10) / 10,
                    fat: Math.round(food.nutrition.fat * portionRatio * 10) / 10,
                    sodium: Math.round(food.nutrition.sodium * portionRatio),
                    fiber: Math.round(food.nutrition.fiber * portionRatio * 10) / 10,
                },
                portion: nextPortion,
            };
        }));
        setSelectedFoodId(null);
    };

    const handleConfirm = () => {
        const finalData = foods.length === 1 ? foods[0] : { foods };
        onSave(finalData);
    };

    const selectedFood = foods.find((food) => food.id === selectedFoodId);

    return (
        <>
            <div className="space-y-4">
                <Card padding="lg" className="border border-black shadow-none">
                    <h3 className="text-xl font-semibold text-slate-900">
                        {mealLabel ? `${mealLabel} 결과` : '분석 결과'}
                    </h3>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-black bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-900">
                            {totals.calories.toLocaleString()} kcal
                        </span>
                        <span className="rounded-full border border-black bg-white px-3 py-1.5 text-sm font-medium text-slate-700">
                            {foods.length}개 인식
                        </span>
                        <span className="rounded-full border border-black bg-white px-3 py-1.5 text-sm font-medium text-slate-700">
                            저장 전
                        </span>
                    </div>
                </Card>

                <Card padding="none" className="overflow-hidden border border-black shadow-none">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#f3f3f3]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imageSrc}
                            alt="Analysis"
                            className="h-full w-full object-contain"
                            onLoad={(event) => {
                                const image = event.currentTarget;
                                setImageDimensions({
                                    width: image.naturalWidth,
                                    height: image.naturalHeight,
                                });
                            }}
                        />

                        <BoundingBoxOverlay
                            boxes={boxes}
                            onBoxClick={setSelectedFoodId}
                            imageDimensions={imageDimensions}
                            objectFit="contain"
                        />

                        <div className="absolute left-4 top-4 rounded-full border border-black bg-white px-3 py-1.5 text-xs font-semibold text-slate-900">
                            눌러서 수정
                        </div>
                    </div>
                </Card>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)]">
                    <Card padding="lg" className="border border-black shadow-none">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h4 className="text-base font-semibold text-slate-900">인식된 음식</h4>
                            </div>
                            <button
                                type="button"
                                onClick={onRetake}
                                className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
                            >
                                다시 촬영
                            </button>
                        </div>

                        <div className="mt-4 space-y-3">
                            {foods.map((food) => (
                                <button
                                    key={food.id}
                                    type="button"
                                    onClick={() => setSelectedFoodId(food.id)}
                                    className="flex w-full items-start justify-between gap-3 rounded-[20px] border border-black bg-[#f7f7f7] p-4 text-left"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-slate-900">{food.food_name}</p>
                                            <span className="text-sm font-semibold text-slate-700">
                                                {Math.round(food.nutrition.calories)} kcal
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-slate-600">
                                            {food.serving_size} · 탄수 {Math.round(food.nutrition.carbohydrates)}g · 단백질 {Math.round(food.nutrition.protein)}g · 지방 {Math.round(food.nutrition.fat)}g
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <Edit2 className="h-4 w-4 text-slate-400" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Card>

                    <div className="space-y-4">
                        <Card padding="lg" className="border border-black shadow-none">
                            <h4 className="text-base font-semibold text-slate-900">영양 요약</h4>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <MetricCard label="탄수화물" value={`${Math.round(totals.carbohydrates)} g`} compact />
                                <MetricCard label="단백질" value={`${Math.round(totals.protein)} g`} compact />
                                <MetricCard label="지방" value={`${Math.round(totals.fat)} g`} compact />
                                <MetricCard label="기록 상태" value="준비 완료" compact />
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <Button
                        variant="outline"
                        size="lg"
                        leftIcon={<RotateCcw className="h-4 w-4" />}
                        onClick={onRetake}
                        className="border-black bg-white shadow-none"
                    >
                        사진 다시 선택
                    </Button>
                    <Button
                        size="lg"
                        leftIcon={<CheckCircle2 className="h-4 w-4" />}
                        onClick={handleConfirm}
                        className="border border-black bg-black text-white shadow-none"
                    >
                        기록하기
                    </Button>
                </div>
            </div>

            <FoodEditBottomSheet
                isOpen={!!selectedFood}
                item={selectedFood ? {
                    id: selectedFood.id,
                    name: selectedFood.food_name,
                    calories: selectedFood.nutrition.calories,
                    portion: selectedFood.portion || 100,
                } : undefined}
                onClose={() => setSelectedFoodId(null)}
                onSave={handleEditSave}
                onDelete={(id) => {
                    if (foods.length > 1) {
                        setFoods((prev) => prev.filter((food) => food.id !== id));
                        return;
                    }

                    alert('최소 1개의 음식은 있어야 합니다.');
                }}
            />
        </>
    );
}

function MetricCard({
    label,
    value,
    compact = false,
}: {
    label: string;
    value: string;
    compact?: boolean;
}) {
    return (
        <div className={compact ? 'rounded-[18px] border border-black bg-[#f7f7f7] p-4' : 'rounded-[20px] border border-black bg-[#f7f7f7] p-4'}>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
        </div>
    );
}
