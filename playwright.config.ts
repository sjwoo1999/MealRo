import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 30_000,
    fullyParallel: false,
    reporter: 'list',
    use: {
        baseURL: 'http://127.0.0.1:3012',
        trace: 'on-first-retry',
    },
    webServer: {
        command: 'npm run build && PORT=3012 npm start',
        url: 'http://127.0.0.1:3012',
        reuseExistingServer: false,
        timeout: 180_000,
    },
});
