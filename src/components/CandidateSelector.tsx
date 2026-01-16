"use client";

import { FoodData } from "@/types/food";

interface CandidateSelectorProps {
    candidates: NonNullable<FoodData['candidates']>;
    onSelect: (candidate: NonNullable<FoodData['candidates']>[number]) => void;
    onManualInput: () => void;
}

export default function CandidateSelector({ candidates, onSelect, onManualInput }: CandidateSelectorProps) {
    return (
        <div className="mt-6 space-y-4 animate-fade-in-up">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    🤔 이 음식이 아닌가요?
                </h3>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {candidates.map((candidate, idx) => (
                    <button
                        key={idx}
                        onClick={() => onSelect(candidate)}
                        className="flex-shrink-0 min-w-[140px] p-3 rounded-xl border border-slate-200 dark:border-slate-700 
                                 bg-white dark:bg-slate-800 hover:border-orange-400 dark:hover:border-orange-500 
                                 text-left transition-all hover:shadow-md group"
                    >
                        <div className="text-xs text-slate-400 mb-1">후보 {idx + 1}</div>
                        <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                            {candidate.food_name}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                            {candidate.reasoning}
                        </div>
                    </button>
                ))}

                {/* Manual Input Button */}
                <button
                    onClick={onManualInput}
                    className="flex-shrink-0 min-w-[100px] p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 
                             bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 
                             flex flex-col items-center justify-center gap-1 text-slate-500 transition-colors"
                >
                    <span className="text-xl">🔍</span>
                    <span className="text-xs font-medium">직접 검색</span>
                </button>
            </div>
        </div>
    );
}
