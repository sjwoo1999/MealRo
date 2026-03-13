import { PageShell } from '@/components/common';
import PlannerForm from '@/components/planner/PlannerForm';

export default function MealPage() {
    return (
        <PageShell
            title="추천"
            description="기준 메뉴 하나를 고르면 남은 끼니 조합을 바로 계산합니다."
            width="narrow"
        >
            <PlannerForm />
        </PageShell>
    );
}
