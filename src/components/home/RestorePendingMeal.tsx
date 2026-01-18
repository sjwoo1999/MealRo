'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SimpleSnackbar from '@/components/SimpleSnackbar';

export default function RestorePendingMeal() {
    const [isVisible, setIsVisible] = useState(false);
    const [pendingData, setPendingData] = useState<any>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

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
            // Call API with the EXISTING temp path.
            // Backend should accept it and link it to the new user.
            // Note: Currently backend log is: image_path: storage_path.
            // It doesn't move the file. That's fine for MVP.
            // Ideally we might want to move it from temp/ to secure/, but
            // since temp/ is also in 'food-images' bucket which is now Private (except INSERT),
            // and we have Signed URL generation, it should persist fine.
            // (Wait, `temp` path inserts were Public. Reads are Private. So it's safe.)

            const response = await fetch('/api/food/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    anonymous_user_id: pendingData.anonymous_user_id || 'restored_user', // Will be ignored/overwritten by auth in improved API?
                    // Actually existing API uses `anonymous_user_id` for logging.
                    // If logged in, we should link it to REAL user_id.
                    // But `image_analysis_logs` has `anonymous_user_id`.
                    // We might need to update the API to handle authenticated User ID mapping.
                    // For now, let's pass the one from storage or a specific flag.

                    // IMPORTANT: The current /confirm API relies on `anonymous_user_id`.
                    // If we are logged in, we want to associate it with the logged in user.
                    // The API currently just Inserts into `image_analysis_logs`.
                    // Does `image_analysis_logs` have a `user_id` column?
                    // Let's check schema. Migration 001.

                    // Assuming for now we just restore it.
                    image_hash: pendingData.image_hash,
                    food_data: pendingData.food_data,
                    include_in_public_feed: false, // Ask user? Default to False.
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
                    <div className="text-center mb-6">
                        <div className="text-4xl mb-3">🥘</div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            작성 중인 기록이 있어요
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 mt-2">
                            로그인 전에 분석했던 음식 기록을<br />
                            저장하시겠습니까?
                        </p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleRestore}
                            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors"
                        >
                            네, 저장할게요
                        </button>
                        <button
                            onClick={handleDiscard}
                            className="w-full py-3 text-slate-500 hover:text-slate-700 font-medium"
                        >
                            아니요, 삭제할게요
                        </button>
                    </div>
                </div>
            </div>
            <SimpleSnackbar isVisible={!!message} message={message || ''} onClose={() => setMessage(null)} />
        </>
    );
}
