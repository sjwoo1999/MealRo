import PlannerForm from '@/components/planner/PlannerForm';
import AuthGuard from '@/components/auth/AuthGuard';

export default function MealPage() {
    return (
        <AuthGuard>
            <PlannerForm />
        </AuthGuard>
    );
}
