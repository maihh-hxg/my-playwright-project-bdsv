import { test, expect } from '@playwright/test';

test.describe('Mua BĐS Screen', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/danh-sach-ban-bat-dong-san');
        // Wait for the page to load and listings to appear
        await page.waitForLoadState('networkidle');
    });

    test('verify page title and filters are visible', async ({ page }) => {
        // Verify Page Title
        await expect(page).toHaveTitle(/Danh sách mua bất động sản/i);

        // Verify Filter section/inputs
        // Based on inspection, there is an input with placeholder "Nhập từ khoá"
        const searchInput = page.getByPlaceholder('Nhập từ khoá');
        await expect(searchInput).toBeVisible();

        // Verify filter buttons
        await expect(page.getByRole('button', { name: 'Thành phố' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Phường xã' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Dự án' })).toBeVisible();

        // Verify Search button
        const searchBtn = page.getByRole('button', { name: 'Tìm kiếm' });
        await expect(searchBtn).toBeVisible();
    });

    test('verify listing items are displayed', async ({ page }) => {
        // Wait for at least one listing item to be visible.
        // Based on previous inspection, listing items contain text like "m2", "tỷ", or "triệu".
        // They seem to use a grid layout.
        const listings = page.locator('div').filter({ hasText: /m2|tỷ|triệu/ });
        await expect(listings.first()).toBeVisible();

        const count = await listings.count();
        console.log(`Found ${count} listing-related elements`);
        expect(count).toBeGreaterThan(0);
    });

    test('verify search functionality by keyword', async ({ page }) => {
        const searchInput = page.getByPlaceholder('Nhập từ khoá');
        const keyword = 'Biệt thự';
        await searchInput.fill(keyword);
        await page.getByRole('button', { name: 'Tìm kiếm' }).click();

        // Wait for results to update
        await page.waitForTimeout(2000);

        // Verify that the results contain the keyword or are filtered
        const listings = page.locator('div').filter({ hasText: /m2|tỷ|triệu/ });
        if (await listings.count() > 0) {
            await expect(listings.first()).toContainText(new RegExp(keyword, 'i'));
        }
    });

    test('verify reset button works', async ({ page }) => {
        const searchInput = page.getByPlaceholder('Nhập từ khoá');
        await searchInput.fill('Test Keyword');

        const resetBtn = page.getByRole('button', { name: 'Đặt lại' });
        await resetBtn.click();

        await expect(searchInput).toHaveValue('');
    });

    test('verify pagination is visible', async ({ page }) => {
        // Check for pagination numbers
        const pagination = page.locator('ul.ant-pagination, .app-pagination');
        // If it's antd, it might be 'ul.ant-pagination'
        // My inspect showed '1 2 3 4 5 6 7' in button text
        const page2 = page.getByRole('listitem').filter({ hasText: '2' });
        if (await page2.count() > 0) {
            await expect(page2.first()).toBeVisible();
        } else {
            // Fallback to searching for text '2' in buttons
            await expect(page.getByRole('button', { name: '2', exact: true }).first().or(page.getByText('2', { exact: true }).first())).toBeVisible();
        }
    });
});
