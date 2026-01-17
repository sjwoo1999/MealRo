
import { NextRequest, NextResponse } from 'next/server';
import {
    validateEmailFormat,
    checkEmailExists,
    generateVerificationCode,
    invalidatePreviousCodes,
    saveVerification,
    sendVerificationEmail,
} from '@/lib/auth/verification-service';

export async function POST(request: NextRequest) {
    try {
        const { email, purpose = 'signup' } = await request.json();
        const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        console.log(`[AUTH] 인증번호 요청: ${email}, purpose: ${purpose}`);

        // 1. 이메일 필수값 체크
        if (!email) {
            return NextResponse.json(
                { error: 'MISSING_EMAIL', message: '이메일을 입력해주세요.' },
                { status: 400 }
            );
        }

        // 2. 이메일 형식 검증
        if (!validateEmailFormat(email)) {
            return NextResponse.json(
                { error: 'INVALID_EMAIL', message: '올바른 이메일 형식이 아닙니다.' },
                { status: 400 }
            );
        }

        // 3. 회원가입 시 중복 확인
        if (purpose === 'signup') {
            const exists = await checkEmailExists(email);
            if (exists) {
                return NextResponse.json(
                    { error: 'DUPLICATE_EMAIL', message: '이미 등록된 이메일입니다. 로그인을 시도해주세요.' },
                    { status: 409 }
                );
            }
        }

        // 4. 로그인 시 존재 확인
        if (purpose === 'login') {
            const exists = await checkEmailExists(email);
            if (!exists) {
                return NextResponse.json(
                    { error: 'EMAIL_NOT_FOUND', message: '등록되지 않은 이메일입니다. 회원가입을 진행해주세요.' },
                    { status: 404 }
                );
            }
        }

        // 5. 인증번호 생성
        const code = generateVerificationCode();
        console.log(`[AUTH] 인증번호 생성: ${email}, code: ${code.substring(0, 2)}****`);

        // 6. 이전 인증번호 무효화
        await invalidatePreviousCodes(email);

        // 7. 새 인증번호 저장
        const saveResult = await saveVerification(email, code, purpose, clientIP, userAgent);
        if (!saveResult.success) {
            throw new Error(saveResult.error);
        }

        // 8. 이메일 발송
        const emailResult = await sendVerificationEmail(email, code);
        if (!emailResult.success) {
            throw new Error(emailResult.error);
        }

        console.log(`[AUTH] ✅ 인증번호 발송 성공: ${email}`);

        return NextResponse.json({
            success: true,
            message: '인증번호가 이메일로 전송되었습니다.',
            data: {
                email,
                expiresIn: 180, // 3분 (초)
            },
        });
    } catch (error: any) {
        console.error('[AUTH] ❌ 인증번호 발송 오류:', error);
        return NextResponse.json(
            { error: 'SERVER_ERROR', message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
            { status: 500 }
        );
    }
}
