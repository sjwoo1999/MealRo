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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    성별이 무엇인가요?
                </label>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { value: 'male', label: '남성', emoji: '🙋‍♂️' },
                        { value: 'female', label: '여성', emoji: '🙋‍♀️' },
                    ].map((option) => (
                        <Card
                            key={option.value}
                            className={`
                                flex flex-col items-center justify-center p-6 cursor-pointer border-2 transition-all
                                ${data.gender === option.value
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                    : 'border-transparent hover:border-green-200 dark:hover:border-slate-600'
                                }
                            `}
                            onClick={() => onChange({ ...data, gender: option.value as Gender })}
                        >
                            <span className="text-4xl mb-2">{option.emoji}</span>
                            <span className={`font-medium ${data.gender === option.value ? 'text-green-700 dark:text-green-300' : ''}`}>
                                {option.label}
                            </span>
                        </Card>
                    ))}
                </div>
                {errors?.gender && (
                    <p className="text-xs text-red-500 mt-1">{errors.gender}</p>
                )}
            </div>

            {/* Pregnancy/Lactation options for Female */}
            {data.gender === 'female' && (
                <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        추가 상태 선택 (해당하는 경우만)
                    </p>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_pregnant || false}
                                onChange={(e) => onChange({ ...data, is_pregnant: e.target.checked })}
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm text-slate-600 dark:text-slate-400">현재 임신 중입니다</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_breastfeeding || false}
                                onChange={(e) => onChange({ ...data, is_breastfeeding: e.target.checked })}
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm text-slate-600 dark:text-slate-400">현재 수유 중입니다</span>
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
