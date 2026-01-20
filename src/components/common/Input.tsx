'use client';

import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label?: string;
    value: string | number;
    onChange: (value: string) => void;
    error?: string;
    hint?: string;
    suffix?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className = '',
            label,
            value,
            onChange,
            error,
            hint,
            suffix,
            required,
            disabled,
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className={`w-full ${className}`}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                        {label} {required && <span className="text-red-500">*</span>}
                    </label>
                )}

                <div className="relative">
                    <input
                        ref={ref}
                        id={inputId}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        className={`
                            block w-full rounded-lg px-3 py-2 lg:px-4 lg:py-2.5
                            bg-white dark:bg-slate-800
                            border transition-colors
                            placeholder:text-slate-400 dark:placeholder:text-slate-500
                            focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-900
                            ${error
                                ? 'border-red-500 text-red-900 focus:border-red-500 focus:ring-red-200'
                                : 'border-slate-300 dark:border-slate-600 focus:border-green-500 focus:ring-green-500/20 text-slate-900 dark:text-white'
                            }
                            ${suffix ? 'pr-12' : ''}
                        `}
                        {...props}
                    />
                    {suffix && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-slate-500 dark:text-slate-400 sm:text-sm">
                                {suffix}
                            </span>
                        </div>
                    )}
                </div>

                {error && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 animate-fade-in">
                        {error}
                    </p>
                )}

                {!error && hint && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {hint}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
