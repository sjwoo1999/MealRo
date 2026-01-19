import Button from "@/components/common/Button";

interface ValuePropProps {
    onNext: () => void;
}

export default function ValueProp({ onNext }: ValuePropProps) {
    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900">
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 text-center">
                <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center text-4xl mb-4">
                    🥗
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    KDRI 2025 기준<br />
                    <span className="text-emerald-500">정밀 영양 관리</span>
                </h1>
                <p className="text-slate-500 leading-relaxed">
                    한국인에게 딱 맞는 영양소 섭취 기준을 적용하여<br />
                    더 정확하고 건강하게 관리하세요.
                </p>
            </div>

            <div className="p-6">
                <Button fullWidth size="lg" onClick={onNext}>
                    시작하기
                </Button>
            </div>
        </div>
    );
}
