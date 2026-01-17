
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface UseAuthGuardOptions {
    required?: boolean;
    redirectTo?: string;
}

export function useAuthGuard(options?: UseAuthGuardOptions) {
    const { required = true, redirectTo = '/auth' } = options || {};
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    useEffect(() => {
        if (isLoading) return;

        if (required && !isAuthenticated) {
            const returnUrl = encodeURIComponent(pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''));
            router.push(`${redirectTo}?returnUrl=${returnUrl}`);
        }
    }, [isAuthenticated, isLoading, required, router, redirectTo, pathname, searchParams]);

    return { isAuthenticated, isLoading };
}
