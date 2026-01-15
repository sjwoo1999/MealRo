'use client';

import { useState, useRef, useCallback } from 'react';
import { FoodData, FoodAnalysisResponse } from '@/types/food';
import { getAnonymousUserId } from '@/lib/userId';
import { compressImage, formatFileSize } from '@/lib/image-compress';
import AnalysisResult from '@/components/food/AnalysisResult';

type AnalyzedData = FoodData | { foods: FoodData[] };

interface FoodScannerProps {
    onAnalysisComplete?: (data: AnalyzedData) => void;
    onSave?: (data: AnalyzedData) => void;
}

export default function FoodScanner({ onAnalysisComplete, onSave }: FoodScannerProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const [analyzedData, setAnalyzedData] = useState<AnalyzedData | null>(null);
    const [processingTime, setProcessingTime] = useState<number>(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [compressionInfo, setCompressionInfo] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(async (file: File) => {
        setError(null);
        setAnalyzedData(null);
        setCompressionInfo(null);

        // Create preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // Compress image if needed
        setIsCompressing(true);
        let processedFile = file;
        try {
            const originalSize = file.size;
            processedFile = await compressImage(file);
            const newSize = processedFile.size;

            if (newSize < originalSize) {
                setCompressionInfo(`${formatFileSize(originalSize)} → ${formatFileSize(newSize)}`);
            }
        } catch {
            console.warn('Image compression failed, using original');
        }
        setIsCompressing(false);

        // Start analysis
        setIsAnalyzing(true);

        try {
            const formData = new FormData();
            formData.append('image', processedFile);
            formData.append('user_id', getAnonymousUserId());

            // Use new API endpoint
            const response = await fetch('/api/food/analyze', {
                method: 'POST',
                body: formData,
            });

            const data: FoodAnalysisResponse = await response.json();

            if (!data.success) {
                throw new Error(data.error?.message || 'Analysis failed');
            }

            setAnalyzedData(data.data);
            setProcessingTime(data.processing_time_ms);
            onAnalysisComplete?.(data.data);
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
        setAnalyzedData(null);
        setPreviewUrl(null);
        setError(null);
        setProcessingTime(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSave = () => {
        if (analyzedData && onSave) {
            onSave(analyzedData);
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
                        capture="environment"
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
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={previewUrl}
                            alt="음식 사진 미리보기"
                            className="w-full max-h-64 object-contain"
                        />

                        {/* Compressing/Analyzing Overlay */}
                        {(isCompressing || isAnalyzing) && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <div className="animate-spin text-4xl mb-2">
                                        {isCompressing ? '🗜️' : '🔍'}
                                    </div>
                                    <p className="font-medium">
                                        {isCompressing ? '이미지 압축 중...' : 'AI가 음식을 분석 중...'}
                                    </p>
                                    <p className="text-sm text-white/70 mt-1">
                                        {isCompressing ? '업로드 최적화' : '한국 음식 전문 분석'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Compression Info Badge */}
                        {compressionInfo && !isCompressing && !isAnalyzing && (
                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-green-500/80 text-white text-xs rounded-full">
                                📦 {compressionInfo}
                            </div>
                        )}
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                            <p className="text-red-700 dark:text-red-400 text-center">
                                ⚠️ {error}
                            </p>
                            <button
                                onClick={resetScanner}
                                className="w-full mt-3 py-2 text-sm text-red-600 hover:underline"
                            >
                                다시 시도
                            </button>
                        </div>
                    )}

                    {/* Results - Using new AnalysisResult component */}
                    {analyzedData && (
                        <AnalysisResult
                            data={analyzedData}
                            processingTimeMs={processingTime}
                            onEdit={(editedData) => {
                                setAnalyzedData(editedData);
                            }}
                            onSave={onSave ? handleSave : undefined}
                        />
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
