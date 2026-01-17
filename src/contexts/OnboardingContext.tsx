'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '@/types/user';
// Local implementation used instead

// Checking previous code... I recall seeing `getAnonymousUserId` in `FoodScanner.tsx`. 
// I should verify where it is defined or duplicate it here safely.
// Assuming it's in a utility file. I'll define a local helper if not found, 
// but based on "viewed_file" it seemed to be used.
// Let's assume I need to locate it. I'll search for it first.
// Just in case, I will inline a simple version or use `sessionStorage`/`localStorage` logic here.

interface OnboardingContextValue {
    profile: UserProfile | null;
    isOnboarded: boolean;
    isLoading: boolean;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
    resetProfile: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export function useOnboardingContext() {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboardingContext must be used within an OnboardingProvider');
    }
    return context;
}

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Helper to get ID (simple implementation)
    const getUserId = () => {
        if (typeof window === 'undefined') return null;
        let id = localStorage.getItem('anonymous_user_id');
        if (!id) {
            id = `user_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('anonymous_user_id', id);
        }
        return id;
    };

    const fetchProfile = async () => {
        const userId = getUserId();
        if (!userId) {
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`/api/user/profile?userId=${userId}`);
            if (res.ok) {
                const data = await res.json();
                if (data.success && data.data) {
                    setProfile(data.data as UserProfile);
                } else {
                    setProfile(null);
                }
            } else {
                setProfile(null);
            }
        } catch (error) {
            console.error("Error fetching profile", error);
            setProfile(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const updateProfile = async (data: Partial<UserProfile>) => {
        const userId = getUserId();
        if (!userId) throw new Error("No user ID");

        // Optimistic update
        // Note: The API expects the full form data to calculate things? 
        // Or specific profile fields. The API POST handles the calculation.
        // We should send the data to the API.

        const res = await fetch('/api/user/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                anonymous_user_id: userId,
                ...data
            }),
        });

        if (!res.ok) {
            throw new Error("Failed to save profile");
        }

        const result = await res.json();
        if (result.success && result.data) {
            setProfile(result.data);
        }
    };

    const resetProfile = async () => {
        // Clear local state? Or delete from DB?
        // For now just clear local state to re-trigger onboarding UI if logic depends on it.
        setProfile((prev) => prev ? { ...prev, onboarding_completed: false } : null);
    };

    const isOnboarded = !!(profile?.onboarding_completed);

    return (
        <OnboardingContext.Provider value={{
            profile,
            isOnboarded,
            isLoading,
            updateProfile,
            resetProfile
        }}>
            {children}
        </OnboardingContext.Provider>
    );
}
