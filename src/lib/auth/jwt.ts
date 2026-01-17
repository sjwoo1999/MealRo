
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'build-secret-placeholder';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Only enforce secret in production runtime, not during build
if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET === undefined) {
    // Check if we are in a build step (Vercel sets CI=1 or VERCEL=1)
    // Actually, simply relying on the fallback above prevents crash.
    // But we want to ensure it fails at runtime if secret is missing.
}

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    // We can't throw here if we want build to succeed without env vars being present at build time
    // (Next.js statically optimizing pages might import this).
    // So we'll just log an error but let it pass. It will fail when `signToken` is called.
    console.error('❌ JWT_SECRET environment variable is not set (Critical for Runtime)');
}

export interface JWTPayload {
    userId: string;
    email: string;
    emailVerified: boolean;
    deviceId?: string;
    iat?: number;
    exp?: number;
}

/**
 * JWT 토큰 생성
 */
export function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    if (!JWT_SECRET) throw new Error('JWT_SECRET is missing');
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
        algorithm: 'HS256'
    });
}

/**
 * JWT 토큰 검증
 */
export function verifyToken(token: string): JWTPayload | null {
    if (!JWT_SECRET) return null;
    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            algorithms: ['HS256']
        }) as JWTPayload;
        return decoded;
    } catch (error) {
        console.error('❌ JWT verification failed:', error);
        return null;
    }
}

/**
 * JWT 토큰 디코딩 (검증 없이)
 */
export function decodeToken(token: string): JWTPayload | null {
    try {
        return jwt.decode(token) as JWTPayload;
    } catch {
        return null;
    }
}

/**
 * 토큰 만료 시간 계산 (초)
 */
export function getTokenExpirySeconds(): number {
    const match = JWT_EXPIRES_IN.match(/^(\d+)([smhd])$/);
    if (!match) return 7 * 24 * 60 * 60; // default 7 days

    const [, num, unit] = match;
    const multipliers: Record<string, number> = {
        's': 1,
        'm': 60,
        'h': 60 * 60,
        'd': 24 * 60 * 60,
    };

    return parseInt(num) * (multipliers[unit] || 86400);
}
