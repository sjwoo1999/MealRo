import { Metadata } from 'next';
import Link from 'next/link';
import FoodScanner from '@/components/FoodScanner';
import { Card, PageShell } from '@/components/common';
import { MEAL_CONTEXT, type MealContextKey } from '@/lib/mvp-flow';

export const metadata: Metadata = {
    title: '음식 스캔 - MealRo',
    description: '현재 식사를 기록하고 분석한 뒤 다음 흐름으로 분기합니다.',
};

type ScanPageProps = {
    searchParams?: {
        meal?: string;
    };
};

export default function ScanPage({ searchParams }: ScanPageProps) {
    const mealKey = searchParams?.meal as MealContextKey | undefined;
    const activeMeal = mealKey && MEAL_CONTEXT[mealKey] ? MEAL_CONTEXT[mealKey] : null;

    return (
        <PageShell width="wide" className="py-4 lg:py-6">
            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Link href="/" className="text-sm font-medium text-copy-muted hover:text-accent transition-colors">
                        ← 홈으로
                    </Link>
                </div>

                <section className="grid gap-6 lg:grid-cols-[0.36fr_0.64fr]">
                    <Card padding="lg" className="shadow-sm border-line">
                        <h1 className="mt-3 text-2xl font-semibold text-copy">
                            {activeMeal ? `${activeMeal.label} 식사 기록` : '식사 시간을 먼저 고르세요'}
                        </h1>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {Object.entries(MEAL_CONTEXT).map(([key, value]) => {
                                const active = key === mealKey;
                                return (
                                    <Link
                                        key={key}
                                        href={`/scan?meal=${key}`}
                                        className={`rounded-2xl border p-4 text-left transition-colors hover:border-accent ${active ? 'bg-accent text-white border-accent shadow-md' : 'bg-surface text-copy border-line-strong hover:bg-surface-muted'}`}
                                    >
                                        <p className="text-sm font-semibold">{value.label}</p>
                                    </Link>
                                );
                            })}
                        </div>
                    </Card>

                    <Card padding="lg" className="shadow-sm border-line">
                        <FoodScanner mealType={mealKey} mealLabel={activeMeal?.label} />
                    </Card>
                </section>
            </div>
        </PageShell>
    );
}
