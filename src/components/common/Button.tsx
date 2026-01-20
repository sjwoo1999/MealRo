'use client';

import React from 'react';
import { Size, Variant } from '@/types/common';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    fullWidth?: boolean;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className = '',
            variant = 'primary',
            size = 'md',
            fullWidth = false,
            disabled,
            loading = false,
            leftIcon,
            rightIcon,
            children,
            type = 'button',
            ...props
        },
        ref
    ) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

        const variants = {
            primary: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500',
            secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 focus:ring-slate-500',
            outline: 'border-2 border-green-500 text-green-600 hover:bg-green-50 focus:ring-green-500',
            ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 focus:ring-slate-400',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-xs lg:px-4 lg:py-2 lg:text-sm',
            md: 'px-4 py-2 text-sm lg:px-5 lg:py-2.5 lg:text-base',
            lg: 'px-6 py-3 text-base lg:px-8 lg:py-3.5 lg:text-lg',
        };

        const widthClass = fullWidth ? 'w-full' : '';

        return (
            <button
                ref={ref}
                type={type}
                className={`
                    ${baseStyles}
                    ${variants[variant]}
                    ${sizes[size]}
                    ${widthClass}
                    ${className}
                `}
                disabled={disabled || loading}
                {...props}
            >
                {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
                {children}
                {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
