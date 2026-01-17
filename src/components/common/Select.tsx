'use client';

import React from 'react';

interface SelectOption {
    value: string;
    label: string;
    description?: string;
    emoji?: string;
}

interface SelectProps {
    label?: string;
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    error?: string;
    layout?: 'vertical' | 'horizontal' | 'grid';
}

const Select = ({
    label,
    options,
    value,
    onChange,
    error,
    layout = 'vertical',
}: SelectProps) => {
    const layoutClasses = {
        vertical: 'space-y-3',
        horizontal: 'flex gap-3 overflow-x-auto pb-2',
        grid: 'grid grid-cols-2 gap-3',
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {label}
                </label>
            )}

            <div className={layoutClasses[layout]}>
                {options.map((option) => {
                    const isSelected = value === option.value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            className={`
                                relative flex items-center p-4 rounded-xl border-2 transition-all duration-200 text-left w-full
                                ${isSelected
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm'
                                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-green-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }
                                ${layout === 'horizontal' ? 'min-w-[120px] justify-center flex-col text-center' : ''}
                            `}
                        >
                            {/* Check Icon for Selected State */}
                            {isSelected && layout !== 'horizontal' && (
                                <div className="absolute top-3 right-3 text-green-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}

                            {option.emoji && (
                                <span className={`text-2xl ${layout === 'horizontal' ? 'mb-2' : 'mr-3'}`}>
                                    {option.emoji}
                                </span>
                            )}

                            <div>
                                <div className={`font-medium ${isSelected ? 'text-green-800 dark:text-green-300' : 'text-slate-900 dark:text-white'}`}>
                                    {option.label}
                                </div>
                                {option.description && (
                                    <div className={`text-xs mt-0.5 ${isSelected ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {option.description}
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {error && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400 animate-fade-in">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Select;
