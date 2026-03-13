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
                { value: 'breakfast', label: '아침' },
                { value: 'lunch', label: '점심' },
                { value: 'dinner', label: '저녁' },
            ].map((option) => {
                const isSelected = value === option.value;
                return (
                    <button
                        type="button"
                        key={option.value}
                        className={`ui-card flex min-h-24 flex-col items-center justify-center border p-4 text-center transition-colors ${
                            isSelected ? 'bg-black text-white' : 'bg-white text-slate-900'
                        }`}
                        onClick={() => onChange(option.value as MealSlot)}
                    >
                        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
                            Meal
                        </span>
                        <span className="mt-2 text-base font-semibold">{option.label}</span>
                        <span className={`mt-2 text-[11px] uppercase tracking-[0.16em] ${isSelected ? 'text-white/70' : 'text-slate-500'}`}>
                            {isSelected ? 'Selected' : 'Choose'}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default MealSlotPicker;
