'use client';

import React from 'react';
import { Gender } from '@/types/user';
import { Card, Input } from '@/components/common';

interface StepBasicInfoProps {
    data: {
        gender?: Gender;
        age?: number;
        is_pregnant?: boolean;
        is_breastfeeding?: boolean;
    };
    onChange: (data: {
        gender?: Gender;
        age?: number;
        is_pregnant?: boolean;
        is_breastfeeding?: boolean;
    }) => void;
    errors?: Record<string, string>;
}

const StepBasicInfo = ({ data, onChange, errors }: StepBasicInfoProps) => {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="space-y-4">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Step 1</p>
                    <label className="mt-2 block text-sm font-medium text-slate-900">
                        성별을 선택하세요
                    </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { value: 'male', label: '남성' },
                        { value: 'female', label: '여성' },
                    ].map((option) => (
                        <Card
                            key={option.value}
                            className={`
                                flex cursor-pointer flex-col items-center justify-center border p-6 text-center transition-colors
                                ${data.gender === option.value
                                    ? 'border-black bg-black text-white'
                                    : 'border-black bg-white text-slate-900'
                                }
                            `}
                            onClick={() => onChange({ ...data, gender: option.value as Gender })}
                        >
                            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">Gender</span>
                            <span className="mt-2 text-base font-semibold">{option.label}</span>
                        </Card>
                    ))}
                </div>
                {errors?.gender && (
                    <p className="text-xs text-red-500 mt-1">{errors.gender}</p>
                )}
            </div>

            {data.gender === 'female' && (
                <div className="space-y-3 rounded-[20px] border border-black bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-900">
                        추가 상태
                    </p>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_pregnant || false}
                                onChange={(e) => onChange({ ...data, is_pregnant: e.target.checked })}
                                className="h-4 w-4 rounded border-black text-black focus:ring-black"
                            />
                            <span className="text-sm text-slate-700">현재 임신 중입니다</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_breastfeeding || false}
                                onChange={(e) => onChange({ ...data, is_breastfeeding: e.target.checked })}
                                className="h-4 w-4 rounded border-black text-black focus:ring-black"
                            />
                            <span className="text-sm text-slate-700">현재 수유 중입니다</span>
                        </label>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <Input
                    label="나이는 몇 살인가요?"
                    type="number"
                    value={data.age || ''}
                    onChange={(val) => onChange({ ...data, age: val ? parseInt(val) : undefined })}
                    placeholder="예: 25"
                    suffix="세"
                    error={errors?.age}
                />
            </div>
        </div>
    );
};

export default StepBasicInfo;
