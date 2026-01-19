import Button from "@/components/common/Button";
import { CheckCircle2 } from "lucide-react";

interface AhaMomentProps {
    onNext: () => void;
}

export default function AhaMoment({ onNext }: AhaMomentProps) {
    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 p-6">
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">

                {/* Analysis Result Card */}
                <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden animate-in zoom-in duration-500">
                    <div className="h-48 bg-slate-200 dark:bg-slate-700 relative">
                        {/* Image Placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center text-4xl">🥘</div>
                        <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                            AI Analysis
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-bold">김치찌개</h3>
                                <p className="text-sm text-slate-500">1인분 (400g)</p>
                            </div>
                            <div className="text-right">
                                <p className="tex-lg font-bold text-emerald-500">285 kcal</p>
                            </div>
                        </div>

                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-emerald-800 dark:text-emerald-400">
                                        훌륭한 단백질 급원이에요!
                                    </p>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">
                                        하루 권장 단백질의 35%를 섭취했습니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold">정말 간편하죠?</h2>
                    <p className="text-slate-500 text-sm">
                        사진 한 장으로 복잡한 영양 계산이 끝납니다.<br />
                        이 기록을 저장하고 나만의 리포트를 받아보세요.
                    </p>
                </div>
            </div>

            <div className="pt-6">
                <Button fullWidth onClick={onNext}>
                    이 기록 저장하고 시작하기
                </Button>
            </div>
        </div>
    );
}
