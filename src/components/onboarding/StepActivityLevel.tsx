'use client';

import React from 'react';
import { ActivityLevel, ACTIVITY_LEVEL_OPTIONS } from '@/types/user';
import { Select } from '@/components/common';

interface StepActivityLevelProps {
    value?: ActivityLevel;
    onChange: (value: ActivityLevel) => void;
    error?: string;
}

const StepActivityLevel = ({ value, onChange, error }: StepActivityLevelProps) => {
    return (
        <div className="animate-fade-in-up">
            <div className="mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Step 3</p>
                <p className="mt-2 text-sm font-medium text-slate-900">평소 활동량을 고르세요</p>
            </div>
            <Select
                label="활동량"
                options={ACTIVITY_LEVEL_OPTIONS}
                value={value || ''}
                onChange={(val) => onChange(val as ActivityLevel)}
                error={error}
            />
            <p className="mt-4 px-1 text-xs text-slate-500">
                활동량은 하루 권장 칼로리 계산에 가장 큰 영향을 줍니다.
            </p>
        </div>
    );
};

export default StepActivityLevel;
