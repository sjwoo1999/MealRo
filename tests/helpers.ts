import { Page } from '@playwright/test';

export async function mockAuthenticatedUser(page: Page) {
    await page.route('/api/auth/me', route => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                success: true,
                user: {
                    id: 'test-user-1',
                    email: 'test@mealro.com',
                    emailVerified: true,
                    onboardingCompleted: true,
                    createdAt: new Date().toISOString(),
                },
            }),
        });
    });
}
