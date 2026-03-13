'use client';

interface PortionSliderProps {
    value: number; // 0 to 200 (%)
    onChange: (value: number) => void;
}

export default function PortionSlider({ value, onChange }: PortionSliderProps) {
    const presets = [50, 100, 150];

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between px-1">
                <label className="text-sm font-bold text-slate-700">
                    섭취량
                </label>
                <span className="text-base font-semibold text-slate-900">
                    {value}% ({value / 100}인분)
                </span>
            </div>

            <div className="relative flex h-6 items-center">
                <input
                    type="range"
                    min="0"
                    max="200"
                    step="10"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-black"
                />
                <div className="pointer-events-none absolute left-0 top-1/2 flex w-full -translate-y-1/2 justify-between px-1">
                    <div className="h-1 w-0.5 bg-slate-400" />
                    <div className="h-1 w-0.5 bg-slate-400" />
                    <div className="h-1 w-0.5 bg-slate-400" />
                </div>
            </div>

            <div className="flex gap-2">
                {presets.map((preset) => (
                    <button
                        key={preset}
                        type="button"
                        onClick={() => onChange(preset)}
                        className={`flex-1 rounded-[14px] border py-2 text-xs font-medium transition-colors ${
                            value === preset
                                ? 'border-black bg-black text-white'
                                : 'border-black bg-white text-slate-700'
                        }`}
                    >
                        {preset / 100}인분
                    </button>
                ))}
            </div>
        </div>
    );
}
