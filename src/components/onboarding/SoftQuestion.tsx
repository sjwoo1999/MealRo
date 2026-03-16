import Button from "@/components/common/Button";

interface SoftQuestionProps {
    onNext: (goal?: string) => void;
}

export default function SoftQuestion({ onNext }: SoftQuestionProps) {
    const options = [
        { id: 'lose', label: '체중 감량' },
        { id: 'gain', label: '근육량 증가' },
        { id: 'maintain', label: '건강 관리' },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-white p-6">
            <div className="flex flex-1 flex-col justify-center space-y-8">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Quick Setup</p>
                    <h2 className="mt-2 text-2xl font-bold">가장 중요한 목표를 고르세요</h2>
                    <p className="mt-2 text-slate-500">하나만 선택해도 충분합니다.</p>
                </div>

                <div className="space-y-4">
                    {options.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => onNext(option.id)}
                            className="flex w-full items-center gap-4 rounded-[24px] border border-black bg-white p-5 text-left transition-colors hover:bg-slate-50"
                        >
                            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Goal</span>
                            <span className="font-bold text-lg">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="border-t border-black pt-6 text-center">
                <Button
                    variant="ghost"
                    onClick={() => onNext()}
                >
                    나중에 선택할게요
                </Button>
            </div>
        </div>
    );
}
