import { Camera } from 'lucide-react';

interface GuestTrialProps {
    onNext: () => void;
}

export default function GuestTrial({ onNext }: GuestTrialProps) {
    return (
        <div className="flex flex-col h-full bg-black text-white p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black/50 to-transparent z-10" />

            <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4 animate-pulse">
                    <Camera className="w-10 h-10 text-emerald-400" />
                </div>

                <h2 className="text-2xl font-bold">
                    지금 드시는 음식을<br />
                    찍어보세요
                </h2>

                <p className="text-white/60">
                    회원가입 없이 AI가 즉시 영양소를<br />분석해드립니다.
                </p>

                {/* Demo Interface */}
                <div className="w-full max-w-xs aspect-[3/4] rounded-3xl border-2 border-white/20 bg-white/5 backdrop-blur-sm mt-8 relative flex items-center justify-center">
                    <span className="text-sm text-white/40">Camera Preview</span>
                    <button
                        onClick={onNext}
                        className="absolute bottom-6 w-16 h-16 rounded-full bg-white border-4 border-emerald-500/50"
                    />
                </div>
            </div>

            <div className="relative z-20 text-center pt-4">
                <button
                    onClick={onNext} // In reality, this would skip scanning
                    className="text-white/40 hover:text-white text-sm"
                >
                    건너뛰기
                </button>
            </div>
        </div>
    );
}
