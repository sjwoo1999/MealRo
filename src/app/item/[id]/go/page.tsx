'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { trackBridgeView, trackExternalLinkClick } from '@/lib/analytics';

interface BridgePageProps {
    params: Promise<{ id: string }>;
}

export default function BridgePage({ params }: BridgePageProps) {
    const { id } = use(params);
    const [itemName, setItemName] = useState<string>('');
    const [externalUrl, setExternalUrl] = useState<string>('');
    const [countdown, setCountdown] = useState(5);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchItem() {
            const supabase = createClient();
            const response = await supabase
                .from('menu_items')
                .select('name')
                .eq('id', id)
                .single();

            const itemData = response.data as { name: string } | null;

            if (itemData) {
                setItemName(itemData.name);
                // Generate search URL (safe - no product-specific affiliate links)
                // TODO: Consider adding affiliate parameter if partnership established
                const searchQuery = encodeURIComponent(itemData.name);
                setExternalUrl(`https://search.shopping.naver.com/search/all?query=${searchQuery}`);
            }

            setIsLoading(false);

            // Track bridge page view
            trackBridgeView(`/item/${id}/go`, id);
        }

        fetchItem();
    }, [id]);

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    const handleExternalLinkClick = () => {
        trackExternalLinkClick(`/item/${id}/go`, id, externalUrl);
    };

    if (isLoading) {
        return (
            <div className="max-w-lg mx-auto px-4 py-16 text-center">
                <div className="skeleton h-8 w-48 mx-auto mb-4 rounded" />
                <div className="skeleton h-4 w-64 mx-auto mb-2 rounded" />
                <div className="skeleton h-4 w-56 mx-auto rounded" />
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto px-4 py-8">
            {/* Warning Box */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-6">
                <h1 className="text-xl font-bold text-amber-800 dark:text-amber-300 mb-4 text-center">
                    ⚠️ 외부 링크 안내
                </h1>

                <p className="text-amber-700 dark:text-amber-400 text-center mb-4">
                    <strong>&ldquo;{itemName}&rdquo;</strong>에 대한 외부 쇼핑 검색 결과로 이동합니다.
                </p>

                {/* Disclosure */}
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4 mb-4">
                    <h2 className="font-semibold text-amber-800 dark:text-amber-300 mb-2 text-sm">
                        📋 고지사항
                    </h2>
                    <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-2">
                        <li>
                            {/* TODO(LEGAL_REVIEW): 제휴 고지 문구 공정위 가이드 확인 필요 */}
                            • 본 링크를 통한 구매 시 판매 수수료를 받을 수 있습니다.
                        </li>
                        <li>
                            • 외부 사이트의 상품 정보 및 가격은 MealRo와 무관합니다.
                        </li>
                        <li>
                            • 실제 제품의 영양 성분은 본 서비스의 추정치와 다를 수 있습니다.
                        </li>
                    </ul>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
                <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleExternalLinkClick}
                    className={`
            block w-full py-4 px-4 
            bg-primary-500 text-white text-center font-semibold text-lg
            rounded-xl hover:bg-primary-600
            transition-all duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
            ${countdown > 0 ? 'opacity-70 cursor-wait' : ''}
          `}
                >
                    {countdown > 0
                        ? `${countdown}초 후 이동 가능`
                        : '외부 사이트로 이동하기 →'}
                </a>

                <Link
                    href={`/item/${id}`}
                    className="
            block w-full py-3 px-4 
            border border-slate-300 dark:border-slate-600
            text-slate-700 dark:text-slate-300 text-center font-medium
            rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800
            transition-colors duration-200
          "
                >
                    ← 상세 페이지로 돌아가기
                </Link>
            </div>

            {/* Additional Info */}
            <p className="mt-6 text-xs text-slate-400 dark:text-slate-500 text-center">
                이 페이지는 외부 링크 클릭 전 안전 확인을 위한 브릿지 페이지입니다.
                <br />
                링크는 새 창에서 열리며, 앱 내 브라우저에서 표시됩니다.
            </p>
        </div>
    );
}
