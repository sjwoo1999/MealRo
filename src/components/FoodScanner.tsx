'use client';

import { useState, useRef, useCallback } from 'react';
import { RecognizedFood, ImageAnalysisResult } from '@/lib/gemini';
import { getAnonymousUserId } from '@/lib/userId';

interface FoodScannerProps {
    onAnalysisComplete?: (result: ImageAnalysisResult) => void;
}

export default function FoodScanner({ onAnalysisComplete }: FoodScannerProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<ImageAnalysisResult | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(async (file: File) => {
        setError(null);
        setResult(null);

        // Create preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // Start analysis
        setIsAnalyzing(true);

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('anonymousUserId', getAnonymousUserId());

            const response = await fetch('/api/analyze-image', {
                method: 'POST',
                body: formData,
            });

            const data: ImageAnalysisResult = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Analysis failed');
            }

            setResult(data);
            onAnalysisComplete?.(data);
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err instanceof Error ? err.message : '분석에 실패했습니다');
        } finally {
            setIsAnalyzing(false);
        }
    }, [onAnalysisComplete]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, [handleFile]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    }, [handleFile]);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const resetScanner = () => {
        setResult(null);
        setPreviewUrl(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full space-y-4">
            {/* Upload Area */}
            {!previewUrl && (
                <div
                    onClick={handleClick}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`
                        relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
                        transition-all duration-200
                        ${dragActive
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                            : 'border-slate-300 dark:border-slate-600 hover:border-orange-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }
                    `}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/heic"
                        onChange={handleInputChange}
                        className="hidden"
                    />

                    <div className="space-y-3">
                        <div className="text-5xl">📸</div>
                        <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                            음식 사진을 촬영하거나 업로드하세요
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            드래그 앤 드롭 또는 클릭하여 선택
                        </p>
                        <p className="text-xs text-slate-400">
                            지원 형식: JPEG, PNG, WebP, HEIC (최대 10MB)
                        </p>
                    </div>
                </div>
            )}

            {/* Preview & Analysis */}
            {previewUrl && (
                <div className="space-y-4">
                    {/* Image Preview */}
                    <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                            src={previewUrl}
                            alt="음식 사진 미리보기"
                            className="w-full max-h-64 object-contain"
                        />

                        {/* Analyzing Overlay */}
                        {isAnalyzing && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <div className="animate-spin text-4xl mb-2">🔍</div>
                                    <p className="font-medium">AI가 음식을 분석 중...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                            <p className="text-red-700 dark:text-red-400 text-center">
                                ⚠️ {error}
                            </p>
                        </div>
                    )}

                    {/* Results */}
                    {result && result.success && (
                        <div className="space-y-4">
                            {/* Detected Foods */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span>🍽️</span>
                                        인식된 음식
                                    </h3>
                                </div>

                                {result.foods.length === 0 ? (
                                    <div className="p-4 text-center text-slate-500">
                                        음식을 인식하지 못했습니다.
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {result.foods.map((food: RecognizedFood, index: number) => (
                                            <li key={index} className="p-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white">
                                                            {food.nameKorean}
                                                        </p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                                            {food.estimatedPortion}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-orange-600 dark:text-orange-400">
                                                            {food.estimatedCalories} kcal
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            신뢰도 {Math.round(food.confidence * 100)}%
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Macros */}
                                                <div className="mt-2 flex gap-4 text-xs text-slate-600 dark:text-slate-400">
                                                    <span>단백질 {food.estimatedProtein}g</span>
                                                    <span>탄수화물 {food.estimatedCarbs}g</span>
                                                    <span>지방 {food.estimatedFat}g</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Totals */}
                            {result.foods.length > 0 && (
                                <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 text-white">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">총 영양 정보</span>
                                        <span className="text-2xl font-bold">{result.totalCalories} kcal</span>
                                    </div>
                                    <div className="mt-2 flex gap-4 text-sm text-orange-100">
                                        <span>단백질 {result.totalProtein}g</span>
                                        <span>탄수화물 {result.totalCarbs}g</span>
                                        <span>지방 {result.totalFat}g</span>
                                    </div>
                                    <p className="mt-2 text-xs text-orange-200">
                                        ⏱️ 분석 시간: {result.processingTimeMs}ms
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reset Button */}
                    <button
                        onClick={resetScanner}
                        className="w-full py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 
                            text-slate-700 dark:text-slate-300 font-medium
                            hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        다른 사진 분석하기
                    </button>
                </div>
            )}
        </div>
    );
}
