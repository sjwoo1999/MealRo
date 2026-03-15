import ComingSoonPage from '@/components/common/ComingSoonPage';

export default function MealPage() {
    return (
        <ComingSoonPage
            title="추천"
            features={['AI 맞춤 메뉴 추천', '남은 영양소 기반 제안', '근처 식당 연계 추천']}
        />
    );
}
