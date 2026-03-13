'use client';

import React, { useId } from 'react';

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
        const generatedId = useId();
        const inputId = id || generatedId;

        return (
            <div className={`w-full ${className}`}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="ui-label mb-1 block"
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
                            ui-input block px-3 py-3 text-base lg:px-4 lg:py-3
                            ${error ? 'ui-input-error' : ''}
                            ${suffix ? 'pr-12' : ''}
                        `}
                        {...props}
                    />
                    {suffix && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-sm text-slate-500">
                                {suffix}
                            </span>
                        </div>
                    )}
                </div>

                {error && (
                    <p className="ui-error mt-1 animate-fade-in">
                        {error}
                    </p>
                )}

                {!error && hint && (
                    <p className="ui-hint mt-1">
                        {hint}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
