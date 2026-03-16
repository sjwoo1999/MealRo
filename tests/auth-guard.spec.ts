import { test, expect } from '@playwright/test';
import { mockAuthenticatedUser } from './helpers';

test.describe('인증 게이팅', () => {
    test.describe('비인증 → 보호된 페이지 리다이렉트', () => {
        test('/scan → /auth 리다이렉트', async ({ page }) => {
            await page.goto('/scan');
            await page.waitForURL(/\/auth/);
            expect(page.url()).toContain('/auth');
            expect(page.url()).toContain('returnUrl=%2Fscan');
        });

        test('/meal → /auth 리다이렉트', async ({ page }) => {
            await page.goto('/meal');
            await page.waitForURL(/\/auth/);
            expect(page.url()).toContain('/auth');
            expect(page.url()).toContain('returnUrl=%2Fmeal');
        });

        test('/history → /auth 리다이렉트', async ({ page }) => {
            await page.goto('/history');
            await page.waitForURL(/\/auth/);
            expect(page.url()).toContain('/auth');
            expect(page.url()).toContain('returnUrl=%2Fhistory');
        });

        test('/onboarding → /auth 리다이렉트', async ({ page }) => {
            await page.goto('/onboarding');
            await page.waitForURL(/\/auth/);
            expect(page.url()).toContain('/auth');
            expect(page.url()).toContain('returnUrl=%2Fonboarding');
        });
    });

    test.describe('홈 랜딩 (비인증 상태)', () => {
        test('"내 몸에 맞는 식사를 기록하세요" 헤딩 노출', async ({ page }) => {
            await page.goto('/');
            await expect(page.getByRole('heading', { name: '내 몸에 맞는 식사를 기록하세요' })).toBeVisible();
        });

        test('"시작하기" 버튼 노출', async ({ page }) => {
            await page.goto('/');
            await expect(page.getByRole('link', { name: '시작하기' })).toBeVisible();
        });

        test('"시작하기" 클릭 → /auth 이동', async ({ page }) => {
            await page.goto('/');
            await page.getByRole('link', { name: '시작하기' }).click();
            await expect(page).toHaveURL(/\/auth/);
        });
    });

    test.describe('홈 (인증된 상태)', () => {
        test('"지금 먹는 식사를 바로 기록하세요" 헤딩 노출', async ({ page }) => {
            await mockAuthenticatedUser(page);
            await page.goto('/');
            await expect(page.getByRole('heading', { name: '지금 먹는 식사를 바로 기록하세요' })).toBeVisible();
        });

        test('식사 카드 노출', async ({ page }) => {
            await mockAuthenticatedUser(page);
            await page.goto('/');
            await expect(page.getByRole('link', { name: /점심/ })).toBeVisible();
        });
    });

    test.describe('공개 페이지 (비인증 접근 가능)', () => {
        test('/feed 정상 접근', async ({ page }) => {
            const response = await page.goto('/feed');
            expect(response?.ok()).toBeTruthy();
            await expect(page.getByRole('heading', { name: '공개 기록' })).toBeVisible();
        });

        test('/nearby 정상 접근', async ({ page }) => {
            const response = await page.goto('/nearby');
            expect(response?.ok()).toBeTruthy();
            await expect(page.getByRole('heading', { name: '주변 탐색' })).toBeVisible();
        });
    });
});
