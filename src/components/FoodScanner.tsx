'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { FoodData, FoodAnalysisResponse, needsVerification, hasMultipleFoods } from '@/types/food';
import { getAnonymousUserId } from '@/lib/userId';
import { compressImage, formatFileSize } from '@/lib/image-compress';
import AnalysisResult from '@/components/food/AnalysisResult';
import CandidateSelector from '@/components/CandidateSelector';
import SimpleSnackbar from '@/components/SimpleSnackbar';

type AnalyzedData = FoodData | { foods: FoodData[] };

// Helper type for safely accessing candidate
type Candidate = NonNullable<FoodData['candidates']>[number];

interface FoodScannerProps {
    onAnalysisComplete?: (data: AnalyzedData) => void;
    onSave?: (data: AnalyzedData) => void;
}

// Internal component for Typewriter effect
const TypewriterMessage = ({ messages }: { messages: string[] }) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const typeSpeed = 50;
        const deleteSpeed = 30;
        const pauseTime = 2000;

        const handleTyping = () => {
            const fullMessage = messages[currentMessageIndex];

            if (!isDeleting) {
                // Typing
                setCurrentText(fullMessage.substring(0, currentText.length + 1));

                if (currentText.length === fullMessage.length) {
                    setTimeout(() => setIsDeleting(true), pauseTime);
                }
            } else {
                // Deleting
                setCurrentText(fullMessage.substring(0, currentText.length - 1));

                if (currentText.length === 0) {
                    setIsDeleting(false);
                    setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
                }
            }
        };

        const timer = setTimeout(handleTyping, isDeleting ? deleteSpeed : typeSpeed);
        return () => clearTimeout(timer);
    }, [currentText, isDeleting, currentMessageIndex, messages]);

    return (
        <span className="inline-block min-h-[1.5em] align-bottom">
            {currentText}
            <span className="animate-pulse ml-0.5 border-r-2 border-current h-[1.2em] inline-block align-middle"></span>
        </span>
    );
};

export default function FoodScanner({ onAnalysisComplete, onSave }: FoodScannerProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const [analyzedData, setAnalyzedData] = useState<AnalyzedData | null>(null);
    const [processingTime, setProcessingTime] = useState<number>(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [compressionInfo, setCompressionInfo] = useState<string | null>(null);

    // New State for Multi-Candidate & Confirmation
    // New State for Multi-Candidate & Confirmation
    const [imageHash, setImageHash] = useState<string | null>(null);
    const [storagePath, setStoragePath] = useState<string | null>(null);
    const [showCandidates, setShowCandidates] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    const [message, setMessage] = useState<string | null>(null); // For Snackbar

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(async (file: File) => {
        setError(null);
        setAnalyzedData(null);
        setCompressionInfo(null);
        setImageHash(null);
        setStoragePath(null);
        setShowCandidates(false);
        setIsPublic(false);

        // ... existing preview code ...
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

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

        setIsAnalyzing(true);
        try {
            const formData = new FormData();
            formData.append('image', processedFile);
            formData.append('anonymousUserId', getAnonymousUserId());

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
            // Save storage path if available
            if (data.storage_path) {
                setStoragePath(data.storage_path);
            }

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
    }, [onAnalysisComplete]);

    // ... (omitting existing handleDrag/Drop/Click which are unchanged) 
    // Wait, I must provide contiguous block.
    // I will replace from `const handleFile` start to `handleConfirm` to be safe/clean or just the `handleFile` and `handleConfirm` parts.
    // Let's replace the state declarations and handleFile first. Actually better to use MultiReplace if possible but I only have ReplaceFileContent.
    // I will be precise.

    // ... (rest of code)

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
        setStoragePath(null);
        setShowCandidates(false);
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

    const handleConfirm = async () => {
        if (!analyzedData || !imageHash) {
            setMessage("저장할 데이터가 부족합니다.");
            return;
        }

        try {
            const response = await fetch('/api/food/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    anonymous_user_id: getAnonymousUserId(),
                    image_hash: imageHash,
                    food_data: analyzedData,
                    include_in_public_feed: isPublic,
                    processing_time_ms: processingTime,
                    storage_path: storagePath // Pass storage path for developer DB
                }),
            });

            const result = await response.json();
            if (result.success) {
                setMessage("식사가 기록되었습니다! 📝");
                if (onSave) onSave(analyzedData);
            } else {
                throw new Error(result.error);
            }
        } catch (e) {
            console.error(e);
            setMessage("저장에 실패했습니다.");
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
                        <div className="pt-2">
                            <span className="inline-block px-3 py-1 bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-300 text-xs rounded-full border border-violet-100 dark:border-violet-800">
                                ✨ 생성형 인공지능이 분석합니다
                            </span>
                        </div>
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

                        {/* Compressing/Analyzing Overlay - Premium Liquid Gradient Style */}
                        {(isCompressing || isAnalyzing) && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 dark:bg-black/90 backdrop-blur-xl transition-all duration-500">
                                {/* Liquid Gradient Orb */}
                                <div className="relative w-40 h-40">
                                    <div className="absolute top-0 -left-4 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                                    <div className="absolute top-0 -right-4 w-32 h-32 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                                    <div className="absolute -bottom-8 left-10 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

                                    {/* Central White/Dark Core to make it look like a ring/orb */}
                                    <div className="absolute inset-4 bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-inner">
                                        <div className="text-3xl animate-pulse text-white drop-shadow-lg">
                                            {isCompressing ? '⚡' : '✨'}
                                        </div>
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="mt-8 text-center space-y-3 z-20">
                                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 animate-gradient-text">
                                        {isCompressing ? 'Optimizing Image...' : 'Analyzing Food...'}
                                    </h3>
                                    <div className="text-sm text-slate-600 dark:text-slate-300 font-medium px-8 min-h-[40px] flex items-center justify-center">
                                        {isCompressing ? (
                                            <p className="animate-pulse">더 선명한 분석을 위해 다듬고 있어요 ✂️</p>
                                        ) : (
                                            <TypewriterMessage
                                                messages={[
                                                    "AI가 맛있는 냄새를 맡고 있습니다... 👃",
                                                    "칼로리를 계산하느라 머리를 굴리는 중... 🤯",
                                                    "이 음식, 정말 맛있어 보이네요! 😋",
                                                    "영양 성분을 꼼꼼히 체크하고 있어요 🔍",
                                                    "잠시만요, 셰프에게 물어보는 중입니다... 👨‍🍳",
                                                    "거의 다 됐어요! 비주얼이 훌륭하네요 ✨"
                                                ]}
                                            />
                                        )}
                                    </div>
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

                    {/* Candidate Selector (Shown for Single Food Low Confidence or Manual Trigger) */}
                    {analyzedData && !hasMultipleFoods(analyzedData) && showCandidates && analyzedData.candidates && analyzedData.candidates.length > 0 && (
                        <CandidateSelector
                            candidates={analyzedData.candidates}
                            onSelect={handleCandidateSelect}
                            onManualInput={() => {
                                // For MVP/Demo: Just focus on Edit button usage or simple alert
                                alert('아래 결과 카드의 ✏️ 버튼을 눌러 직접 수정할 수 있습니다.');
                            }}
                        />
                    )}

                    {/* Results */}
                    {analyzedData && (
                        <>
                            <AnalysisResult
                                data={analyzedData}
                                processingTimeMs={processingTime}
                                onEdit={(editedData) => {
                                    setAnalyzedData(editedData);
                                }}
                                onSave={handleConfirm}
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
                                    <span>내 기록을 익명 집계에 포함 (기본 OFF)</span>
                                </label>
                                <p className="text-xs text-slate-500 dark:text-slate-400 pl-6">
                                    사진은 서비스 개선을 위해 안전하게 저장되며, 음식명/분류/신뢰도만 익명으로 공개 피드에 집계됩니다.
                                </p>
                            </div>

                        </>
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
