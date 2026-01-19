export function SkeletonLoader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`animate-pulse rounded-md bg-slate-200 dark:bg-slate-700 ${className}`}
            {...props}
        />
    );
}

export function CardSkeleton() {
    return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-3">
            <SkeletonLoader className="h-4 w-1/3" />
            <SkeletonLoader className="h-24 w-full rounded-lg" />
            <div className="flex justify-between">
                <SkeletonLoader className="h-4 w-1/4" />
                <SkeletonLoader className="h-4 w-1/4" />
            </div>
        </div>
    );
}
