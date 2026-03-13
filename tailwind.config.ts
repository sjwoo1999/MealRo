import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            // 8pt spacing scale
            spacing: {
                '1': '0.25rem',   // 4px
                '2': '0.5rem',    // 8px
                '3': '0.75rem',   // 12px
                '4': '1rem',      // 16px
                '5': '1.25rem',   // 20px
                '6': '1.5rem',    // 24px
                '8': '2rem',      // 32px
                '10': '2.5rem',   // 40px
                '12': '3rem',     // 48px
                '16': '4rem',     // 64px
            },
            colors: {
                bg: 'var(--color-bg)',
                'bg-elevated': 'var(--color-bg-elevated)',
                surface: 'var(--color-surface)',
                'surface-muted': 'var(--color-surface-muted)',
                line: 'var(--color-border)',
                'line-strong': 'var(--color-border-strong)',
                copy: 'var(--color-text)',
                'copy-muted': 'var(--color-text-muted)',
                'copy-subtle': 'var(--color-text-subtle)',
                accent: 'var(--color-accent)',
                'accent-hover': 'var(--color-accent-hover)',
                'accent-soft': 'var(--color-accent-soft)',
                'accent-ring': 'var(--color-accent-ring)',
                danger: 'var(--color-danger)',
                'danger-soft': 'var(--color-danger-soft)',
                // keep primary for backwards compatibility temporarily
                primary: {
                    50: '#f3f6f1',
                    100: '#e5ece1',
                    200: '#ccd8c6',
                    300: '#adbdab',
                    400: '#859984',
                    500: '#546f52',
                    600: '#425943',
                    700: '#334639',
                    800: '#2a392f',
                    900: '#23302a',
                },
                grade: {
                    a: '#22c55e',  // green
                    b: '#3b82f6',  // blue
                    c: '#f59e0b',  // amber
                    d: '#ef4444',  // red
                },
            },
            fontFamily: {
                sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'sans-serif'],
            },
            borderRadius: {
                sm: 'var(--radius-sm)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
                pill: 'var(--radius-pill)',
            },
            boxShadow: {
                xs: 'var(--shadow-xs)',
                sm: 'var(--shadow-sm)',
                md: 'var(--shadow-md)',
            }
        },
    },
    plugins: [],
};

export default config;
