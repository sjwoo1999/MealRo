
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useDeviceId } from '@/hooks/useDeviceId';
import VerificationCodeInput from '@/components/auth/VerificationCodeInput';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';

type AuthMode = 'signup' | 'login';
type AuthStep = 'email' | 'code' | 'success';

function AuthContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { refreshUser } = useAuth();
    const deviceId = useDeviceId();

    const [mode, setMode] = useState<AuthMode>('signup');
    const [step, setStep] = useState<AuthStep>('email');

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);

    // URL에서 초기 모드 및 리턴 URL 확인
    useEffect(() => {
        const modeParam = searchParams.get('mode');
        if (modeParam === 'login' || modeParam === 'signup') {
            setMode(modeParam);
        }
    }, [searchParams]);

    // 타이머 로직
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSendCode = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/send-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, purpose: mode }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || '인증번호 발송에 실패했습니다.');
            }

            setStep('code');
            setTimeLeft(180); // 3분
            setCode('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (code.length !== 6) return;

        setError(null);
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    code,
                    deviceId, // 회원가입 시 데이터 마이그레이션용
                    purpose: mode
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || '인증에 실패했습니다.');
            }

            // 성공 처리
            await refreshUser(); // 세션 업데이트
            setStep('success');

            // 리다이렉트 (잠시 후 이동)
            setTimeout(() => {
                const returnUrl = searchParams.get('returnUrl');
                if (returnUrl) {
                    router.push(decodeURIComponent(returnUrl));
                } else if (data.data?.isNewUser) {
                    router.push('/onboarding');
                } else {
                    router.push('/dashboard');
                }
            }, 1500);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // 모드 전환 시 상태 초기화
    const toggleMode = (newMode: AuthMode) => {
        setMode(newMode);
        setStep('email');
        setError(null);
        setCode('');
        setTimeLeft(0);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-green-600 mb-2">MealRo</h1>
                    <p className="text-gray-500">
                        {step === 'success'
                            ? '환영합니다!'
                            : mode === 'signup'
                                ? '이메일로 간편하게 시작하세요'
                                : '이메일로 간편 로그인'}
                    </p>
                </div>

                {step === 'success' ? (
                    <div className="text-center py-8 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">🎉</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">인증 성공!</h2>
                        <p className="text-gray-500">잠시 후 이동합니다...</p>
                    </div>
                ) : (
                    <>
                        {/* Tabs */}
                        {step === 'email' && (
                            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                                <button
                                    onClick={() => toggleMode('signup')}
                                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${mode === 'signup'
                                        ? 'bg-white text-green-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    회원가입
                                </button>
                                <button
                                    onClick={() => toggleMode('login')}
                                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${mode === 'login'
                                        ? 'bg-white text-green-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    로그인
                                </button>
                            </div>
                        )}

                        {/* Email Step */}
                        {step === 'email' && (
                            <form onSubmit={handleSendCode} className="space-y-4">
                                <Input
                                    label="이메일 주소"
                                    type="email"
                                    placeholder="example@email.com"
                                    value={email}
                                    onChange={(value) => setEmail(value)}
                                    error={error && error.includes('이메일') ? error : undefined}
                                    disabled={isLoading}
                                    required
                                />

                                {error && !error.includes('이메일') && (
                                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                        ⚠️ {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    fullWidth
                                    size="lg"
                                    loading={isLoading}
                                    className="mt-2"
                                >
                                    인증번호 받기
                                </Button>
                                <p className="text-xs text-gray-400 text-center mt-4">
                                    📩 인증번호가 안 오나요? <strong>스팸함</strong>을 꼭 확인해주세요!
                                </p>
                            </form>
                        )}

                        {/* Code Step */}
                        {step === 'code' && (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <p className="text-sm text-gray-500 mb-1">
                                        <span className="font-semibold text-gray-900">{email}</span>으로
                                    </p>
                                    <p className="text-sm text-gray-500">인증번호 6자리를 전송했습니다.</p>
                                </div>

                                <div className="space-y-2">
                                    <VerificationCodeInput
                                        value={code}
                                        onChange={setCode}
                                        error={!!error}
                                        disabled={isLoading}
                                    />
                                    {timeLeft > 0 ? (
                                        <p className="text-center text-sm text-green-600 font-medium">
                                            남은 시간: {formatTime(timeLeft)}
                                        </p>
                                    ) : (
                                        <p className="text-center text-sm text-red-500 font-medium">
                                            시간이 초과되었습니다. 다시 시도해주세요.
                                        </p>
                                    )}
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center animate-shake">
                                        ⚠️ {error}
                                    </div>
                                )}

                                <Button
                                    onClick={handleVerifyCode}
                                    fullWidth
                                    size="lg"
                                    loading={isLoading}
                                    disabled={code.length !== 6 || timeLeft === 0}
                                >
                                    인증하기
                                </Button>

                                <div className="flex justify-between items-center text-sm pt-2">
                                    <button
                                        onClick={() => setStep('email')}
                                        className="text-gray-500 hover:text-gray-900 underline"
                                    >
                                        이메일 다시 입력
                                    </button>
                                    <button
                                        onClick={handleSendCode}
                                        disabled={timeLeft > 150} // 3분 중 30초 지난 후부터 재전송 가능
                                        className={`font-medium ${timeLeft > 150 ? 'text-gray-300' : 'text-green-600 hover:text-green-700'
                                            }`}
                                    >
                                        인증번호 재전송
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </Card>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
            <AuthContent />
        </Suspense>
    );
}
