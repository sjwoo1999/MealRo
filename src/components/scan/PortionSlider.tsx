'use client';

interface PortionSliderProps {
    value: number; // 0 to 200 (%)
    onChange: (value: number) => void;
}

export default function PortionSlider({ value, onChange }: PortionSliderProps) {
    // Safe preset points
    const presets = [0.5, 1.0, 1.5]; // 0.5인분, 1인분, 1.5인분

    return (
        <div className="w-full space-y-4">
            <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    섭취량 조절
                </label>
                <span className="text-emerald-500 font-bold text-lg">
                    {value}% <span className="text-xs text-slate-400 font-normal">({value / 100}인분)</span>
                </span>
            </div>

            <div className="relative h-6 flex items-center">
                {/* Custom Track */}
                <input
                    type="range"
                    min="0"
                    max="200"
                    step="10"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-emerald-500"
                />
                {/* Helper Ticks */}
                <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 pointer-events-none flex justify-between px-1">
                    <div className="w-0.5 h-1 bg-white/50" />
                    <div className="w-0.5 h-1 bg-white/50" />
                    <div className="w-0.5 h-1 bg-white/50" />
                </div>
            </div>

            {/* Preset Buttons */}
            <div className="flex gap-2">
                {presets.map((preset) => (
                    <button
                        key={preset}
                        onClick={() => onChange(preset * 100)}
                        className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${value === preset * 100
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'
                            }`}
                    >
                        {preset}인분
                    </button>
                ))}
            </div>
        </div>
    );
}
