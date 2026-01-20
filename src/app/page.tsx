import Link from 'next/link';
import HomeOnboardingSection from '@/components/home/HomeOnboardingSection';
import RestorePendingMeal from '@/components/home/RestorePendingMeal';

export default function HomePage() {
    return (
        <div className="max-w-2xl lg:max-w-7xl mx-auto px-4 py-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">

                {/* Left Column (Dashboard/Status) - Desktop Only Order 1 */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                    <RestorePendingMeal />
                    <HomeOnboardingSection />

                    {/* PC View: Additional Sidebar Info could go here */}
                    <div className="hidden lg:block bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">💡 오늘의 건강 팁</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            규칙적인 식사가 대사를 활발하게 합니다. 끼니를 거르지 마세요!
                        </p>
                    </div>
                </div>

                {/* Right Column (Main Actions) - Desktop Only Order 2 */}
                <div className="lg:col-span-8">
                    {/* Hero Section */}
                    <section className="text-center py-12 lg:py-0 lg:text-left lg:mb-16 lg:flex lg:items-center lg:justify-between">
                        <div className="lg:mb-0 mb-8">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                                건강한 <span className="text-primary-600 dark:text-primary-400">끼니</span>를<br className="hidden lg:block" />
                                추천해드립니다
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto lg:mx-0">
                                아침, 점심, 저녁 균형 잡힌 식사를 위한<br className="hidden lg:block" />
                                영양 정보 기반 추천 서비스
                            </p>

                            <div className="hidden lg:flex gap-4">
                                <Link
                                    href="/meal"
                                    className="px-8 py-4 bg-primary-500 text-white rounded-xl shadow-lg hover:bg-primary-600 transition-all font-bold text-lg"
                                >
                                    끼니 추천 받기
                                </Link>
                                <Link
                                    href="/scan"
                                    className="px-8 py-4 bg-white text-primary-600 border border-primary-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-lg"
                                >
                                    음식 스캔하기
                                </Link>
                            </div>
                        </div>

                        {/* Mobile/Tablet CTA Buttons (Grid) */}
                        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                            <Link
                                href="/meal"
                                className="
                                    flex flex-col items-center justify-center gap-2
                                    px-6 py-6 bg-primary-500 text-white
                                    rounded-xl shadow-lg hover:bg-primary-600
                                    transition-all duration-200
                                    hover:shadow-xl hover:-translate-y-0.5
                                    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
                                "
                            >
                                <span className="text-3xl">🍽️</span>
                                <span className="text-lg font-bold">끼니 추천 받기</span>
                                <span className="text-sm opacity-90 font-medium">나에게 딱 맞는 메뉴</span>
                            </Link>

                            <Link
                                href="/scan"
                                className="
                                    flex flex-col items-center justify-center gap-2
                                    px-6 py-6 bg-primary-500 text-white
                                    rounded-xl shadow-lg hover:bg-primary-600
                                    transition-all duration-200
                                    hover:shadow-xl hover:-translate-y-0.5
                                    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
                                "
                            >
                                <span className="text-3xl">📸</span>
                                <span className="text-lg font-bold">음식 스캔하기</span>
                                <span className="text-sm opacity-90 font-medium">사진으로 영양 분석</span>
                            </Link>
                        </div>
                    </section>

                    <div className="mt-6 lg:mt-12 text-center lg:text-left">
                        <Link
                            href="/feed"
                            className="
                                inline-flex items-center gap-2 px-5 py-2.5 
                                bg-white dark:bg-slate-800 
                                border border-slate-200 dark:border-slate-700
                                rounded-full shadow-sm hover:shadow-md
                                text-sm font-medium text-slate-600 dark:text-slate-300
                                hover:text-primary-600 dark:hover:text-primary-400
                                transition-all
                            "
                        >
                            <span>🌏</span>
                            <span>다른 사람들은 오늘 뭐 먹었을까?</span>
                            <span className="text-xs text-slate-400 font-normal ml-1">(익명 피드)</span>
                        </Link>
                    </div>

                    {/* Features */}
                    <section className="py-12 grid md:grid-cols-3 gap-6">
                        <FeatureCard
                            icon="🌅"
                            title="아침"
                            description="활기찬 하루 시작을 위한 든든한 아침 메뉴"
                        />
                        <FeatureCard
                            icon="☀️"
                            title="점심"
                            description="오후 에너지를 위한 균형 잡힌 점심 메뉴"
                        />
                        <FeatureCard
                            icon="🌙"
                            title="저녁"
                            description="편안한 저녁을 위한 가벼운 저녁 메뉴"
                        />
                    </section>

                    {/* Info Section */}
                    <section className="py-8 text-center lg:text-left">
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 border-l-4 border-slate-300 dark:border-slate-600">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                💡 영양 정보 안내
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {/* TODO(LEGAL_REVIEW): 면책 문구 정확성 확인 필요 */}
                                본 서비스의 영양 정보는 음식군 평균값 기반의 <strong>추정치</strong>입니다.
                                <br />
                                실제 음식의 영양 성분과 다를 수 있으며, 의료적 조언을 대체하지 않습니다.
                            </p>
                            <Link
                                href="/disclaimer"
                                className="inline-block mt-4 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                            >
                                자세히 보기 →
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({
    icon,
    title,
    description
}: {
    icon: string;
    title: string;
    description: string;
}) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-sm border border-slate-200 dark:border-slate-700">
            <span className="text-4xl mb-4 block" aria-hidden="true">{icon}</span>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
        </div>
    );
}
