
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email/sendgrid';
import { generateVerificationEmailHTML, generateVerificationEmailText } from '@/lib/email/templates';

// Supabase Admin Client (Service Role)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

// 상수
const EXPIRATION_TIME_MS = 3 * 60 * 1000; // 3분
const MAX_ATTEMPTS = 5;

// ============================================
// 유틸리티 함수
// ============================================

/**
 * 6자리 인증번호 생성
 */
export function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * 인증번호 SHA256 해시화
 */
export function hashCode(code: string): string {
    return crypto.createHash('sha256').update(code).digest('hex');
}

/**
 * 이메일 형식 검증
 */
export function validateEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============================================
// 데이터베이스 함수
// ============================================

/**
 * 이메일 중복 확인
 */
export async function checkEmailExists(email: string): Promise<boolean> {
    const { data } = await supabaseAdmin
        .from('user_profiles')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();
    return !!data;
}

/**
 * 이전 인증번호 무효화
 */
export async function invalidatePreviousCodes(email: string): Promise<void> {
    await supabaseAdmin
        .from('email_verifications')
        .update({ consumed_at: new Date().toISOString() })
        .eq('email', email.toLowerCase())
        .is('consumed_at', null);
}

/**
 * 인증번호 저장
 */
export async function saveVerification(
    email: string,
    code: string,
    purpose: 'signup' | 'login' | 'recovery',
    ip?: string,
    userAgent?: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const expiresAt = new Date(Date.now() + EXPIRATION_TIME_MS);

        const { error } = await supabaseAdmin
            .from('email_verifications')
            .insert({
                email: email.toLowerCase(),
                purpose,
                code_hash: hashCode(code),
                expires_at: expiresAt.toISOString(),
                attempt_count: 0,
                max_attempts: MAX_ATTEMPTS,
                created_ip: ip || null,
                user_agent: userAgent || null,
            });

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error('❌ Failed to save verification:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// 핵심 서비스 함수
// ============================================

/**
 * 인증번호 이메일 발송
 */
export async function sendVerificationEmail(
    email: string,
    code: string
): Promise<{ success: boolean; error?: string }> {
    const html = generateVerificationEmailHTML(code, email);
    const text = generateVerificationEmailText(code, email);

    return sendEmail({
        to: email,
        subject: '[MealRo] 이메일 인증번호',
        html,
        text,
    });
}

/**
 * 인증번호 검증
 */
export async function verifyCode(
    email: string,
    code: string
): Promise<{ valid: boolean; message: string; verificationId?: string }> {
    try {
        const normalizedEmail = email.toLowerCase();
        const codeHash = hashCode(code);

        // 1. 유효한 인증번호 조회
        const { data: verification, error } = await supabaseAdmin
            .from('email_verifications')
            .select('*')
            .eq('email', normalizedEmail)
            .is('consumed_at', null)
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error || !verification) {
            return { valid: false, message: '유효한 인증번호가 없습니다. 다시 요청해주세요.' };
        }

        // 2. 시도 횟수 확인
        if (verification.attempt_count >= verification.max_attempts) {
            return { valid: false, message: '최대 시도 횟수를 초과했습니다. 인증번호를 다시 요청해주세요.' };
        }

        // 3. 시도 횟수 증가
        await supabaseAdmin
            .from('email_verifications')
            .update({
                attempt_count: verification.attempt_count + 1,
                updated_at: new Date().toISOString()
            })
            .eq('id', verification.id);

        // 4. 해시 비교
        if (verification.code_hash !== codeHash) {
            const remainingAttempts = verification.max_attempts - verification.attempt_count - 1;
            return {
                valid: false,
                message: `인증번호가 일치하지 않습니다. (${remainingAttempts}회 남음)`
            };
        }

        // 5. 인증 성공 - consumed 처리
        await supabaseAdmin
            .from('email_verifications')
            .update({ consumed_at: new Date().toISOString() })
            .eq('id', verification.id);

        return {
            valid: true,
            message: '인증이 완료되었습니다.',
            verificationId: verification.id
        };
    } catch (error: any) {
        console.error('❌ Verification error:', error);
        return { valid: false, message: '인증 처리 중 오류가 발생했습니다.' };
    }
}

/**
 * Supabase Admin Client 내보내기 (다른 모듈에서 사용)
 */
export { supabaseAdmin };
