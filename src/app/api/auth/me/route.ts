
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/auth/verification-service';

export async function GET(request: NextRequest) {
    try {
        // 쿠키 또는 Authorization 헤더에서 토큰 추출
        const token = request.cookies.get('auth_token')?.value ||
            request.headers.get('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json(
                { error: 'UNAUTHORIZED', message: '인증이 필요합니다.', user: null },
                { status: 401 }
            );
        }

        // 토큰 검증
        const payload = verifyToken(token);
        if (!payload) {
            // 쿠키 삭제
            const response = NextResponse.json(
                { error: 'INVALID_TOKEN', message: '유효하지 않은 토큰입니다.', user: null },
                { status: 401 }
            );
            response.cookies.delete('auth_token');
            return response;
        }

        // 프로필 조회
        const { data: profile, error } = await supabaseAdmin
            .from('user_profiles')
            .select('*')
            .eq('id', payload.userId)
            .single();

        if (error || !profile) {
            return NextResponse.json(
                { error: 'PROFILE_NOT_FOUND', message: '프로필을 찾을 수 없습니다.', user: null },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                id: profile.id,
                email: profile.email,
                emailVerified: profile.email_verified,
                onboardingCompleted: profile.onboarding_completed,
                tdee: profile.tdee,
                dietGoal: profile.diet_goal,
                createdAt: profile.created_at,
                lastLoginAt: profile.last_login_at,
            },
        });
    } catch (error: any) {
        console.error('[AUTH] ❌ 사용자 조회 오류:', error);
        return NextResponse.json(
            { error: 'SERVER_ERROR', message: '서버 오류가 발생했습니다.', user: null },
            { status: 500 }
        );
    }
}
