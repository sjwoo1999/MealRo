import { Camera } from 'lucide-react';
import Button from '@/components/common/Button';

interface GuestTrialProps {
    onNext: () => void;
}

export default function GuestTrial({ onNext }: GuestTrialProps) {
    return (
        <div className="flex min-h-screen flex-col bg-white p-6">
            <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="w-full max-w-md rounded-[28px] border border-black bg-white p-6">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-black">
                        <Camera className="h-8 w-8 text-slate-900" />
                    </div>

                    <h2 className="mt-6 text-2xl font-bold">
                        음식 사진을 한 번
                        <br />
                        찍어보세요
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                        회원가입 없이도 먼저 분석 흐름을 체험할 수 있습니다.
                    </p>

                    <div className="mt-8 aspect-[3/4] w-full rounded-[24px] border border-black bg-slate-50 p-5">
                        <div className="flex h-full flex-col justify-between">
                            <div className="text-left">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                    Trial Camera
                                </p>
                            </div>
                            <div className="flex justify-center">
                                <button
                                    onClick={onNext}
                                    className="h-16 w-16 rounded-full border border-black bg-white"
                                    aria-label="다음 단계로 이동"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-black pt-6 text-center">
                <Button variant="ghost" onClick={onNext}>
                    건너뛰기
                </Button>
            </div>
        </div>
    );
}
