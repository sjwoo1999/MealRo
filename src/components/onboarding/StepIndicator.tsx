'use client';

import React from 'react';

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
    return (
        <div className="flex items-center justify-center space-x-2 mb-8">
            {Array.from({ length: totalSteps }).map((_, index) => {
                const step = index + 1;
                const isCompleted = step < currentStep;
                const isCurrent = step === currentStep;

                return (
                    <React.Fragment key={step}>
                        {/* Circle */}
                        <div
                            className={`
                                relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300
                                ${isCompleted ? 'bg-green-500 text-white' : ''}
                                ${isCurrent ? 'bg-green-500 text-white ring-4 ring-green-100 dark:ring-green-900 animate-pulse-ring' : ''}
                                ${!isCompleted && !isCurrent ? 'bg-slate-200 dark:bg-slate-700 text-slate-400' : ''}
                            `}
                        >
                            {isCompleted ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <span className="text-sm font-bold">{step}</span>
                            )}
                        </div>

                        {/* Connector Line */}
                        {step < totalSteps && (
                            <div className="flex-1 w-8 sm:w-16 h-0.5 bg-slate-200 dark:bg-slate-700 mx-2">
                                <div
                                    className={`h-full bg-green-500 transition-all duration-500 ease-out`}
                                    style={{
                                        width: isCompleted ? '100%' : '0%'
                                    }}
                                />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default StepIndicator;
