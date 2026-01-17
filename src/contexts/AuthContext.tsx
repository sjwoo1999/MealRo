
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDeviceId } from '@/hooks/useDeviceId';

interface User {
    id: string;
    email: string;
    emailVerified: boolean;
    onboardingCompleted: boolean;
    tdee?: number;
    dietGoal?: string;
    createdAt: string;
    lastLoginAt?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    deviceId: string | null;
    login: (email: string, code: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const deviceId = useDeviceId();

    const refreshUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            const data = await res.json();

            if (res.ok && data.success) {
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = async (email: string, code: string) => {
        setIsLoading(true);
        try {
            // API call is handled in the component usually, but we can expose a helper here if needed.
            // However, for consistency with the design, AuthPage handles the API call and receives the token/user.
            // But typically AuthContext manages the session state. 
            // Since /verify-code sets a cookie, we just need to refresh the user state.

            await refreshUser();
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                deviceId,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
