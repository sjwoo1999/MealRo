'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input, Card } from '@/components/common';
import { SelectedMenu, MealSlot } from '@/types/planner';

interface MenuSelectorProps {
    onSelect: (menu: SelectedMenu) => void;
    currentSlot: MealSlot;
}

const MenuSelector = ({ onSelect, currentSlot }: MenuSelectorProps) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/planner/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                if (data.success) {
                    setResults(data.data);
                }
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => {
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        };
    }, [query]);

    const handleSelect = (item: any) => {
        setSelectedItem(item);
        setQuery(item.name);
        setResults([]);

        onSelect({
            id: item.id,
            name: item.name,
            mealSlot: currentSlot,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat
        });
    };

    return (
        <div className="relative animate-fade-in-up">
            <Input
                label="무엇을 드셨나요?"
                value={query}
                onChange={setQuery}
                placeholder="음식 이름 검색 (예: 김치찌개)"
                hint={selectedItem ? `선택됨: ${selectedItem.calories}kcal` : undefined}
            />

            {/* Results Dropdown */}
            {results.length > 0 && !selectedItem && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 max-h-60 overflow-y-auto">
                    {results.map((item) => (
                        <div
                            key={item.id}
                            className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-b border-slate-50 dark:border-slate-700 last:border-none"
                            onClick={() => handleSelect(item)}
                        >
                            <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{item.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                {item.calories}kcal • 캐:{item.category}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isLoading && (
                <div className="absolute top-[38px] right-3">
                    <div className="animate-spin h-4 w-4 border-2 border-primary-500 rounded-full border-t-transparent"></div>
                </div>
            )}
        </div>
    );
};

export default MenuSelector;
