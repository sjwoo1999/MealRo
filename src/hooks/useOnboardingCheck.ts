import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import { UserProfile } from '@/types/user';

interface UseOnboardingCheckReturn {
    isLoading: boolean;
    isOnboarded: boolean;
    profile: UserProfile | null;
    refetch: () => Promise<void>;
}

export function useOnboardingCheck(
    options?: {
        redirectIfNotOnboarded?: boolean;
        skipOnPages?: string[];
    }
): UseOnboardingCheckReturn {
    const {
        isLoading,
        isOnboarded,
        profile,
        // We don't have refetch exposed directly in context yet, 
        // but for now we can rely on auto-fetch on mount.
        // I will just mock refetch as async void or update context to expose it properly later.
    } = useOnboardingContext();

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (isLoading) return;

        const shouldRedirect = options?.redirectIfNotOnboarded ?? false;
        const skipPages = options?.skipOnPages || ['/onboarding', '/about', '/disclaimer'];

        const isSkipPage = skipPages.some(page => pathname.startsWith(page));

        if (shouldRedirect && !isOnboarded && !isSkipPage) {
            router.push('/onboarding');
        }
    }, [isLoading, isOnboarded, pathname, options, router]);

    return {
        isLoading,
        isOnboarded,
        profile,
        refetch: async () => { } // Placeholder
    };
}
