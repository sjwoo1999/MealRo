import Button from "@/components/common/Button";

interface SoftQuestionProps {
    onNext: (goal?: string) => void;
}

export default function SoftQuestion({ onNext }: SoftQuestionProps) {
    const options = [
        { id: 'diet', label: '체중 감량 (다이어트)', icon: '🥗' },
        { id: 'muscle', label: '근육량 증가 (벌크업)', icon: '💪' },
        { id: 'health', label: '건강 관리', icon: '❤️' },
    ];

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 p-6">
            <div className="flex-1 flex flex-col justify-center space-y-8">
                <div>
                    <h2 className="text-2xl font-bold mb-2">어떤 목표를<br />가지고 계신가요?</h2>
                    <p className="text-slate-500">가장 중요한 목표 하나를 선택해주세요.</p>
                </div>

                <div className="space-y-4">
                    {options.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => onNext(option.id)}
                            className="w-full p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 text-left border border-transparent hover:border-emerald-500"
                        >
                            <span className="text-2xl">{option.icon}</span>
                            <span className="font-bold text-lg">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="text-center">
                <button
                    onClick={() => onNext()}
                    className="text-slate-400 hover:text-slate-600 font-medium text-sm"
                >
                    나중에 선택할게요
                </button>
            </div>
        </div>
    );
}
