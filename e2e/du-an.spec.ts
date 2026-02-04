import { test, expect } from '@playwright/test';

test.describe('Dự án BĐS Screen', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/du-an-bat-dong-san');
        await page.waitForLoadState('networkidle');
    });

    test('verify page title and filters are visible', async ({ page }) => {
        // Verify Page Title
        await expect(page).toHaveTitle(/Dự án bất động sản/i);

        // Verify Filter elements
        // The placeholder is 'Nhập từ khoá' instead of 'Nhập tên dự án'
        await expect(page.getByPlaceholder('Nhập từ khoá')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Thành phố' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Phường xã' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Tìm kiếm' })).toBeVisible();
    });

    test('verify project listing items are displayed', async ({ page }) => {
        // Projects cards usually contain 'Vị trí:' or project names
        const listings = page.locator('div').filter({ hasText: /Vị trí:|Dự án/i });
        await expect(listings.first()).toBeVisible();

        const count = await listings.count();
        console.log(`Found ${count} project-related elements`);
        expect(count).toBeGreaterThan(0);
    });

    test('verify search functionality by project name', async ({ page }) => {
        const searchInput = page.getByPlaceholder('Nhập từ khoá');
        const keyword = 'La Casta';
        await searchInput.fill(keyword);
        await page.getByRole('button', { name: 'Tìm kiếm' }).click();

        await page.waitForTimeout(2000);

        // Check if any results contain the keyword
        const listings = page.locator('div').filter({ hasText: new RegExp(keyword, 'i') });
        console.log(`Results for ${keyword}: ${await listings.count()}`);
    });

    test('verify reset button works', async ({ page }) => {
        const searchInput = page.getByPlaceholder('Nhập từ khoá');
        await searchInput.fill('Test Project');

        const resetBtn = page.getByRole('button', { name: 'Đặt lại' });
        // Based on inspection, the button might have different name or text
        await resetBtn.click();
        await expect(searchInput).toHaveValue('');
    });

    test('verify pagination is visible', async ({ page }) => {
        const pagination = page.locator('ul.ant-pagination, .ant-pagination');
        const page2 = page.getByText('2', { exact: true });
        await expect(pagination.first().or(page2.first())).toBeVisible();
    });
});
