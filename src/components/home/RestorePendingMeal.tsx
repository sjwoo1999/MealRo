'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SimpleSnackbar from '@/components/SimpleSnackbar';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/common/Button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export default function RestorePendingMeal() {
    const [isVisible, setIsVisible] = useState(false);
    const [pendingData, setPendingData] = useState<any>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();
    const { user } = useAuth(); // Get authenticated user

    useEffect(() => {
        const stored = localStorage.getItem('pending_meal_restore');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                // Validate timestamp (expire after 24 hours)
                if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                    setPendingData(data);
                    setIsVisible(true);
                } else {
                    localStorage.removeItem('pending_meal_restore');
                }
            } catch (e) {
                console.error("Failed to parse pending meal", e);
                localStorage.removeItem('pending_meal_restore');
            }
        }
    }, []);

    const handleRestore = async () => {
        if (!pendingData) return;

        try {
            // FIXED: Use the actual authenticated User ID if available.
            // This ensures the restored meal appears in the user's history.
            const targetUserId = user?.id || pendingData.anonymous_user_id;

            const response = await fetch('/api/food/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    anonymous_user_id: targetUserId, // Use Auth ID
                    image_hash: pendingData.image_hash,
                    food_data: pendingData.food_data,
                    include_in_public_feed: false,
                    processing_time_ms: pendingData.processing_time_ms,
                    storage_path: pendingData.storage_path
                }),
            });

            const result = await response.json();
            if (result.success) {
                setMessage("이전 식사 기록을 성공적으로 저장했습니다! 🎉");
                localStorage.removeItem('pending_meal_restore');
                setIsVisible(false);
                router.refresh(); // Refresh to show item in history?
            } else {
                throw new Error(result.error);
            }

        } catch (e: any) {
            console.error(e);
            setMessage("복구에 실패했습니다: " + e.message);
        }
    };

    const handleDiscard = () => {
        if (confirm("정말 이 기록을 삭제하시겠습니까?")) {
            localStorage.removeItem('pending_meal_restore');
            setIsVisible(false);
        }
    };

    if (!isVisible) return <SimpleSnackbar isVisible={!!message} message={message || ''} onClose={() => setMessage(null)} />;

    return (
        <>
            <Dialog open={isVisible} onOpenChange={setIsVisible}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>임시 기록 복구</DialogTitle>
                        <DialogDescription>
                            로그인 전에 분석했던 음식 기록을 저장하시겠습니까?
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button fullWidth onClick={handleRestore} className="border border-black bg-black text-white shadow-none">
                            저장하고 이어가기
                        </Button>
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={handleDiscard}
                            className="border-black bg-white shadow-none"
                        >
                            삭제하기
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <SimpleSnackbar isVisible={!!message} message={message || ''} onClose={() => setMessage(null)} />
        </>
    );
}
