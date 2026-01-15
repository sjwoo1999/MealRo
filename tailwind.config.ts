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
                primary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
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
        },
    },
    plugins: [],
};

export default config;
