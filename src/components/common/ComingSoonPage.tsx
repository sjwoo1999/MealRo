'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, BarChart3, Sparkles, type LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    '분석': BarChart3,
    '추천': Sparkles,
};

interface ComingSoonPageProps {
    title: string;
    features?: string[];
}

export default function ComingSoonPage({ title, features }: ComingSoonPageProps) {
    const router = useRouter();
    const Icon = iconMap[title] ?? Sparkles;

    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-6">
            <div className="w-full max-w-sm">
                {/* 아이콘 */}
                <div className="mb-5 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
                        <Icon className="h-8 w-8 text-accent" strokeWidth={1.75} />
                    </div>
                </div>

                {/* 뱃지 */}
                <div className="mb-4 flex justify-center">
                    <span className="rounded-pill bg-accent-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                        Coming Soon
                    </span>
                </div>

                {/* 메인 카드 */}
                <div className="rounded-lg border border-line bg-surface p-8 shadow-sm">
                    <h1 className="text-center text-2xl font-bold tracking-tight text-copy">
                        {title}
                    </h1>
                    <p className="mt-2 text-center text-sm leading-relaxed text-copy-muted">
                        열심히 만들고 있어요.<br />
                        곧 멋진 기능을 선보일게요.
                    </p>

                    {/* Feature Preview */}
                    {features && features.length > 0 && (
                        <ul className="mt-6 space-y-3">
                            {features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3">
                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
                                    <span className="text-sm text-copy-muted">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="mt-6 h-px bg-line" />

                    <button
                        onClick={() => router.back()}
                        className="mt-5 flex items-center gap-1.5 text-sm font-medium text-copy-subtle transition-colors hover:text-copy"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}
