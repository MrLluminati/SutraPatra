import { test, expect } from '@playwright/test';

async function expectNoHorizontalOverflow(page) {
  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(widths.content, 'Horizontal scrolling in the site layout').toBeLessThanOrEqual(widths.viewport + 2);
}

test('editorial homepage has cover artwork and legible content', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.locator('.editorial-intro h1')).toBeVisible();
  await expect(page.getByRole('link', { name: /नवीन लेख पढ़ें/ })).toBeVisible();
  await expect(page.locator('.intro-visual .artwork-svg')).toBeVisible();
  await expect(page.locator('.lead-art-link .artwork-svg')).toBeVisible();
  await expect(page.locator('.article-card .artwork-svg').first()).toBeVisible();
  await expect(page.locator('.prayer-home-section')).toBeVisible();

  const illustrated = await page.locator('.artwork-svg').count();
  expect(illustrated).toBeGreaterThan(3);
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: testInfo.outputPath('editorial-homepage.png'), fullPage: true });
});

test('article reading page has an illustrated cover and no mobile overflow', async ({ page }, testInfo) => {
  await page.goto('/lekh/bharatiya-panchang-kya-hai/');
  await expect(page.locator('.article-header h1')).toBeVisible();
  await expect(page.locator('.artwork-article .artwork-svg')).toBeVisible();
  await expect(page.locator('.prose h2').first()).toBeVisible();
  await expect(page.getByRole('link', { name: /मुखपृष्ठ/ }).first()).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: testInfo.outputPath('editorial-article.png'), fullPage: true });
});

test('manuscript reader uses paper style without clipping text', async ({ page }, testInfo) => {
  await page.goto('/paath/hanuman-chalisa/');
  const sheet = page.locator('.prayer-sheet');
  await expect(sheet).toBeVisible();
  await expect(sheet.locator('.prayer-sheet-ornament')).toBeVisible();
  await expect(sheet.locator('blockquote').first()).toBeVisible();

  const metrics = await sheet.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return { width: bounds.width, x: bounds.left, viewport: document.documentElement.clientWidth };
  });
  expect(metrics.x).toBeGreaterThanOrEqual(-1);
  expect(metrics.x + metrics.width).toBeLessThanOrEqual(metrics.viewport + 1);
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: testInfo.outputPath('manuscript-reader.png'), fullPage: true });
});

test('archive headings align to the content edge and active navigation is visible', async ({ page }) => {
  await page.goto('/paath/');
  const title = page.locator('#deity-heading');
  const row = title.locator('xpath=..');
  const positions = await Promise.all([
    title.boundingBox(),
    row.boundingBox(),
  ]);
  expect(positions[0]).not.toBeNull();
  expect(positions[1]).not.toBeNull();
  expect(positions[0].x - positions[1].x, 'Section title drifted away from its left edge').toBeLessThan(55);

  const nav = page.locator('.nav-inner');
  const active = nav.locator('[aria-current="page"]');
  const result = await page.evaluate(() => {
    const container = document.querySelector('.nav-inner');
    const link = container?.querySelector('[aria-current="page"]');
    if (!container || !link) return null;
    return {
      scrollable: container.scrollWidth > container.clientWidth,
      linkLeft: link.getBoundingClientRect().left,
      linkRight: link.getBoundingClientRect().right,
      navLeft: container.getBoundingClientRect().left,
      navRight: container.getBoundingClientRect().right,
    };
  });
  expect(result).not.toBeNull();
  if (result.scrollable) {
    expect(result.linkLeft).toBeGreaterThanOrEqual(result.navLeft - 2);
    expect(result.linkRight).toBeLessThanOrEqual(result.navRight + 2);
  }
  await expect(active).toHaveAttribute('aria-current', 'page');
});
