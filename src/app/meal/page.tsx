import { Suspense } from 'react';
import MealContent from './MealContent';
import SkeletonCard from '@/components/SkeletonCard';

export const metadata = {
    title: '끼니 추천 - MealRo',
    description: '아침, 점심, 저녁 건강한 끼니를 추천해드립니다.',
};

export default function MealPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <Suspense fallback={<MealPageSkeleton />}>
                <MealContent />
            </Suspense>
        </div>
    );
}

function MealPageSkeleton() {
    return (
        <div className="space-y-6">
            {/* Tabs skeleton */}
            <div className="flex gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <div className="skeleton flex-1 h-12 rounded-lg" />
                <div className="skeleton flex-1 h-12 rounded-lg" />
                <div className="skeleton flex-1 h-12 rounded-lg" />
            </div>

            {/* Filter skeleton */}
            <div className="flex gap-2">
                <div className="skeleton h-8 w-16 rounded-full" />
                <div className="skeleton h-8 w-20 rounded-full" />
                <div className="skeleton h-8 w-18 rounded-full" />
            </div>

            {/* Cards skeleton */}
            <div className="space-y-4">
                <SkeletonCard count={4} />
            </div>
        </div>
    );
}
