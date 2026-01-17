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
            <Select
                label="평소 활동량은 어느 정도인가요?"
                options={ACTIVITY_LEVEL_OPTIONS}
                value={value || ''}
                onChange={(val) => onChange(val as ActivityLevel)}
                error={error}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 px-2">
                * 활동량은 일일 총 소비 칼로리(TDEE) 계산에 가장 큰 영향을 미칩니다.
                솔직하게 선택해주세요!
            </p>
        </div>
    );
};

export default StepActivityLevel;
