import { test, expect } from '@playwright/test';

test('verify navigation bar has logo', async ({ page }) => {
  await page.goto('/');

  // Verify there is a link to the homepage ('/') which serves as the logo.
  // We check if it contains an SVG or Image, as logos are usually graphic.
  const logoLink = page.locator('a[href="/"]').filter({ has: page.locator('svg, img') }).first();
  await expect(logoLink).toBeVisible();

  // Verify it is located in the top header area (e.g. y < 150)
  const box = await logoLink.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeLessThan(150);
});

// Menu items verification
test('verify navigation bar menu items', async ({ page }) => {
  // Use large viewport to ensure menu is expanded
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/');

  // Potential menu items
  const menuItems = [
    "Mua",
    "Thuê",
    "Sửa chữa - Cải tạo",
    "Vận hành - Bảo trì",
    "Dự án",
    "Tin tức - Tiện ích"
  ];

  for (const item of menuItems) {
    // Check for link or button, case insensitive, substring match
    const linkOrBtn = page.getByRole('link', { name: item, exact: false })
      .or(page.getByRole('button', { name: item, exact: false }));
    await expect(linkOrBtn.first()).toBeVisible();
  }
});


test('verify button "Ký gửi" is visible and clickable', async ({ page }) => {
  await page.goto('/');
  // Filter for a button or link containing "Ký gửi" with class "app-button"
  const btn = page.locator('.app-button').filter({ hasText: /Ký gửi/i }).first();

  await expect(btn).toBeVisible();
  await expect(btn).toBeEnabled();
});

//verify button "Ký gửi" is clickable
test('verify button "Ký gửi" is clickable', async ({ page }) => {
  await page.goto('/');
  // Filter for a button or link containing "Ký gửi" with class "app-button"
  const btn = page.locator('.app-button').filter({ hasText: /Ký gửi/i }).first();

  await expect(btn).toBeVisible();
  await expect(btn).toBeEnabled();
});

//verify text "Chạm tay vào tổ ấm hiện thực hoá ước mơ" is visible
test('verify Hero title is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Chạm tay vào tổ ấm hiện thực hoá ước mơ')).toBeVisible();
});

test('verify Hero subtitle and stats', async ({ page }) => {
  await page.goto('/');

  // Verify surrounding texts to confirm section location
  const topTextSource = 'Sàn bất động sản uy tín tại Hà Đông - Hà Nội. Cam kết đồng hành trọn vẹn trong hành trình tìm kiếm và xây dựng tổ ấm trong mơ của bạn.';
  const bottomTextSource = 'Dịch vụ của chúng tôi';

  await expect(page.getByText(topTextSource)).toBeVisible();
  await expect(page.getByText(bottomTextSource)).toBeVisible();

  // Verify labels
  // Note: "Số BĐS đã xác thực" is requested twice, verifying at least one instance exists.
  const labels = [
    "Dự án",
    "Số BĐS đã xác thực",
    "Khách hàng"
  ];

  for (const label of labels) {
    await expect(page.getByText(label).first()).toBeVisible();
  }

  // Optional: Verify relative positioning if needed, using the custom matcher
  // await expect(page.getByText("Dự án").first()).toBeBelow(page.getByText(topTextSource));
});

//verify Hero subtitle is visible
test('verify Hero subtitle is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Sàn bất động sản uy tín tại Hà Đông - Hà Nội. Cam kết đồng hành trọn vẹn trong hành trình tìm kiếm và xây dựng tổ ấm trong mơ của bạn.')).toBeVisible();
});

//verify text "Sàn bất động sản uy tín tại Hà Đông - Hà Nội. Cam kết đồng hành trọn vẹn trong hành trình tìm kiếm và xây dựng tổ ấm trong mơ của bạn." is under the text "Chạm tay vào tổ ấm hiện thực hoá ước mơ"


//verify text "Dịch vụ của chúng tôi" is visible
test('verify text "Dịch vụ của chúng tôi" is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Dịch vụ của chúng tôi')).toBeVisible();
});


//verify header having 4 cards "Môi giới bất động sản", "Sửa chữa - Cải tạo", "Vận hành - Bảo trì", "Tư vấn pháp lý"
test('verify header having 4 cards "Môi giới bất động sản", "Sửa chữa - Cải tạo", "Vận hành - Bảo trì", "Tư vấn pháp lý"', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.app-h-header__card').filter({ hasText: 'Môi giới bất động sản' })).toBeVisible();
  await expect(page.locator('.app-h-header__card').filter({ hasText: 'Sửa chữa - Cải tạo' })).toBeVisible();
  await expect(page.locator('.app-h-header__card').filter({ hasText: 'Vận hành - Bảo trì' })).toBeVisible();
  await expect(page.locator('.app-h-header__card').filter({ hasText: 'Tư vấn pháp lý' })).toBeVisible();
});

//verify card "Môi giới bất động sản" having description "Đội ngũ môi giới am hiểu thị trường, đồng hành cùng bạn tìm nhà, đất phù hợp với nhu cầu và ngân sách."
test('verify card "Môi giới bất động sản" having description "Đội ngũ môi giới am hiểu thị trường, đồng hành cùng bạn tìm nhà, đất phù hợp với nhu cầu và ngân sách."', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('.app-h-header__card').filter({ hasText: 'Môi giới bất động sản' });
  await expect(card.getByText('Đội ngũ môi giới am hiểu thị trường, đồng hành cùng bạn tìm nhà, đất phù hợp với nhu cầu và ngân sách.')).toBeVisible();
});

//verify card "Môi giới bất động sản" having button "Tìm nhà phù hợp"
test('verify card "Môi giới bất động sản" having button "Tìm nhà phù hợp"', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('.app-h-header__card').filter({ hasText: 'Môi giới bất động sản' });
  await expect(card.locator('.app-button').filter({ hasText: 'Tìm nhà phù hợp' })).toBeVisible();
});

//verify card "Môi giới bất động sản" having button "Tìm nhà phù hợp" is clickable
test('verify card "Môi giới bất động sản" having button "Tìm nhà phù hợp" is clickable', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('.app-h-header__card').filter({ hasText: 'Môi giới bất động sản' });
  await expect(card.locator('.app-button').filter({ hasText: 'Tìm nhà phù hợp' })).toBeVisible();
  await expect(card.locator('.app-button').filter({ hasText: 'Tìm nhà phù hợp' })).toBeEnabled();
});

//verify card "Môi giới bất động sản" having button "Tìm nhà phù hợp" is clickable and navigate to /danh-sach-ban-bat-dong-san  
test('verify card "Môi giới bất động sản" having button "Tìm nhà phù hợp" is clickable and navigate to /danh-sach-ban-bat-dong-san', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('.app-h-header__card').filter({ hasText: 'Môi giới bất động sản' });
  await expect(card.locator('.app-button').filter({ hasText: 'Tìm nhà phù hợp' })).toBeVisible();
  await expect(card.locator('.app-button').filter({ hasText: 'Tìm nhà phù hợp' })).toBeEnabled();
  await card.locator('.app-button').filter({ hasText: 'Tìm nhà phù hợp' }).click();
  await expect(page).toHaveURL('/danh-sach-ban-bat-dong-san');
});

//verify card "Sửa chữa - Cải tạo" having description "Tư vấn giải pháp sửa chữa, cải tạo trọn gói, tối ưu công năng và chi phí, giúp ngôi nhà của bạn đẹp và bền hơn."
test('verify card "Sửa chữa - Cải tạo" having description "Tư vấn giải pháp sửa chữa, cải tạo trọn gói, tối ưu công năng và chi phí, giúp ngôi nhà của bạn đẹp và bền hơn."', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('.app-h-header__card').filter({ hasText: 'Sửa chữa - Cải tạo' });
  await expect(card.getByText('Tư vấn giải pháp sửa chữa, cải tạo trọn gói, tối ưu công năng và chi phí, giúp ngôi nhà của bạn đẹp và bền hơn.')).toBeVisible();
});

//verify card "Sửa chữa - Cải tạo" having button "Gửi yêu cầu sửa chữa  "
test('verify card "Sửa chữa - Cải tạo" having button "Gửi yêu cầu sửa chữa"', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('.app-h-header__card').filter({ hasText: 'Sửa chữa - Cải tạo' });
  await expect(card.locator('.app-button').filter({ hasText: 'Gửi yêu cầu sửa chữa' })).toBeVisible();
});

//verify card "Sửa chữa - Cải tạo" having button "Gửi yêu cầu sửa chữa" is clickable
test('verify card "Sửa chữa - Cải tạo" having button "Gửi yêu cầu sửa chữa" is clickable', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('.app-h-header__card').filter({ hasText: 'Sửa chữa - Cải tạo' });
  await expect(card.locator('.app-button').filter({ hasText: 'Gửi yêu cầu sửa chữa' })).toBeVisible();
  await expect(card.locator('.app-button').filter({ hasText: 'Gửi yêu cầu sửa chữa' })).toBeEnabled();
});

//verify card "Vận hành - Bảo trì" having correct description
test('verify card "Vận hành - Bảo trì" having correct description', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('.app-h-header__card').filter({ hasText: 'Vận hành - Bảo trì' });
  await expect(card.getByText('Hỗ trợ vận hành, bảo trì nhà cho thuê từ xa, giảm rủi ro, tiết kiệm thời gian và đảm bảo tài sản luôn trong tình trạng tốt.')).toBeVisible();
});

//verify card "Vận hành - Bảo trì": button "Quản lý nhà cho thuê" is visible
test('verify card "Vận hành - Bảo trì": button "Quản lý nhà cho thuê" is visible', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('.app-h-header__card').filter({ hasText: 'Vận hành - Bảo trì' });
  await expect(card.locator('.app-button').filter({ hasText: 'Quản lý nhà cho thuê' })).toBeVisible();
});

//verify card "Vận hành - Bảo trì": button "Quản lý nhà cho thuê" is clickable
test('verify card "Vận hành - Bảo trì": button "Quản lý nhà cho thuê" is clickable', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('.app-h-header__card').filter({ hasText: 'Vận hành - Bảo trì' });
  await expect(card.locator('.app-button').filter({ hasText: 'Quản lý nhà cho thuê' })).toBeVisible();
  await expect(card.locator('.app-button').filter({ hasText: 'Quản lý nhà cho thuê' })).toBeEnabled();
});


//verify card "Tư vấn pháp lý": description "Tư vấn hồ sơ, hợp đồng, sổ đỏ và thủ tục mua bán, chuyển nhượng để mọi giao dịch đều an toàn, minh bạch."
test('verify card "Tư vấn pháp lý": description "Tư vấn hồ sơ, hợp đồng, sổ đỏ và thủ tục mua bán, chuyển nhượng để mọi giao dịch đều an toàn, minh bạch."', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('.app-h-header__card').filter({ hasText: 'Tư vấn pháp lý' });
  await expect(card.getByText('Tư vấn hồ sơ, hợp đồng, sổ đỏ và thủ tục mua bán, chuyển nhượng để mọi giao dịch đều an toàn, minh bạch.')).toBeVisible();
});

//verify card "Tư vấn pháp lý": button "Hỏi luật sổ đỏ - mua bán" is visible
test('verify card "Tư vấn pháp lý": button "Hỏi luật sổ đỏ - mua bán" is visible', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('.app-h-header__card').filter({ hasText: 'Tư vấn pháp lý' });
  await expect(card.locator('.app-button').filter({ hasText: 'Hỏi luật sổ đỏ - mua bán' })).toBeVisible();
});

//verify card "Tư vấn pháp lý": button "Hỏi luật sổ đỏ - mua bán" is clickable
test('verify card "Tư vấn pháp lý": button "Hỏi luật sổ đỏ - mua bán" is clickable', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('.app-h-header__card').filter({ hasText: 'Tư vấn pháp lý' });
  await expect(card.locator('.app-button').filter({ hasText: 'Hỏi luật sổ đỏ - mua bán' })).toBeVisible();
  await expect(card.locator('.app-button').filter({ hasText: 'Hỏi luật sổ đỏ - mua bán' })).toBeEnabled();
});

//verify text "Khu vược được tìm kiếm nhiều nhất" is visible
test('verify text "Khu vược được tìm kiếm nhiều nhất" is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('xpath=/html/body/div[2]/main/section/div/div[1]/div[1]')).toContainText('Khu vược được tìm kiếm nhiều nhất');
});

//verify popular search areas items
test('verify popular search areas items', async ({ page }) => {
  await page.goto('/');
  const container = page.locator('xpath=/html/body/div[2]/main/section/div/div[2]');

  // Verify 10 items
  await expect(container.locator('> *')).toHaveCount(10);

  // Verify aria-labels
  // 7 items with aria-label "Xem khu vực phường"
  await expect(container.locator('[aria-label]').filter({ hasText: /Xem khu vực Phường/i }).or(container.locator('[aria-label*="Xem khu vực Phường"]'))).toHaveCount(7);

  // Verify aria-labels
  // 2 items with aria-label "Xem khu vực xã"
  await expect(container.locator('[aria-label]').filter({ hasText: /Xem khu vực Xã/i }).or(container.locator('[aria-label*="Xem khu vực Xã"]'))).toHaveCount(2);

  // 1 item with aria-label "Khám phá bất động sản" 
  // Using case-insensitive regex for the label to be safe as user used different casings in requirements
  await expect(container.locator('[aria-label]').filter({ hasText: /Khám phá bất động sản/i }).or(container.locator('[aria-label*="Khám phá bất động sản"]'))).toHaveCount(1);


  // Verify texts
  const locationTexts = [
    "Phường Hà Đông", "Phường Dương Nội", "Phường Yên Nghĩa",
    "Phường Phú Lương", "Phường Kiến Hưng", "Phường Tây Mỗ",
    "Phường Đại Mỗ", "Xã An Khánh", "Xã Bình Minh"
  ];

  for (const text of locationTexts) {
    await expect(container).toContainText(text);
  }
});
