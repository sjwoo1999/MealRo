import Link from 'next/link';
import { Camera } from 'lucide-react';
import { Button, PageShell } from '@/components/common';
import RestorePendingMeal from '@/components/home/RestorePendingMeal';
import { MEAL_CONTEXT } from '@/lib/mvp-flow';

const MEAL_ENTRIES = Object.entries(MEAL_CONTEXT);

export default function HomePage() {
    return (
        <PageShell width="narrow" className="py-6">
            <div className="space-y-5">
                <RestorePendingMeal />

                <section className="ui-card rounded-3xl border-none p-6 shadow-md bg-surface ring-1 ring-line">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-copy">
                                지금 먹는 식사를 바로 기록하세요
                            </h1>
                            <p className="mt-2 text-sm text-copy-subtle">
                                식사만 고르면 됩니다.
                            </p>
                        </div>
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-md ring-4 ring-emerald-100">
                            <Camera className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                        {MEAL_ENTRIES.map(([key, value]) => (
                            <Link
                                key={key}
                                href={`/scan?meal=${key}`}
                                className="rounded-2xl border border-line-strong bg-surface p-4 text-left transition-colors hover:border-accent hover:bg-surface-muted"
                            >
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-copy-subtle">
                                    Meal
                                </p>
                                <p className="mt-2 text-base font-semibold text-copy">{value.label}</p>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-6 grid gap-3">
                        <Link href="/feed" className="block">
                            <Button
                                variant="outline"
                                size="lg"
                                fullWidth
                                className="w-full"
                            >
                                기록 보기
                            </Button>
                        </Link>
                    </div>
                </section>
            </div>
        </PageShell>
    );
}
