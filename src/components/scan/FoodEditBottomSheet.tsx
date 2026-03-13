'use client';

import { useEffect, useState } from 'react';
import { Check, Trash2, X } from 'lucide-react';
import { Button } from '@/components/common';
import PortionSlider from './PortionSlider';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';

interface FoodItem {
    id: string;
    name: string;
    calories: number;
    portion: number;
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
    onDelete,
}: FoodEditBottomSheetProps) {
    const [editedItem, setEditedItem] = useState<FoodItem | null>(null);

    useEffect(() => {
        if (item) {
            setEditedItem({ ...item });
        }
    }, [item]);

    if (!isOpen || !editedItem) {
        return null;
    }

    const estimatedCalories = Math.round(editedItem.calories * (editedItem.portion / 100));

    const handleSave = () => {
        onSave(editedItem);
        onClose();
    };

    return (
        <>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent>
                    <div className="flex h-6 items-center justify-center pt-2">
                        <div className="h-1.5 w-12 rounded-full bg-slate-300" />
                    </div>

                    <div className="space-y-5 p-5 pb-safe-area-bottom">
                        <div className="flex items-start justify-between gap-3">
                            <SheetHeader>
                                <SheetTitle>수정하기</SheetTitle>
                                <SheetDescription>이름과 양만 바꿀 수 있어요.</SheetDescription>
                            </SheetHeader>
                            <button type="button" onClick={onClose} className="p-2 -mr-2 text-slate-500 hover:text-slate-700" aria-label="닫기">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">이름</label>
                            <input
                                type="text"
                                value={editedItem.name}
                                onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                                className="w-full rounded-[16px] border border-black bg-white px-4 py-3 text-lg font-medium text-slate-900 outline-none"
                            />
                        </div>

                        <PortionSlider
                            value={editedItem.portion}
                            onChange={(portion) => setEditedItem((prev) => (prev ? { ...prev, portion } : null))}
                        />

                        <div className="flex items-center justify-between rounded-[18px] border border-black bg-[#f7f7f7] p-4">
                            <span className="text-sm text-slate-500">칼로리</span>
                            <span className="text-lg font-bold text-slate-900">{estimatedCalories} kcal</span>
                        </div>

                        <SheetFooter>
                            <Button
                                type="button"
                                onClick={() => {
                                    if (confirm('이 음식을 목록에서 삭제하시겠습니까?')) {
                                        onDelete(editedItem.id);
                                        onClose();
                                    }
                                }}
                                variant="outline"
                                className="flex-none border-black bg-white px-4 text-slate-900 shadow-none"
                                aria-label="삭제"
                            >
                                <Trash2 className="h-6 w-6" />
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSave}
                                size="lg"
                                className="flex-1 border border-black bg-black text-white shadow-none"
                                leftIcon={<Check className="h-5 w-5" />}
                            >
                                저장하기
                            </Button>
                        </SheetFooter>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
