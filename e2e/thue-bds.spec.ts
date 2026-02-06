import { test, expect } from '@playwright/test';

test.describe('Thuê BĐS Screen', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/danh-sach-cho-thue-bat-dong-san');
        await page.waitForLoadState('networkidle');
    });

    test('verify page title and filters are visible', async ({ page }) => {
        // Verify Page Title
        await expect(page).toHaveTitle(/Danh sách thuê bất động sản/i);

        // Verify Filter elements
        await expect(page.getByPlaceholder('Nhập từ khoá')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Thành phố' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Phường xã' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Dự án' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Tìm kiếm' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Đặt lại' })).toBeVisible();
    });

    test('verify rental listing items are displayed', async ({ page }) => {
        // Listings in rental often contain "triệu/tháng" or similar patterns.
        // We'll use a broad filter for now.
        const listings = page.locator('div').filter({ hasText: /m2|tỷ|triệu/ });
        await expect(listings.first()).toBeVisible();

        const count = await listings.count();
        console.log(`Found ${count} rental listing-related elements`);
        expect(count).toBeGreaterThan(0);
    });

    test('verify search functionality by keyword', async ({ page }) => {
        const searchInput = page.getByPlaceholder('Nhập từ khoá');
        const keyword = 'Chung cư';
        await searchInput.fill(keyword);
        await page.getByRole('button', { name: 'Tìm kiếm' }).click();

        await page.waitForTimeout(2000);

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
        // Check if pagination exists (assuming there's enough data for multiple pages)
        const page2 = page.getByRole('listitem').filter({ hasText: '2' });
        const nextBtn = page.getByRole('listitem', { name: 'Next Page' }).or(page.locator('.ant-pagination-next'));

        // Check for either page 2 or the next button
        await expect(page2.first().or(nextBtn.first())).toBeVisible();
    });

    const expectedCities = [
        "Tất cả", "Hà Nội", "Hồ Chí Minh", "An Giang", "Bắc Ninh", "Cà Mau",
        "Cần Thơ", "Cao Bằng", "Đắk Lắk", "Đà Nẵng", "Điện Biên", "Đồng Nai",
        "Đồng Tháp", "Gia Lai", "Hải Phòng", "Hà Tĩnh", "Huế", "Hưng Yên",
        "Khánh Hòa", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Nghệ An",
        "Ninh Bình", "Phú Thọ", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị",
        "Sơn La", "Tây Ninh", "Thái Nguyên", "Thanh Hoá", "Tuyên Quang", "Vĩnh Long"
    ];

    test('verify "Thành phố" dropdown contains correct data', async ({ page }) => {
        await page.getByRole('button', { name: 'Thành phố' }).first().click();
        const dropdownList = page.getByRole('listbox');
        await expect(dropdownList).toBeVisible();

        const actualText = await dropdownList.innerText();
        for (const city of expectedCities) {
            expect(actualText).toContain(city);
        }
    });

    test('verify "Thành phố" dropdown shows correct selected value', async ({ page }) => {
        const cityToSelect = 'Hà Nội';
        const dropdownBtn = page.getByRole('button', { name: 'Thành phố' }).first();

        await dropdownBtn.click();
        // Click the option from the listbox
        await page.getByRole('option', { name: cityToSelect, exact: true }).click();

        // After selection, the button should show the selected city name
        await expect(dropdownBtn).toContainText(cityToSelect);
    });

});