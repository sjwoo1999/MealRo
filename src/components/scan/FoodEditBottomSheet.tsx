'use client';

import { useState, useEffect } from 'react';
import { X, Trash2, Check } from 'lucide-react';
import PortionSlider from './PortionSlider';

interface FoodItem {
    id: string;
    name: string;
    calories: number;
    portion: number; // percentage (100 = 1 serving)
}

interface FoodEditBottomSheetProps {
    isOpen: boolean;
    item?: FoodItem;
    onClose: () => void;
    onSave: (updatedItem: FoodItem) => void;
    onDelete: (itemId: string) => void;
}

export default function FoodEditBottomSheet({
    isOpen,
    item,
    onClose,
    onSave,
    onDelete
}: FoodEditBottomSheetProps) {
    const [editedItem, setEditedItem] = useState<FoodItem | null>(null);

    useEffect(() => {
        if (item) {
            setEditedItem({ ...item });
        }
    }, [item]);

    if (!isOpen || !editedItem) return null;

    const handlePortionChange = (newPortion: number) => {
        setEditedItem(prev => prev ? { ...prev, portion: newPortion } : null);
    };

    const handleSave = () => {
        if (editedItem) {
            onSave(editedItem);
            onClose();
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Sheet */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 z-[51] rounded-t-2xl shadow-xl transform transition-transform duration-300 ease-out max-h-[80vh] overflow-y-auto w-full max-w-md mx-auto">

                {/* Drag Handle */}
                <div className="w-full h-6 flex items-center justify-center pt-2">
                    <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>

                <div className="p-5 space-y-6 pb-safe-area-bottom">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">음식 수정</h2>
                        <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Food Name Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">음식 이름</label>
                        <input
                            type="text"
                            value={editedItem.name}
                            onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-lg font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        />
                    </div>

                    {/* Portion Slider */}
                    <PortionSlider
                        value={editedItem.portion}
                        onChange={handlePortionChange}
                    />

                    {/* Live Stats Preview */}
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl flex items-center justify-between">
                        <span className="text-sm text-slate-500">예상 칼로리</span>
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            {Math.round(editedItem.calories * (editedItem.portion / 100))} kcal
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => {
                                if (confirm('이 음식을 목록에서 삭제하시겠습니까?')) {
                                    onDelete(editedItem.id);
                                    onClose();
                                }
                            }}
                            className="flex-none p-4 rounded-xl border border-red-200 bg-red-50 text-red-500 dark:bg-red-900/20 dark:border-red-900 hover:bg-red-100"
                        >
                            <Trash2 className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            저장하기
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
