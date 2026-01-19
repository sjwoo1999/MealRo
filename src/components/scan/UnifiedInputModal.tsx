'use client';

import { useState } from 'react';
import { Camera, Search, Barcode, Clock, X } from 'lucide-react';

interface UnifiedInputModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type InputMode = 'camera' | 'search' | 'barcode' | 'recent';

export default function UnifiedInputModal({ isOpen, onClose }: UnifiedInputModalProps) {
    const [activeMode, setActiveMode] = useState<InputMode>('camera');

    if (!isOpen) return null;

    const modes = [
        { id: 'camera', label: '카메라', icon: Camera },
        { id: 'search', label: '검색', icon: Search },
        { id: 'barcode', label: '바코드', icon: Barcode },
        { id: 'recent', label: '최근', icon: Clock },
    ] as const;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 text-white animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <div className="w-8" /> {/* Spacer */}
                <div className="flex gap-1 bg-white/10 p-1 rounded-full backdrop-blur-md">
                    {modes.map((mode) => {
                        const Icon = mode.icon;
                        const isActive = activeMode === mode.id;
                        return (
                            <button
                                key={mode.id}
                                onClick={() => setActiveMode(mode.id)}
                                className={`p-2 rounded-full transition-all ${isActive ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                            </button>
                        );
                    })}
                </div>
                <button onClick={onClose} className="p-2 text-white/80 hover:text-white">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center relative">
                {activeMode === 'camera' && (
                    <div className="text-center space-y-4">
                        <div className="w-64 h-64 rounded-2xl border-2 border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                            <Camera className="w-12 h-12 text-white/50" />
                        </div>
                        <p className="text-white/60">음식을 촬영하여 AI 분석을 시작하세요</p>
                        <button className="px-8 py-3 bg-emerald-500 rounded-full font-bold text-lg shadow-lg hover:bg-emerald-400 transition-colors">
                            촬영하기
                        </button>
                    </div>
                )}

                {activeMode === 'search' && (
                    <div className="w-full max-w-md px-6 -mt-20">
                        <input
                            type="text"
                            placeholder="음식 이름 검색..."
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>
                )}

                {/* Placeholders for other modes */}
                {(activeMode === 'barcode' || activeMode === 'recent') && (
                    <div className="text-white/40 text-center">
                        <p>준비 중인 기능입니다</p>
                    </div>
                )}
            </div>
        </div>
    );
}
