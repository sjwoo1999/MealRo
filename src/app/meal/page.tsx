import PlannerForm from '@/components/planner/PlannerForm';

export const metadata = {
    title: '끼니 추천 - MealRo',
    description: '아침, 점심, 저녁 건강한 끼니를 추천해드립니다.',
};

export default function MealPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                오늘의 끼니 역추산 🔄
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
                오늘 먹은(먹을) 한 끼를 입력하면, 나머지 끼니를 건강하게 추천해드려요.
            </p>
            <PlannerForm />
        </div>
    );
}


// Removed unused skeleton

