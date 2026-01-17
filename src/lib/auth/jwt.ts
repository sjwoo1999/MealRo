
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
    // In development/build, we might not have secrets yet, so we warn but don't crash immediately unless used
    if (process.env.NODE_ENV !== 'production') {
        console.warn('⚠️ JWT_SECRET environment variable is not set');
    } else {
        throw new Error('JWT_SECRET environment variable is not set');
    }
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
