
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface UpgradePromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
}

export default function UpgradePromptModal({
    isOpen,
    onClose,
    message = "이 기능은 계정을 등록해야 사용할 수 있어요.",
}: UpgradePromptModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    const handleSignup = () => {
        // 현재 위치를 returnUrl로 전달하여 회원가입 후 돌아오도록 함
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        router.push(`/auth?mode=signup&returnUrl=${returnUrl}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
            >
                <div className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-3xl">🔒</span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        데이터를 안전하게 보관하세요!
                    </h2>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                        {message}<br />
                        지금 가입하면 <span className="text-green-600 font-bold">기록된 데이터가 유지</span>됩니다.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={handleSignup}
                            className="w-full py-3.5 px-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-200"
                        >
                            3초 만에 시작하기
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full py-3 px-4 text-gray-400 hover:text-gray-600 font-medium text-sm transition-colors"
                        >
                            나중에 하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
