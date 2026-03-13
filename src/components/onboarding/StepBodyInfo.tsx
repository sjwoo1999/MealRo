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
            <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Step 2</p>
                <p className="mt-2 text-sm font-medium text-slate-900">기본 신체 정보를 입력하세요</p>
            </div>

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

            <div className="space-y-1 border-t border-black pt-4">
                <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-900">
                        제지방량 (선택사항)
                    </label>
                    <span className="rounded-full border border-black px-2 py-1 text-xs text-slate-500">선택</span>
                </div>
                <Input
                    type="number"
                    value={data.ffm || ''}
                    onChange={(val) => onChange({ ...data, ffm: val ? parseFloat(val) : undefined })}
                    placeholder="InBody 결과의 제지방량 입력"
                    suffix="kg"
                    error={errors?.ffm}
                    hint="있으면 더 정확하게 계산됩니다."
                />
            </div>
        </div>
    );
};

export default StepBodyInfo;
