'use client';

import React from 'react';
import { MealSlot } from '@/types/planner';
interface MealSlotPickerProps {
    value?: MealSlot;
    onChange: (value: MealSlot) => void;
}

const MealSlotPicker = ({ value, onChange }: MealSlotPickerProps) => {
    return (
        <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
            {[
                { value: 'breakfast', label: '아침', emoji: '🌅' },
                { value: 'lunch', label: '점심', emoji: '☀️' },
                { value: 'dinner', label: '저녁', emoji: '🌙' },
            ].map((option) => {
                const isSelected = value === option.value;
                return (
                    <button
                        type="button"
                        key={option.value}
                        className={`ui-card flex min-h-28 flex-col items-center justify-center border p-4 text-center transition-colors ${
                            isSelected ? 'bg-black text-white' : 'bg-surface text-copy'
                        }`}
                        onClick={() => onChange(option.value as MealSlot)}
                    >
                        <span className="text-xl">{option.emoji}</span>
                        <span className="mt-2 text-base font-semibold">{option.label}</span>
                        <span className={`mt-2 text-[11px] uppercase tracking-[0.18em] ${isSelected ? 'text-white/70' : 'text-copy-subtle'}`}>
                            {isSelected ? 'Selected' : 'Choose'}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default MealSlotPicker;
