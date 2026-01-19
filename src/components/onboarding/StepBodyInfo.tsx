'use client';

import React from 'react';
import { Input } from '@/components/common';

interface StepBodyInfoProps {
    data: { height?: number; weight?: number; ffm?: number };
    onChange: (data: { height?: number; weight?: number; ffm?: number }) => void;
    errors?: Record<string, string>;
}

const StepBodyInfo = ({ data, onChange, errors }: StepBodyInfoProps) => {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="space-y-1">
                <Input
                    label="키는 몇 cm인가요?"
                    type="number"
                    value={data.height || ''}
                    onChange={(val) => onChange({ ...data, height: val ? parseFloat(val) : undefined })}
                    placeholder="예: 175"
                    suffix="cm"
                    error={errors?.height}
                    hint="정확한 기초대사량 계산을 위해 필요합니다."
                />
            </div>

            <div className="space-y-1">
                <Input
                    label="현재 몸무게는 몇 kg인가요?"
                    type="number"
                    value={data.weight || ''}
                    onChange={(val) => onChange({ ...data, weight: val ? parseFloat(val) : undefined })}
                    placeholder="예: 70"
                    suffix="kg"
                    error={errors?.weight}
                />
            </div>

            <div className="space-y-1 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        제지방량 (선택사항)
                    </label>
                    <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">InBody 데이터</span>
                </div>
                <Input
                    type="number"
                    value={data.ffm || ''}
                    onChange={(val) => onChange({ ...data, ffm: val ? parseFloat(val) : undefined })}
                    placeholder="InBody 결과의 제지방량 입력"
                    suffix="kg"
                    error={errors?.ffm}
                    hint="입력 시 더 정확한 기초대사량이 계산됩니다."
                />
            </div>
        </div>
    );
};

export default StepBodyInfo;
