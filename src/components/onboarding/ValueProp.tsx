import Button from "@/components/common/Button";

interface ValuePropProps {
    onNext: () => void;
}

export default function ValueProp({ onNext }: ValuePropProps) {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <div className="flex flex-1 flex-col justify-center px-6 py-10">
                <div className="mx-auto w-full max-w-md rounded-[28px] border border-black bg-white p-8 text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        MealRo Beta
                    </p>
                    <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full border border-black text-3xl">
                        AI
                    </div>
                    <h1 className="mt-6 text-3xl font-bold text-slate-900">
                        사진으로 식사를
                        <br />
                        바로 기록하세요
                    </h1>
                    <p className="mt-4 text-sm leading-6 text-slate-500">
                        복잡한 설정 없이 시작하고, 필요한 정보만 나중에 입력하면 됩니다.
                    </p>
                </div>
            </div>

            <div className="border-t border-black p-6">
                <Button fullWidth size="lg" onClick={onNext}>
                    시작하기
                </Button>
            </div>
        </div>
    );
}
