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
                <label className="ui-label mb-2 block">
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
                                relative flex w-full items-center rounded-[18px] border border-black bg-white p-4 text-left
                                ${isSelected
                                    ? 'bg-black text-white'
                                    : ''
                                }
                                ${layout === 'horizontal' ? 'min-w-[120px] justify-center flex-col text-center' : ''}
                            `}
                        >
                            {isSelected && layout !== 'horizontal' && (
                                <div className="absolute top-3 right-3 text-white">
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
                                <div className={`font-medium ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                    {option.label}
                                </div>
                                {option.description && (
                                    <div className={`mt-0.5 text-xs ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                                        {option.description}
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {error && (
                <p className="ui-error mt-1 animate-fade-in">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Select;
