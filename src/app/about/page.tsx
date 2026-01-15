import Link from 'next/link';

export const metadata = {
    title: '소개 - MealRo',
    description: 'MealRo 서비스 소개',
};

export default function AboutPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                MealRo 소개
            </h1>

            {/* Main Intro */}
            <section className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
                <div className="text-center mb-6">
                    <span className="text-6xl" aria-hidden="true">🍽️</span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-4">
                        건강한 끼니, 간편하게
                    </h2>
                </div>

                <div className="text-slate-600 dark:text-slate-300 space-y-4">
                    <p>
                        <strong>MealRo</strong>는 아침, 점심, 저녁 균형 잡힌 끼니를 추천해드리는 서비스입니다.
                    </p>

                    <p>
                        &ldquo;뭐 먹지?&rdquo; 고민하는 순간, 영양 정보를 기반으로 더 나은 선택을 도와드립니다.
                    </p>
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
                <h2 className="font-semibold text-lg text-slate-900 dark:text-white mb-4">
                    이용 방법
                </h2>

                <ol className="space-y-4">
                    <li className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center font-bold">
                            1
                        </span>
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">끼니 선택</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                아침, 점심, 저녁 중 원하는 끼니를 선택하세요.
                            </p>
                        </div>
                    </li>

                    <li className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center font-bold">
                            2
                        </span>
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">메뉴 탐색</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                영양 등급과 정보를 확인하며 메뉴를 탐색하세요.
                            </p>
                        </div>
                    </li>

                    <li className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center font-bold">
                            3
                        </span>
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">구매하기</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                마음에 드는 메뉴를 선택해 외부 쇼핑몰에서 구매하세요.
                            </p>
                        </div>
                    </li>
                </ol>
            </section>

            {/* Grade System */}
            <section className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
                <h2 className="font-semibold text-lg text-slate-900 dark:text-white mb-4">
                    등급 시스템
                </h2>

                <div className="space-y-3">
                    <GradeRow
                        grade="A"
                        icon="🌟"
                        label="추천"
                        description="높은 단백질 비율, 적정 칼로리"
                        colorClass="grade-a"
                    />
                    <GradeRow
                        grade="B"
                        icon="👍"
                        label="양호"
                        description="좋은 영양 균형"
                        colorClass="grade-b"
                    />
                    <GradeRow
                        grade="C"
                        icon="➖"
                        label="보통"
                        description="평균적인 영양 배분"
                        colorClass="grade-c"
                    />
                    <GradeRow
                        grade="D"
                        icon="⚠️"
                        label="주의"
                        description="낮은 단백질 비율 또는 높은 칼로리"
                        colorClass="grade-d"
                    />
                </div>

                <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                    {/* TODO(LEGAL_REVIEW): 등급 기준 설명 정확성 확인 필요 */}
                    * 등급은 참고 지표이며, 개인의 건강 상태에 따라 적합하지 않을 수 있습니다.
                </p>
            </section>

            {/* Contact */}
            <section className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
                <h2 className="font-semibold text-lg text-slate-900 dark:text-white mb-4">
                    문의
                </h2>

                <p className="text-slate-600 dark:text-slate-300">
                    서비스 관련 문의사항이 있으시면 아래 이메일로 연락해주세요.
                </p>

                <a
                    href="mailto:contact@mealro.app"
                    className="inline-block mt-2 text-primary-600 dark:text-primary-400 hover:underline"
                >
                    contact@mealro.app
                </a>
            </section>

            {/* Back Link */}
            <div className="text-center">
                <Link
                    href="/"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                    ← 홈으로 돌아가기
                </Link>
            </div>
        </div>
    );
}

function GradeRow({
    grade,
    icon,
    label,
    description,
    colorClass,
}: {
    grade: string;
    icon: string;
    label: string;
    description: string;
    colorClass: string;
}) {
    return (
        <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold ${colorClass}`}>
                <span aria-hidden="true">{icon}</span>
                <span>{grade}</span>
            </span>
            <div className="flex-1">
                <span className="font-medium text-slate-900 dark:text-white">{label}</span>
                <span className="text-slate-400 mx-2">·</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">{description}</span>
            </div>
        </div>
    );
}
