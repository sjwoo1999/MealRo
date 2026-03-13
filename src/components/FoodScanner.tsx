'use client';

import Link from 'next/link';
import { useState, useRef, useCallback } from 'react';
import { Camera, CheckCircle2, RotateCcw } from 'lucide-react';
import { FoodData, FoodAnalysisResponse, needsVerification, hasMultipleFoods } from '@/types/food';
import { getAnonymousUserId } from '@/lib/userId';
import { compressImage, formatFileSize } from '@/lib/image-compress';
import FoodAnalysisResult from '@/components/scan/FoodAnalysisResult';
import CandidateSelector from '@/components/CandidateSelector';
import SimpleSnackbar from '@/components/SimpleSnackbar';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Card, DiagnosticCard, SuccessStateCard } from '@/components/common';
// Import Supabase Client directly for storage upload
import { createClient } from '@/lib/supabase/client';
import { db } from '@/lib/db';

type AnalyzedData = FoodData | { foods: FoodData[] };

// Helper type for safely accessing candidate
type Candidate = NonNullable<FoodData['candidates']>[number];

interface FoodScannerProps {
    onAnalysisComplete?: (data: AnalyzedData) => void;
    onSave?: (data: AnalyzedData) => void;
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    mealLabel?: string;
}

export default function FoodScanner({
    onAnalysisComplete,
    onSave,
    mealType,
    mealLabel,
}: FoodScannerProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const [analyzedData, setAnalyzedData] = useState<AnalyzedData | null>(null);
    const [processingTime, setProcessingTime] = useState<number>(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [compressionInfo, setCompressionInfo] = useState<string | null>(null);

    // New State for Multi-Candidate & Confirmation & Upload
    const [imageHash, setImageHash] = useState<string | null>(null);
    // Removed API returned storagePath, we generate it on client or handle upload on confirm
    const [currentFile, setCurrentFile] = useState<File | null>(null); // Keep reference to file for upload
    const [showCandidates, setShowCandidates] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    const [message, setMessage] = useState<string | null>(null); // For Snackbar
    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false); // New saving state
    const [didPersist, setDidPersist] = useState(false);
    const [saveState, setSaveState] = useState<'idle' | 'success' | 'fallback'>('idle');
    const [saveDiagnostic, setSaveDiagnostic] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient(); // Helper for client-side storage upload

    const handleFile = useCallback(async (file: File) => {
        setError(null);
        setAnalyzedData(null);
        setCompressionInfo(null);
        setImageHash(null);
        // setStoragePath(null); // No longer needed from analysis
        setShowCandidates(false);
        setIsPublic(false);
        setCurrentFile(null);
        setDidPersist(false);
        setSaveState('idle');
        setSaveDiagnostic(null);

        // ... existing preview code ...
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        setIsCompressing(true);
        let processedFile = file;
        try {
            const originalSize = file.size;
            processedFile = await compressImage(file);
            setCurrentFile(processedFile); // Store for later upload

            const newSize = processedFile.size;

            if (newSize < originalSize) {
                setCompressionInfo(`${formatFileSize(originalSize)} → ${formatFileSize(newSize)}`);
            }
        } catch {
            console.warn('Image compression failed, using original');
            setCurrentFile(file);
        }
        setIsCompressing(false);

        setIsAnalyzing(true);
        try {
            const formData = new FormData();
            formData.append('image', processedFile);
            formData.append('anonymousUserId', getAnonymousUserId());
            if (mealType) {
                formData.append('mealType', mealType);
            }

            const response = await fetch('/api/analyze-image', {
                method: 'POST',
                body: formData,
            });

            const data: FoodAnalysisResponse = await response.json();

            if (!data.success) {
                throw new Error(data.error?.message || 'Analysis failed');
            }

            setAnalyzedData(data.data);
            setProcessingTime(data.processing_time_ms);

            if (data.image_hash) {
                setImageHash(data.image_hash);
            }

            // Note: Data no longer contains storage_path as we stopped uploading there

            if (!hasMultipleFoods(data.data)) {
                if (needsVerification(data.data.confidence)) {
                    setShowCandidates(true);
                }
            }

            onAnalysisComplete?.(data.data);
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err instanceof Error ? err.message : '분석에 실패했습니다');
        } finally {
            setIsAnalyzing(false);
        }
    }, [mealType, onAnalysisComplete]);

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
        setImageHash(null);
        setCurrentFile(null);
        setShowCandidates(false);
        setDidPersist(false);
        setSaveDiagnostic(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCandidateSelect = (candidate: Candidate) => {
        if (!analyzedData || hasMultipleFoods(analyzedData)) return;

        // Create new food data from candidate
        const newFoodData: FoodData = {
            ...analyzedData,
            food_name: candidate.food_name,
            reasoning: candidate.reasoning,
            nutrition: candidate.nutrition,
            confidence: 1.0, // User confirmed
            candidates: analyzedData.candidates, // Keep candidates just in case
        };

        setAnalyzedData(newFoodData);
        setShowCandidates(false); // Hide selector after selection
    };

    const saveMealToDexie = async (data: AnalyzedData, storagePath: string, synced: boolean) => {
        const isMulti = hasMultipleFoods(data);
        const mealName = isMulti
            ? `${data.foods[0].food_name} 외 ${data.foods.length - 1}개`
            : data.food_name;

        const totalCalories = isMulti
            ? data.foods.reduce((acc, food) => acc + food.nutrition.calories, 0)
            : data.nutrition.calories;

        await db.meals.add({
            name: mealName || 'Unknown Food',
            calories: totalCalories || 0,
            image_url: storagePath,
            timestamp: new Date(),
            synced,
            food_data: data,
        });
    };

    const handleConfirm = async () => {
        if (!analyzedData || !imageHash || !currentFile) {
            setMessage("저장할 정보가 부족합니다.");
            return;
        }

        if (!user) {
            setIsSaving(true);
            try {
                const anonId = getAnonymousUserId();
                const today = new Date().toISOString().split('T')[0];
                const ext = currentFile.name.split('.').pop() || 'jpg';
                const tempStoragePath = `temp/${anonId}/${Date.now()}_${imageHash.substring(0, 8)}.${ext}`;

                const { error: uploadError } = await supabase.storage
                    .from('food-images')
                    .upload(tempStoragePath, currentFile, {
                        contentType: currentFile.type,
                        upsert: false
                    });

                if (uploadError) {
                    console.error("Temp Upload failed", uploadError);
                    throw new Error("사진 업로드에 실패했습니다.");
                }

                const response = await fetch('/api/food/confirm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        anonymous_user_id: anonId,
                        image_hash: imageHash,
                        food_data: analyzedData,
                        meal_type: mealType || 'lunch',
                        include_in_public_feed: isPublic,
                        processing_time_ms: processingTime,
                        storage_path: tempStoragePath,
                    }),
                });

                const result = await response.json();
                if (!result.success) {
                    throw new Error(result.detail ? `${result.error}: ${result.detail}` : (result.error || '비회원 저장에 실패했습니다.'));
                }

                await saveMealToDexie(analyzedData, tempStoragePath, true);
                setMessage("기록이 저장되었습니다.");
                setDidPersist(true);
                setSaveState('success');
                setSaveDiagnostic('기록 저장이 끝났습니다. 전체 목록에는 잠시 후 반영될 수 있습니다.');
                if (onSave) onSave(analyzedData);
            } catch (e: any) {
                console.error(e);
                try {
                    await saveMealToDexie(analyzedData, '', false);
                    setMessage("이 기기에 기록을 남겼습니다.");
                    setDidPersist(true);
                    setSaveState('fallback');
                    setSaveDiagnostic(`전체 목록 반영이 늦어질 수 있어 이 기기에 먼저 저장했습니다. 원인: ${e.message || '알 수 없는 오류'}`);
                    if (onSave) onSave(analyzedData);
                } catch (dbError) {
                    console.error(dbError);
                    setMessage(e.message || "기록 저장에 실패했습니다.");
                    setSaveDiagnostic(`기록 저장에 실패했습니다. 원인: ${e.message || '알 수 없는 오류'}`);
                }
            } finally {
                setIsSaving(false);
            }
            return;
        }

        setIsSaving(true);
        try {
            // 1. Upload to Supabase Storage (Private 'food-images' bucket)
            const anonId = getAnonymousUserId();
            const today = new Date().toISOString().split('T')[0];
            const ext = currentFile.name.split('.').pop() || 'jpg';
            // Path structure: YYYY-MM-DD/anon_id/timestamp_hash.ext
            const storagePath = `${today}/${anonId}/${Date.now()}_${imageHash.substring(0, 8)}.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from('food-images')
                .upload(storagePath, currentFile, {
                    contentType: currentFile.type,
                    upsert: false
                });

            if (uploadError) {
                console.error("Upload failed", uploadError);
                throw new Error("이미지 업로드에 실패했습니다.");
            }

            const response = await fetch('/api/food/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    anonymous_user_id: anonId,
                    image_hash: imageHash,
                    food_data: analyzedData,
                    meal_type: mealType || 'lunch',
                    include_in_public_feed: isPublic,
                    processing_time_ms: processingTime,
                    storage_path: storagePath // Now provided by Client after secure upload
                }),
            });

            const result = await response.json();
            if (result.success) {
                await saveMealToDexie(analyzedData, storagePath, true);
                setMessage("기록이 저장되었습니다.");
                setDidPersist(true);
                setSaveState('success');
                setSaveDiagnostic('기록 저장이 끝났습니다. 전체 목록에는 잠시 후 반영될 수 있습니다.');
                if (onSave) onSave(analyzedData);
            } else {
                throw new Error(result.detail ? `${result.error}: ${result.detail}` : result.error);
            }
        } catch (e: any) {
            console.error(e);
            setMessage(e.message || "기록 저장에 실패했습니다.");
            setSaveDiagnostic(`기록 저장에 실패했습니다. 원인: ${e.message || '알 수 없는 오류'}`);
        } finally {
            setIsSaving(false);
        }
    };

    const progressTitle = isSaving
        ? '기록을 저장하고 있어요'
        : isCompressing
            ? '사진을 분석하기 좋게 정리하고 있어요'
            : 'AI가 음식과 영양 정보를 계산하고 있어요';

    const progressDescription = isSaving
        ? '저장 중입니다.'
        : isCompressing
            ? '이미지 준비 중입니다.'
            : '분석 중입니다.';

    return (
        <div className="w-full space-y-4">
            {!previewUrl && (
                <Card padding="lg" className="border border-black shadow-none">
                    <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
                        {mealLabel ? `${mealLabel} 식사 촬영` : '식사 촬영'}
                    </h2>
                </Card>
            )}

            {/* Upload Area */}
            {!previewUrl && (
                <div
                    onClick={handleClick}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`
                        relative cursor-pointer rounded-[24px] border-2 border-dashed p-8 text-center transition-all duration-200
                        ${dragActive
                            ? 'border-black bg-[#f3f3f3]'
                            : 'border-black bg-white hover:bg-[#fafafa]'
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
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">UPLOAD AREA</div>
                        <p className="mt-2 text-lg font-medium text-slate-900 dark:text-white">
                            음식 사진을 업로드하세요
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            클릭해서 선택
                        </p>
                        <p className="text-xs text-slate-400">
                            JPEG, PNG, WebP, HEIC / 최대 10MB
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

                        {/* Compressing/Analyzing/Saving Overlay */}
                        {(isCompressing || isAnalyzing || isSaving) && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/94 p-4 dark:bg-black/88">
                                <div
                                    className="w-full max-w-md rounded-[24px] border border-black bg-white p-6 shadow-none"
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.96)',
                                    }}
                                >
                                    <div className="inline-flex rounded-full border border-black px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                                        {isSaving ? 'SAVE' : isCompressing ? 'PREP' : 'ANALYSIS'}
                                    </div>
                                    <h3 className="mt-4 text-xl font-semibold text-slate-900">
                                        {progressTitle}
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-600">
                                        {progressDescription}
                                    </p>

                                    <div className="mt-5 space-y-3">
                                        <ProgressChecklistItem
                                            title="이미지 준비"
                                            description="압축 및 업로드용 전처리"
                                            status={isCompressing ? 'current' : previewUrl ? 'done' : 'pending'}
                                        />
                                        <ProgressChecklistItem
                                            title="음식 분석"
                                            description="음식명과 영양 정보 추정"
                                            status={isAnalyzing ? 'current' : analyzedData ? 'done' : (isSaving ? 'done' : 'pending')}
                                        />
                                        <ProgressChecklistItem
                                            title="기록 저장"
                                            description="기록을 남기고 목록에 반영"
                                            status={isSaving ? 'current' : didPersist ? 'done' : 'pending'}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Compression Info Badge */}
                        {compressionInfo && !isCompressing && !isAnalyzing && !isSaving && (
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

                    {/* Candidate Selector */}
                    {analyzedData && !hasMultipleFoods(analyzedData) && showCandidates && analyzedData.candidates && analyzedData.candidates.length > 0 && (
                        <CandidateSelector
                            candidates={analyzedData.candidates}
                            onSelect={handleCandidateSelect}
                            onManualInput={() => {
                                alert('아래 결과 카드의 ✏️ 버튼을 눌러 직접 수정할 수 있습니다.');
                            }}
                        />
                    )}

                    {/* Results */}
                    {analyzedData && (
                        <>
                            <FoodAnalysisResult
                                imageSrc={previewUrl}
                                data={analyzedData}
                                mealLabel={mealLabel}
                                onSave={(finalData) => {
                                    setAnalyzedData(finalData as any); // Update local state with final edit
                                    // Slight delay to allow state update before save
                                    setTimeout(handleConfirm, 0);
                                }}
                                onRetake={resetScanner}
                            />

                            {/* Confirmation Options */}
                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={isPublic}
                                        onChange={(e) => setIsPublic(e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span>익명 집계에 포함</span>
                                </label>
                            </div>

                            <Card padding="lg" className="border border-black shadow-none">
                                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                                    {didPersist ? '이제 여기서 끝내거나 다음으로 넘어가면 됩니다' : '저장 후 확인'}
                                </h3>

                                {didPersist && (
                                    <>
                                        <SuccessStateCard
                                            tone={saveState === 'success' ? 'success' : 'muted'}
                                            title={saveState === 'success' ? '기록이 저장되었습니다' : '이 기기에 기록을 남겼습니다'}
                                            description={saveState === 'success'
                                                ? '기록은 저장되었습니다. 지금은 기록 확인이나 다시 기록만 해도 충분합니다.'
                                                : '인터넷 상태에 따라 전체 목록 반영이 늦을 수 있어, 우선 이 기기에 기록을 남겨뒀습니다.'}
                                        />
                                        {saveDiagnostic && (
                                            <div className="mt-3">
                                                <DiagnosticCard
                                                    label="저장 상태"
                                                    tone={saveState === 'success' ? 'info' : 'warning'}
                                                    title={saveState === 'success' ? '전체 목록 반영 안내' : '저장 안내'}
                                                    description={saveDiagnostic}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    <Link href="/history" className="block">
                                        <Button
                                            size="lg"
                                            fullWidth
                                            className="w-full border border-black bg-black text-white shadow-none"
                                        >
                                            보관함 보기
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        fullWidth
                                        onClick={resetScanner}
                                        className="w-full border-black bg-white shadow-none"
                                        leftIcon={<RotateCcw className="h-4 w-4" />}
                                    >
                                        다시 기록
                                    </Button>
                                </div>
                                <div className="mt-3">
                                    <Link href="/meal" className="text-sm font-medium text-slate-600 underline-offset-4 hover:underline">
                                        추천이 필요하면 다음 식사 추천 보기
                                    </Link>
                                </div>
                            </Card>

                        </>
                    )}

                    {!didPersist && (
                        <button
                            onClick={resetScanner}
                            disabled={isSaving}
                            className="w-full rounded-xl border-2 border-slate-300 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            다른 사진 분석하기
                        </button>
                    )}
                </div>
            )
            }

            {/* Snackbar */}
            <SimpleSnackbar
                isVisible={!!message}
                message={message || ''}
                onClose={() => setMessage(null)}
            />
        </div >
    );
}

function ProgressChecklistItem({
    title,
    description,
    status,
}: {
    title: string;
    description: string;
    status: 'pending' | 'current' | 'done';
}) {
    const active = status === 'current';
    const done = status === 'done';

    return (
        <div className="flex gap-3">
            <div
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border"
                style={{
                    backgroundColor: done ? 'var(--color-primary-soft)' : 'var(--color-surface-muted)',
                    borderColor: active ? 'var(--color-primary)' : 'var(--color-border)',
                    color: done || active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                }}
            >
                {done ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-[11px] font-semibold">{active ? '...' : '•'}</span>}
            </div>
            <div>
                <p className="font-medium text-slate-900 dark:text-white">{title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
            </div>
        </div>
    );
}
