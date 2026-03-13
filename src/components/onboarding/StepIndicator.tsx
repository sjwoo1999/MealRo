'use client';

import React from 'react';

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
    return (
        <div className="mb-8 flex items-center justify-center space-x-2">
            {Array.from({ length: totalSteps }).map((_, index) => {
                const step = index + 1;
                const isCompleted = step < currentStep;
                const isCurrent = step === currentStep;

                return (
                    <React.Fragment key={step}>
                        <div
                            className={`relative flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold transition-colors ${
                                isCompleted || isCurrent
                                    ? 'border-black bg-black text-white'
                                    : 'border-black bg-white text-slate-400'
                            }`}
                        >
                            {isCompleted ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <span className="text-sm font-bold">{step}</span>
                            )}
                        </div>

                        {step < totalSteps && (
                            <div className="mx-2 h-0.5 w-8 flex-1 bg-black/10 sm:w-16">
                                <div
                                    className="h-full bg-black transition-all duration-500 ease-out"
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
