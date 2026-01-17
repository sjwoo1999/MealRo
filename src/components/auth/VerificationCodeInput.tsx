
'use client';

import React, { useRef, useState, useEffect } from 'react';

interface VerificationCodeInputProps {
    length?: number;
    value: string;
    onChange: (code: string) => void;
    disabled?: boolean;
    error?: boolean;
}

export default function VerificationCodeInput({
    length = 6,
    value,
    onChange,
    disabled = false,
    error = false,
}: VerificationCodeInputProps) {
    const [digits, setDigits] = useState<string[]>(new Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // value prop이 외부에서 변경되었을 때 digits 상태 동기화
        // (예: 붙여넣기 후 value 변경 시)
        const newDigits = value.split('').slice(0, length);
        // 빈 자리 채우기
        while (newDigits.length < length) {
            newDigits.push('');
        }
        setDigits(newDigits);
    }, [value, length]);

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        // 숫자만 허용
        if (val && !/^\d+$/.test(val)) return;

        const newDigits = [...digits];

        // 마지막 입력값만 취함 (모바일 등에서 여러 글자가 들어올 수 있음)
        const char = val.slice(-1);
        newDigits[index] = char;
        setDigits(newDigits);
        onChange(newDigits.join(''));

        // 입력 후 자동으로 다음 칸 포커스
        if (char && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            // 현재 칸이 비어있고 백스페이스 누르면 이전 칸으로 이동
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);

        if (pastedData) {
            const newDigits = pastedData.split('');
            while (newDigits.length < length) {
                newDigits.push('');
            }
            setDigits(newDigits);
            onChange(newDigits.join(''));

            // 마지막 입력된 곳으로 포커스
            const lastIndex = Math.min(pastedData.length, length) - 1;
            if (lastIndex >= 0) {
                inputRefs.current[lastIndex]?.focus();
            }
        }
    };

    return (
        <div className="flex justify-center gap-2 sm:gap-4">
            {digits.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="tel" // 모바일 키패드용
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className={`
            w-10 h-12 sm:w-12 sm:h-14
            text-center text-2xl font-bold bg-white
            border rounded-xl shadow-sm outline-none transition-all duration-200
            ${error
                            ? 'border-red-500 text-red-500 bg-red-50'
                            : 'border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-gray-800'
                        }
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
          `}
                    aria-label={`Digit ${index + 1}`}
                    aria-invalid={error}
                />
            ))}
        </div>
    );
}
