'use client';

import Link from 'next/link';
import { ChevronLeft, Download, Trash2, ShieldAlert } from 'lucide-react';

export default function DataManagementPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24">
            <header className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-10">
                <div className="flex items-center h-14 px-4">
                    <Link href="/mypage" className="p-2 -ml-2">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-lg font-bold ml-2">데이터 관리</h1>
                </div>
            </header>

            <main className="pt-20 px-4 space-y-8">

                {/* Export */}
                <section className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                        <h2 className="font-bold flex items-center gap-2">
                            <Download className="w-4 h-4 text-slate-500" />
                            내 데이터 내보내기
                        </h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <p className="text-sm text-slate-500">
                            기록한 모든 식단 데이터와 프로필 정보를 파일로 다운로드할 수 있습니다.
                        </p>
                        <div className="flex gap-2">
                            <button className="flex-1 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700">
                                JSON 내보내기
                            </button>
                            <button className="flex-1 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700">
                                CSV 내보내기
                            </button>
                        </div>
                    </div>
                </section>

                {/* Delete */}
                <section className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-red-100 dark:border-red-900/30">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-red-50 dark:bg-red-900/10">
                        <h2 className="font-bold flex items-center gap-2 text-red-600 dark:text-red-400">
                            <Trash2 className="w-4 h-4" />
                            계정 삭제
                        </h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex gap-3 items-start">
                            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-slate-500">
                                계정을 삭제하면 모든 식단 기록과 프로필 정보가 <strong>즉시 영구 삭제</strong>되며 복구할 수 없습니다.
                            </p>
                        </div>
                        <button className="w-full py-3 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600">
                            계정 영구 삭제하기
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}
