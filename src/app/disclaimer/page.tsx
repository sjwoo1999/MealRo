import Link from 'next/link';

export const metadata = {
    title: '면책조항 - MealRo',
    description: 'MealRo 서비스 이용 관련 면책조항 안내',
};

export default function DisclaimerPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                면책조항
            </h1>

            {/* Medical Disclaimer */}
            <section className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
                <h2 className="font-semibold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span aria-hidden="true">🏥</span>
                    의료 관련 면책
                </h2>

                {/* TODO(LEGAL_REVIEW): 의료적 면책 문구 법무 검토 필요 */}
                <div className="text-slate-600 dark:text-slate-300 space-y-4">
                    <p>
                        본 서비스(&ldquo;MealRo&rdquo;)에서 제공하는 모든 영양 정보는 <strong>음식군 평균값 기반의 추정치</strong>입니다.
                    </p>

                    <p>
                        실제 음식의 영양 성분은 조리 방법, 재료, 제조사, 섭취량 등에 따라 상이할 수 있으며,
                        본 서비스의 정보는 <strong>참고용으로만 사용</strong>되어야 합니다.
                    </p>

                    <p>
                        본 서비스는 의료적 조언, 진단, 치료를 대체하지 않습니다.
                        건강 상태, 식이요법, 영양 섭취에 관한 결정은 반드시 <strong>의료 전문가와 상담</strong> 후 진행하시기 바랍니다.
                    </p>

                    <p>
                        특정 질병의 예방, 치료, 개선 효과를 주장하지 않으며,
                        그러한 목적으로 본 서비스를 사용해서는 안 됩니다.
                    </p>
                </div>
            </section>

            {/* Data Accuracy */}
            <section className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
                <h2 className="font-semibold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span aria-hidden="true">📊</span>
                    데이터 정확성
                </h2>

                <div className="text-slate-600 dark:text-slate-300 space-y-4">
                    <p>
                        영양 정보는 <strong>100g 기준</strong>으로 표시되며,
                        실제 섭취량에 따라 달라질 수 있습니다.
                        {/* TODO: 확실하지 않음 - per 100g vs per serving 단위 확정 필요 */}
                    </p>

                    <p>
                        일부 음식 항목(예: 구성이 불명확한 세트 메뉴, 원재료/생고기류 등)은
                        영양 분석이 불가하여 서비스에서 제외되었습니다.
                    </p>

                    <p>
                        등급(A, B, C, D)은 단백질 비율과 칼로리를 기준으로 한 <strong>참고 지표</strong>이며,
                        개인의 건강 상태나 영양 목표에 따라 적합하지 않을 수 있습니다.
                    </p>
                </div>
            </section>

            {/* External Links */}
            <section className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
                <h2 className="font-semibold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span aria-hidden="true">🔗</span>
                    외부 링크 및 제휴
                </h2>

                {/* TODO(LEGAL_REVIEW): 제휴 링크 고지 문구 공정위 가이드 확인 필요 */}
                <div className="text-slate-600 dark:text-slate-300 space-y-4">
                    <p>
                        본 서비스는 외부 쇼핑 사이트로 연결되는 링크를 포함할 수 있습니다.
                        이러한 링크를 통한 <strong>구매 시 판매 수수료를 받을 수 있습니다</strong>.
                    </p>

                    <p>
                        외부 사이트의 상품 정보, 가격, 재고 상태는 MealRo와 무관하며,
                        해당 사이트의 정책에 따릅니다.
                    </p>

                    <p>
                        MealRo는 외부 링크를 통해 발생하는 거래에 대해 책임지지 않습니다.
                    </p>
                </div>
            </section>

            {/* Privacy */}
            <section className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
                <h2 className="font-semibold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span aria-hidden="true">🔒</span>
                    개인정보
                </h2>

                <div className="text-slate-600 dark:text-slate-300 space-y-4">
                    <p>
                        본 서비스는 <strong>로그인 없이 익명으로 이용</strong> 가능합니다.
                    </p>

                    <p>
                        서비스 개선을 위해 익명의 이용 통계(페이지 조회, 클릭 등)를 수집하며,
                        개인 식별이 가능한 정보(건강 정보, 체중, 질환 등)는 수집하지 않습니다.
                    </p>

                    <p>
                        익명 ID는 브라우저의 로컬 스토리지에 저장되며, 언제든지 삭제할 수 있습니다.
                    </p>
                </div>
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
