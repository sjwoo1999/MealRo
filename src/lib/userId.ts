const USER_ID_KEY = 'mealro_anonymous_user_id';

/**
 * Generate or retrieve anonymous user ID
 * Stored in localStorage for persistence across sessions
 * No PII is collected - just a random UUID for analytics
 */
export function getAnonymousUserId(): string {
    if (typeof window === 'undefined') {
        // Server-side: return empty string (will be set on client)
        return '';
    }

    let userId = localStorage.getItem(USER_ID_KEY);

    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem(USER_ID_KEY, userId);
    }

    return userId;
}

/**
 * Clear anonymous user ID (for privacy/reset)
 */
export function clearAnonymousUserId(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(USER_ID_KEY);
    }
}
