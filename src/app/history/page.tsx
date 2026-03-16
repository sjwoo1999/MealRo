import BetaFeedPage from '@/components/feed/BetaFeedPage';
import AuthGuard from '@/components/auth/AuthGuard';

export default function HistoryPage() {
    return (
        <AuthGuard>
            <BetaFeedPage
                mode="history"
                label="보관함"
                title="기록 보관함"
                description="저장한 기록을 다시 볼 수 있어요."
            />
        </AuthGuard>
    );
}
