'use client';

import React from 'react';

interface CardProps {
    children: React.ReactNode;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
    onClick?: () => void;
    className?: string;
}

const Card = ({
    children,
    padding = 'md',
    hover = false,
    onClick,
    className = '',
}: CardProps) => {
    const paddingClasses = {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
    };

    const hoverClass = hover
        ? 'hover:shadow-md hover:border-green-200 dark:hover:border-slate-600 cursor-pointer transition-all duration-200'
        : '';

    return (
        <div
            onClick={onClick}
            className={`
                bg-white dark:bg-slate-800 
                border border-slate-200 dark:border-slate-700 
                rounded-xl shadow-sm 
                ${paddingClasses[padding]} 
                ${hoverClass}
                ${className}
            `}
        >
            {children}
        </div>
    );
};

export default Card;
