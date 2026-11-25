import { test, expect } from '@playwright/test';

test('library loads six published texts and remains within viewport', async ({ page }, testInfo) => {
  await page.goto('/paath/');
  const cards = page.locator('[data-prayer-card]:visible');
  await expect(cards).toHaveCount(6);
  await expect(page.getByRole('heading', { name: 'आरती, चालीसा और स्तोत्र', exact: true })).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'भक्ति पाठ में खोजें' })).toBeVisible();
  await expect(page.locator('.deity-tile')).toHaveCount(4);

  // Navigation itself scrolls horizontally on narrow screens; the page must not.
  const horizontalOverflow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    pageWidth: document.documentElement.scrollWidth,
  }));
  expect(horizontalOverflow.pageWidth, 'Unexpected horizontal page overflow').toBeLessThanOrEqual(horizontalOverflow.viewport + 2);
  await page.screenshot({ path: testInfo.outputPath('devotional-library.png'), fullPage: true });
});

test('Hindi title search and Sanskrit original-text search work', async ({ page }) => {
  await page.goto('/paath/');
  const search = page.getByRole('searchbox', { name: 'भक्ति पाठ में खोजें' });
  await search.fill('हनुमान');
  await expect(page.locator('[data-prayer-card]:visible')).toHaveCount(1);
  await expect(page.locator('[data-prayer-card]:visible')).toContainText('हनुमान चालीसा');

  await search.fill('मुदाकरात्तमोदकं');
  await expect(page.locator('[data-prayer-card]:visible')).toHaveCount(1);
  await expect(page.locator('[data-prayer-card]:visible')).toContainText('गणेश पंचरत्न');

  await search.fill('असम्भवअद्वितीयखोजपरीक्षण९९९');
  await expect(page.locator('[data-prayer-card]:visible')).toHaveCount(0);
  await expect(page.getByText('कोई पाठ नहीं मिला')).toBeVisible();

  await page.getByRole('button', { name: 'खोज साफ़ करें' }).click();
  await expect(page.locator('[data-prayer-card]:visible')).toHaveCount(6);
  await expect(search).toHaveValue('');
});

test('type and deity filters can be combined and reset', async ({ page }) => {
  await page.goto('/paath/');
  await page.locator('[data-kind-filter="aarti"]').click();
  await expect(page.locator('[data-prayer-card]:visible')).toHaveCount(3);
  await page.locator('[data-deity-filter="ganesh"]').click();
  await expect(page.locator('[data-prayer-card]:visible')).toHaveCount(2);
  await expect(page.locator('[data-kind-filter="aarti"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-deity-filter="ganesh"]')).toHaveAttribute('aria-pressed', 'true');

  await page.locator('[data-kind-filter="stotra"]').click();
  await expect(page.locator('[data-prayer-card]:visible')).toHaveCount(1);
  await page.locator('[data-deity-filter="hanuman"]').click();
  await expect(page.locator('[data-prayer-card]:visible')).toHaveCount(0);
  await expect(page.getByText('कोई पाठ नहीं मिला')).toBeVisible();

  await page.getByRole('button', { name: 'खोज साफ़ करें' }).click();
  await expect(page.locator('[data-prayer-card]:visible')).toHaveCount(6);
});

test('deity archive links work and contain only matching texts', async ({ page }) => {
  await page.goto('/paath/');
  await page.getByRole('link', { name: /श्री गणेश\s*3 पाठ/ }).click();
  await expect(page).toHaveURL(/\/paath\/devta\/ganesh\/$/);
  await expect(page.locator('.prayer-browser-card')).toHaveCount(3);
  await expect(page.locator('h1')).toContainText('श्री गणेश');
  await page.getByRole('link', { name: /श्री गणेश पंचरत्न/ }).click();
  await expect(page).toHaveURL(/\/paath\/ganesha-pancharatnam\/$/);
  await expect(page.getByRole('heading', { name: 'पाँच मूल श्लोक' })).toBeVisible();
});

test('mobile reader shows full verses, adjusts font size and prints', async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    window.__printCalled = false;
    window.print = () => { window.__printCalled = true; };
  });
  await page.goto('/paath/hanuman-chalisa/');
  await expect(page.getByRole('heading', { name: /हनुमान चालीसा संपूर्ण पाठ/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'चालीस चौपाइयाँ' })).toBeVisible();
  await expect(page.locator('#prayer-text')).toContainText('तुलसीदास सदा हरि चेरा');
  await expect(page.locator('#prayer-text')).toContainText('राम लखन सीता सहित');

  const font = page.locator('.prayer-prose blockquote p').first();
  const before = await font.evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
  await page.getByRole('button', { name: 'पाठ का आकार बढ़ाएँ' }).click();
  const after = await font.evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
  expect(after).toBeGreaterThan(before);

  await page.getByRole('button', { name: 'प्रिंट करें' }).click();
  expect(await page.evaluate(() => window.__printCalled)).toBe(true);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
  await page.screenshot({ path: testInfo.outputPath('hanuman-chalisa-reader.png'), fullPage: true });
});

test('prayer page displays its original language and correct deity', async ({ page }) => {
  await page.goto('/paath/sukhkarta-dukhharta/');
  await expect(page.locator('.prayer-byline')).toContainText('मूल भाषा: मराठी');
  await expect(page.locator('#prayer-text')).toContainText('सुखकर्ता दुःखहर्ता');
  await expect(page.locator('#prayer-text blockquote[lang="mr"]').first()).toBeVisible();
  await page.goto('/paath/shiva-panchakshara-stotram/');
  await expect(page.locator('.prayer-byline')).toContainText('मूल भाषा: संस्कृत');
  await expect(page.locator('#prayer-text blockquote[lang="sa"]').first()).toBeVisible();
  await expect(page.getByRole('link', { name: /भगवान शिव के अन्य पाठ/ })).toBeVisible();
});
