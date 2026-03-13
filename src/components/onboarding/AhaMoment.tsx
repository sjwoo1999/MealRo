import Button from "@/components/common/Button";
import { CheckCircle2 } from "lucide-react";

interface AhaMomentProps {
    onNext: () => void;
}

export default function AhaMoment({ onNext }: AhaMomentProps) {
    return (
        <div className="flex min-h-screen flex-col bg-white p-6">
            <div className="flex flex-1 flex-col items-center justify-center space-y-6">
                <div className="w-full max-w-sm overflow-hidden rounded-[28px] border border-black bg-white">
                    <div className="relative h-48 border-b border-black bg-slate-50">
                        <div className="absolute inset-0 flex items-center justify-center text-4xl">🥘</div>
                        <div className="absolute right-4 top-4 rounded-full border border-black bg-white px-2 py-1 text-xs">
                            Analysis
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-bold">김치찌개</h3>
                                <p className="text-sm text-slate-500">1인분 (400g)</p>
                            </div>
                            <div className="text-right">
                                <p className="tex-lg font-bold text-slate-900">285 kcal</p>
                            </div>
                        </div>

                        <div className="rounded-[20px] border border-black bg-slate-50 p-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 text-slate-900" />
                                <div>
                                    <p className="text-sm font-bold text-slate-900">
                                        분석 결과를 바로 저장할 수 있어요
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        기록을 쌓아두면 이후 피드와 리포트에서 다시 볼 수 있습니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold">이런 흐름으로 사용하게 됩니다</h2>
                    <p className="text-sm text-slate-500">
                        촬영하고, 결과를 확인하고, 저장한 뒤 피드에서 기록을 볼 수 있습니다.
                    </p>
                </div>
            </div>

            <div className="border-t border-black pt-6">
                <Button fullWidth onClick={onNext}>
                    이 기록 저장하고 시작하기
                </Button>
            </div>
        </div>
    );
}
