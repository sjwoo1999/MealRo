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
        lg: 'p-8',
    };

    const hoverClass = hover
        ? 'ui-card-hover cursor-pointer'
        : '';

    return (
        <div
            onClick={onClick}
            className={`
                ui-card
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
