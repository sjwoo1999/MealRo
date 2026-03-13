import Link from 'next/link';
import { ArrowRight, Camera } from 'lucide-react';
import Button from './Button';
import PageShell from './PageShell';

interface ComingSoonPageProps {
    label: string;
    title: string;
    description: string;
}

export default function ComingSoonPage({
    label,
    title,
    description,
}: ComingSoonPageProps) {
    return (
        <PageShell width="narrow" className="py-6">
            <section className="rounded-[28px] border border-black bg-white p-6">
                <span className="inline-flex rounded-full border border-black px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700">
                    {label}
                </span>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                    {title}
                </h1>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                    {description}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link href="/scan" className="sm:flex-1">
                        <Button
                            size="lg"
                            className="w-full border border-black bg-black text-white shadow-none"
                            leftIcon={<Camera className="h-4 w-4" />}
                        >
                            기록 남기기
                        </Button>
                    </Link>
                    <Link href="/" className="sm:flex-1">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full border-black bg-white shadow-none"
                            rightIcon={<ArrowRight className="h-4 w-4" />}
                        >
                            홈으로
                        </Button>
                    </Link>
                </div>
            </section>
        </PageShell>
    );
}
