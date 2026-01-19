
import { NextRequest, NextResponse } from 'next/server';
import { verifyCode, validateEmailFormat, supabaseAdmin } from '@/lib/auth/verification-service';
import { signToken, getTokenExpirySeconds } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
    try {
        const { email, code, deviceId, purpose = 'signup' } = await request.json();

        console.log(`[AUTH] 인증번호 검증 요청: ${email}, purpose: ${purpose}`);

        // 1. 입력값 검증
        if (!email || !code) {
            return NextResponse.json(
                { error: 'MISSING_PARAMS', message: '이메일과 인증번호를 입력해주세요.' },
                { status: 400 }
            );
        }

        if (!validateEmailFormat(email)) {
            return NextResponse.json(
                { error: 'INVALID_EMAIL', message: '올바른 이메일 형식이 아닙니다.' },
                { status: 400 }
            );
        }

        if (!/^\d{6}$/.test(code)) {
            return NextResponse.json(
                { error: 'INVALID_CODE', message: '6자리 숫자를 입력해주세요.' },
                { status: 400 }
            );
        }

        // 2. 인증번호 검증
        const result = await verifyCode(email, code);
        if (!result.valid) {
            return NextResponse.json(
                { error: 'VERIFICATION_FAILED', message: result.message },
                { status: 400 }
            );
        }

        let profile;
        let isNewUser = false;

        if (purpose === 'signup') {
            // 3a. 회원가입: 새 프로필 생성
            const { data: newProfile, error } = await supabaseAdmin
                .from('user_profiles')
                .insert({
                    email: email.toLowerCase(),
                    email_verified: true,
                    email_verified_at: new Date().toISOString(),
                    auth_method: 'email',
                    device_ids: deviceId ? [deviceId] : [],
                    login_count: 1,
                    last_login_at: new Date().toISOString(),
                    // Fix: Generate random ID to satisfy NOT NULL constraint
                    anonymous_user_id: crypto.randomUUID(),
                })
                .select()
                .single();

            if (error) throw error;
            profile = newProfile;
            isNewUser = true;

            // Anonymous 데이터 클레임
            if (deviceId) {
                const claimResult = await supabaseAdmin.rpc('claim_anonymous_data_by_email', {
                    p_device_id: deviceId,
                    p_email: email.toLowerCase(),
                    p_profile_id: profile.id,
                });
                console.log('[AUTH] Anonymous data claimed:', claimResult.data);
            }

            console.log(`[AUTH] ✅ 신규 사용자 생성: ${profile.id}`);
        } else {
            // 3b. 로그인: 기존 프로필 조회 및 업데이트
            const { data: existingProfile, error } = await supabaseAdmin
                .from('user_profiles')
                .select('*')
                .eq('email', email.toLowerCase())
                .single();

            if (error || !existingProfile) {
                return NextResponse.json(
                    { error: 'PROFILE_NOT_FOUND', message: '프로필을 찾을 수 없습니다.' },
                    { status: 404 }
                );
            }

            // device_id 추가 및 로그인 정보 업데이트
            const currentDeviceIds = existingProfile.device_ids || [];
            const updatedDeviceIds = deviceId && !currentDeviceIds.includes(deviceId)
                ? [...currentDeviceIds, deviceId]
                : currentDeviceIds;

            await supabaseAdmin
                .from('user_profiles')
                .update({
                    device_ids: updatedDeviceIds,
                    last_login_at: new Date().toISOString(),
                    login_count: (existingProfile.login_count || 0) + 1,
                })
                .eq('id', existingProfile.id);

            profile = existingProfile;
            console.log(`[AUTH] ✅ 기존 사용자 로그인: ${profile.id}`);
        }

        // 4. JWT 토큰 발급
        const token = signToken({
            userId: profile.id,
            email: profile.email,
            emailVerified: true,
            deviceId,
        });

        // 5. 응답 생성
        const response = NextResponse.json({
            success: true,
            message: isNewUser ? '회원가입이 완료되었습니다.' : '로그인되었습니다.',
            data: {
                token,
                user: {
                    id: profile.id,
                    email: profile.email,
                    emailVerified: profile.email_verified,
                    onboardingCompleted: profile.onboarding_completed || false,
                    createdAt: profile.created_at,
                },
                isNewUser,
            },
        });

        // 6. HttpOnly 쿠키 설정
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: getTokenExpirySeconds(),
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('[AUTH] ❌ 인증 검증 오류:', error);
        return NextResponse.json(
            { error: 'SERVER_ERROR', message: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
