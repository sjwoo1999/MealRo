interface SkeletonCardProps {
    count?: number;
}

export default function SkeletonCard({ count = 1 }: SkeletonCardProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    aria-hidden="true"
                    className="
            p-4 bg-white dark:bg-slate-800 
            rounded-xl border border-slate-200 dark:border-slate-700
          "
                >
                    {/* Header skeleton */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="skeleton h-6 w-32 rounded" />
                        <div className="skeleton h-6 w-16 rounded-full" />
                    </div>

                    {/* Category skeleton */}
                    <div className="skeleton h-4 w-20 rounded mb-3" />

                    {/* Nutrition grid skeleton */}
                    <div className="grid grid-cols-4 gap-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <div className="skeleton h-3 w-10 rounded" />
                                <div className="skeleton h-5 w-8 rounded" />
                            </div>
                        ))}
                    </div>

                    {/* Footer skeleton */}
                    <div className="skeleton h-3 w-24 rounded mt-3" />
                </div>
            ))}
        </>
    );
}
