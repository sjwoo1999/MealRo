'use client';

import { useState } from 'react';
import { Cloud, Check, Loader2 } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

interface RestoreModalProps {
    isOpen: boolean;
    pendingCount: number;
    onRestore: () => Promise<void>;
    onDiscard: () => void;
}

export default function RestoreModal({
    isOpen,
    pendingCount,
    onRestore,
    onDiscard
}: RestoreModalProps) {
    const [isRestoring, setIsRestoring] = useState(false);

    if (!isOpen) return null;

    const handleRestore = async () => {
        setIsRestoring(true);
        await onRestore();
        setIsRestoring(false);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal */}
            <Card className="relative w-full max-w-sm bg-white dark:bg-slate-900 p-6 space-y-6 animate-in zoom-in duration-300">
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-2">
                        <Cloud className="w-8 h-8 text-blue-500" />
                    </div>
                    <h2 className="text-xl font-bold">기록을 불러올까요?</h2>
                    <p className="text-slate-500 text-sm">
                        로그인 전에 기록한 <strong>{pendingCount}개의 식단</strong>이 있습니다.<br />
                        계정에 저장하여 계속 관리하시겠습니까?
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        onClick={handleRestore}
                        disabled={isRestoring}
                        className="w-full py-3"
                    >
                        {isRestoring ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                저장 중...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                내 계정에 저장하기
                            </>
                        )}
                    </Button>

                    <button
                        onClick={onDiscard}
                        disabled={isRestoring}
                        className="text-slate-400 hover:text-slate-600 text-sm font-medium py-2"
                    >
                        아니요, 삭제할게요
                    </button>
                </div>
            </Card>
        </div>
    );
}
