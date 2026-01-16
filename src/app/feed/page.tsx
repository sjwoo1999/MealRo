import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function FeedPage() {
    const supabase = await createServerSupabaseClient();

    // 1. Get Today's Top Foods
    // Since we don't have aggregation functions exposed via simple SDK easily without RPC, 
    // we will fetch recent events and aggregate in memory for this demo (or fetch strictly recent).
    // Actually, let's just show "Recent Feed" and "Top Foods" if possible.
    // For demo simplicity, we'll fetch the last 100 items of today and aggregate top 5 manually.

    // KST Day Key calc (Server is UTC, so we shift)
    // Actually simple approach: fetch all from today's day_key.

    const kstDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
    const todayKey = new Date(kstDate).toISOString().split('T')[0];

    // Define interface locally since we lack global types update
    interface PublicFoodEvent {
        id: string;
        created_at: string;
        day_key: string;
        meal_type: string | null;
        food_name: string;
        food_category: string | null;
        confidence: number | null;
    }

    const { data: rawEvents, error } = await supabase
        .from('public_food_events')
        .select('*')
        .eq('day_key', todayKey)
        .order('created_at', { ascending: false })
        .limit(100);

    if (error) {
        console.error("Feed error:", error);
        return <div className="p-8 text-center">피드를 불러오는 중 오류가 발생했습니다.</div>;
    }

    const events = (rawEvents as any[] || []) as PublicFoodEvent[];

    // Aggregate Top 5
    const foodCounts: Record<string, number> = {};
    events.forEach(e => {
        const name = e.food_name;
        foodCounts[name] = (foodCounts[name] || 0) + 1;
    });

    const topFoods = Object.entries(foodCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

    return (
        <div className="w-full max-w-md mx-auto min-h-screen bg-white dark:bg-slate-900 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 h-14 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/" className="text-2xl no-underline">
                        ⬅️
                    </Link>
                    <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                        오늘의 식단 피드
                    </h1>
                </div>
            </header>

            <main className="p-4 space-y-6">
                {/* Privacy Banner */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300">
                    🔒 <b>익명 집계 피드</b>: 이곳에는 사용자가 공개를 허용한 식단 이름만 표시됩니다. 사진이나 개인정보는 절대 저장되지 않습니다.
                </div>

                {/* Top Foods */}
                <section>
                    <h2 className="text-sm font-semibold text-slate-500 mb-3 px-1">
                        🔥 오늘 가장 많이 먹은 음식 (Top 5)
                    </h2>
                    {topFoods.length === 0 ? (
                        <div className="text-center py-8 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 text-sm">
                            아직 데이터가 충분하지 않아요 🥣
                        </div>
                    ) : (
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {topFoods.map((food, idx) => (
                                <div key={idx} className="flex-shrink-0 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-xl px-4 py-3 flex flex-col items-center min-w-[100px]">
                                    <span className="text-2xl mb-1">{idx === 0 ? '👑' : '🍽️'}</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm line-clamp-1">
                                        {food.name}
                                    </span>
                                    <span className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                        {food.count}명 먹음
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Recent Feed */}
                <section>
                    <h2 className="text-sm font-semibold text-slate-500 mb-3 px-1">
                        🕒 실시간 기록
                    </h2>

                    <div className="space-y-3">
                        {events.map((event) => (
                            <div key={event.id} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl shadow-sm flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">
                                            {getMealIcon(event.meal_type)}
                                        </span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                            {event.food_name}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 text-xs text-slate-400">
                                        <span>{new Date(event.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
                                        {event.food_category && <span>• {event.food_category}</span>}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] text-slate-500">
                                        AI 신뢰도 {Math.round((event.confidence || 0) * 100)}%
                                    </div>
                                </div>
                            </div>
                        ))}

                        {events.length === 0 && (
                            <div className="text-center py-12 text-slate-400 text-sm">
                                <p>아직 공유된 기록이 없습니다.</p>
                                <p className="mt-1">첫 번째 주인공이 되어보세요! ✨</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

function getMealIcon(type: string | null) {
    switch (type) {
        case 'breakfast': return '🌅';
        case 'lunch': return '☀️';
        case 'dinner': return '🌙';
        default: return '🍽️';
    }
}
