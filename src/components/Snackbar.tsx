'use client';

import { useEffect, useState, createContext, useContext, useCallback } from 'react';

interface SnackbarOptions {
    message: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface SnackbarContextValue {
    showSnackbar: (options: SnackbarOptions) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export function useSnackbar() {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
}

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
    const [snackbar, setSnackbar] = useState<SnackbarOptions | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const showSnackbar = useCallback((options: SnackbarOptions) => {
        setSnackbar(options);
        setIsVisible(true);
    }, []);

    useEffect(() => {
        if (!snackbar) return;

        const duration = snackbar.duration ?? 3000;
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => setSnackbar(null), 300); // Wait for animation
        }, duration);

        return () => clearTimeout(timer);
    }, [snackbar]);

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}

            {/* Snackbar UI */}
            {snackbar && (
                <div
                    role="status"
                    aria-live="polite"
                    className={`
            fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96
            p-4 bg-slate-800 dark:bg-slate-700 text-white
            rounded-lg shadow-lg
            flex items-center justify-between gap-4
            transition-all duration-300
            ${isVisible ? 'snackbar-enter' : 'opacity-0 translate-y-full'}
          `}
                >
                    <span className="text-sm">{snackbar.message}</span>

                    {snackbar.action && (
                        <button
                            onClick={() => {
                                snackbar.action?.onClick();
                                setIsVisible(false);
                            }}
                            className="
                text-sm font-semibold text-primary-400 hover:text-primary-300
                transition-colors
              "
                        >
                            {snackbar.action.label}
                        </button>
                    )}
                </div>
            )}
        </SnackbarContext.Provider>
    );
}
