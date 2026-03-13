'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/common';
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
                label="기준 메뉴"
                value={query}
                onChange={setQuery}
                placeholder="예: 김치찌개"
                hint={selectedItem ? `선택됨: ${selectedItem.calories}kcal` : undefined}
            />

            {!query.trim() && (
                <div className="mt-3 rounded-[20px] border border-black bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Search className="h-4 w-4" />
                        <span>검색해서 기준 메뉴를 하나 고르세요.</span>
                    </div>
                </div>
            )}

            {results.length > 0 && !selectedItem && (
                <div className="absolute z-10 mt-2 max-h-72 w-full overflow-y-auto rounded-[20px] border border-black bg-white">
                    {results.map((item) => (
                        <button
                            type="button"
                            key={item.id}
                            className="block w-full border-b border-black/10 p-4 text-left transition-colors hover:bg-slate-50 last:border-none"
                            onClick={() => handleSelect(item)}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="font-bold text-sm text-slate-800">{item.name}</div>
                                    <div className="mt-1 text-xs text-slate-500">
                                        카테고리 {item.category}
                                    </div>
                                </div>
                                <div className="text-right text-xs text-slate-500">
                                    <div>{item.calories}kcal</div>
                                    <div className="mt-1">단백질 {item.protein}g</div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {isLoading && (
                <div className="absolute top-[38px] right-3">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                </div>
            )}
        </div>
    );
};

export default MenuSelector;
