import { test, expect } from '@playwright/test';

test.describe('MealRo smoke', () => {
    test('home meal card navigates to scan', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('link', { name: /점심/ }).click();
        await expect(page).toHaveURL(/\/scan\?meal=lunch/);
        await expect(page.getByRole('heading', { name: '점심 식사 기록' })).toBeVisible();
    });

    test('home loads', async ({ page }) => {
        const response = await page.goto('/');
        expect(response?.ok()).toBeTruthy();
        await expect(page.getByRole('heading', { name: '지금 먹는 식사를 바로 기록하세요' })).toBeVisible();
        await expect(page.getByRole('button', { name: '기록 보기' })).toBeVisible();
    });

    test('scan loads with selected meal', async ({ page }) => {
        const response = await page.goto('/scan?meal=lunch');
        expect(response?.ok()).toBeTruthy();
        await expect(page.getByRole('heading', { name: '점심 식사 기록' })).toBeVisible();
        await expect(page.getByText('음식 사진을 업로드하세요')).toBeVisible();
    });

    test('scan meal switch updates page context', async ({ page }) => {
        await page.goto('/scan?meal=lunch');
        await page.getByRole('link', { name: /저녁/ }).click();
        await expect(page).toHaveURL(/\/scan\?meal=dinner/);
        await expect(page.getByRole('heading', { name: '저녁 식사 기록' })).toBeVisible();
    });

    test('meal planner loads', async ({ page }) => {
        const response = await page.goto('/meal');
        expect(response?.ok()).toBeTruthy();
        await expect(page.getByRole('heading', { name: '추천', exact: true })).toBeVisible();
        await expect(page.getByRole('heading', { name: '기준 끼니를 고르세요' })).toBeVisible();
    });

    test('meal planner meal slot can be selected', async ({ page }) => {
        await page.goto('/meal');
        const breakfastButton = page.getByRole('button', { name: /아침/ });
        await breakfastButton.click();
        await expect(breakfastButton).toContainText('Selected');
    });

    test('nearby loads', async ({ page }) => {
        const response = await page.goto('/nearby');
        expect(response?.ok()).toBeTruthy();
        await expect(page.getByRole('heading', { name: '주변 탐색' })).toBeVisible();
        await expect(page.getByRole('heading', { name: '지금 바로 갈 수 있는 식당' })).toBeVisible();
    });

    test('nearby detail loads', async ({ page }) => {
        const response = await page.goto('/nearby/rest-1');
        expect(response?.ok()).toBeTruthy();
        await expect(page.getByRole('heading', { name: '식당 상세' })).toBeVisible();
        await expect(page.getByText('샐러드랩 시청점')).toBeVisible();
        await expect(page.getByRole('button', { name: '도착 확인으로 이동' })).toBeVisible();
    });

    test('arrived confirmation flow loads and confirms', async ({ page }) => {
        const response = await page.goto('/nearby/rest-1/arrived');
        expect(response?.ok()).toBeTruthy();
        await expect(page.getByRole('heading', { name: '도착 확인' })).toBeVisible();
        await page.getByRole('button', { name: '도착했어요' }).click();
        await expect(page.getByText('방문 흐름이 확인되었습니다')).toBeVisible();
    });

    test('feed loads', async ({ page }) => {
        const response = await page.goto('/feed');
        expect(response?.ok()).toBeTruthy();
        await expect(page.getByRole('heading', { name: '공개 기록' })).toBeVisible();
        await expect(page.getByText(/불러오지 못했습니다.|아직 올라온 기록이 없어요.|테스터|불러오는 중/).first()).toBeVisible();
    });

    test('feed primary action navigates somewhere meaningful', async ({ page }) => {
        await page.goto('/feed');

        const detailButtons = page.getByRole('button', { name: '상세 보기' });
        if (await detailButtons.count()) {
            await detailButtons.first().click();
            await expect(page).toHaveURL(/\/history\/.+/);
            await expect(page.getByRole('heading', { name: '기록 상세' })).toBeVisible();
            return;
        }

        const firstRecordButton = page.getByRole('button', { name: '첫 기록 올리기' });
        if (await firstRecordButton.count()) {
            await firstRecordButton.click();
            await expect(page).toHaveURL(/\/scan/);
            return;
        }

        // error state — page loaded but no interactive actions available
        await expect(page.getByRole('heading', { name: '공개 기록' })).toBeVisible();
    });

    test('mypage loads', async ({ page }) => {
        const response = await page.goto('/mypage');
        expect(response?.ok()).toBeTruthy();
        await expect(page.getByRole('heading', { name: '마이' })).toBeVisible();
        await expect(page.getByText(/테스터 [a-z0-9]{4}/i)).toBeVisible();
    });

    test('mypage quick action navigates to feed', async ({ page }) => {
        await page.goto('/mypage');
        await page.getByRole('button', { name: '전체 기록 보기' }).click();
        await expect(page).toHaveURL(/\/feed/);
    });

    test('history archive loads', async ({ page }) => {
        const response = await page.goto('/history');
        expect(response?.ok()).toBeTruthy();
        await expect(page.getByRole('heading', { name: '기록 보관함' })).toBeVisible();
        await expect(page.getByText(/보관함|아직 올라온 기록이 없어요.|불러오는 중/).first()).toBeVisible();
    });

    test('insights loads', async ({ page }) => {
        const response = await page.goto('/insights');
        expect(response?.ok()).toBeTruthy();
        await expect(page.getByRole('heading', { name: '분석' })).toBeVisible();
        await expect(page.getByText(/총 기록 수|아직 분석할 기록이 없어요/).first()).toBeVisible();
    });
});
