import BetaFeedPage from '@/components/feed/BetaFeedPage';

export default function HistoryPage() {
    return (
        <BetaFeedPage
            mode="history"
            label="보관함"
            title="기록 보관함"
            description="저장한 기록을 다시 볼 수 있어요."
        />
    );
}
