'use client';

import React from 'react';
import { MealSlot } from '@/types/planner';
import { Card } from '@/components/common';

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
                    <Card
                        key={option.value}
                        className={`
                            flex flex-col items-center justify-center p-4 cursor-pointer border-2 transition-all
                            ${isSelected
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                            }
                        `}
                        onClick={() => onChange(option.value as MealSlot)}
                    >
                        <span className="text-2xl mb-1">{option.emoji}</span>
                        <span className={`font-medium text-sm ${isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-slate-600 dark:text-slate-400'}`}>
                            {option.label}
                        </span>
                    </Card>
                );
            })}
        </div>
    );
};

export default MealSlotPicker;
