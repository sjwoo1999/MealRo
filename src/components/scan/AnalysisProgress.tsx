'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/common/Card';

interface ProgressStep {
    label: string;
    status: 'pending' | 'loading' | 'completed';
}

export default function AnalysisProgress() {
    const [steps, setSteps] = useState<ProgressStep[]>([
        { label: '이미지 업로드 중...', status: 'loading' },
        { label: '음식 식별 중...', status: 'pending' },
        { label: '영양소 분석 중...', status: 'pending' },
        { label: '결과 생성 중...', status: 'pending' },
    ]);

    // Demo simulation effect
    useEffect(() => {
        const timers = [
            setTimeout(() => updateStep(0, 'completed'), 1000),
            setTimeout(() => { updateStep(1, 'loading'); }, 1000),
            setTimeout(() => { updateStep(1, 'completed'); updateStep(2, 'loading'); }, 2500),
            setTimeout(() => { updateStep(2, 'completed'); updateStep(3, 'loading'); }, 4000),
            setTimeout(() => { updateStep(3, 'completed'); }, 5000),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    const updateStep = (index: number, status: 'pending' | 'loading' | 'completed') => {
        setSteps(prev => prev.map((s, i) => i === index ? { ...s, status } : s));
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-6">
            <div className="relative w-24 h-24">
                {/* Central Pulse */}
                <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/30 rounded-full animate-ping opacity-75" />
                <div className="relative bg-white dark:bg-slate-800 rounded-full w-full h-full flex items-center justify-center shadow-lg border-4 border-emerald-50 text-3xl">
                    🔍
                </div>
            </div>

            <div className="w-full max-w-xs space-y-3">
                {steps.map((step, i) => (
                    <div key={i} className={`flex items-center gap-3 transition-opacity duration-300 ${step.status === 'pending' ? 'opacity-40' : 'opacity-100'}`}>
                        <div className="w-5 h-5 flex items-center justify-center">
                            {step.status === 'loading' && <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />}
                            {step.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                            {step.status === 'pending' && <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />}
                        </div>
                        <span className={`text-sm font-medium ${step.status === 'loading' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`}>
                            {step.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
