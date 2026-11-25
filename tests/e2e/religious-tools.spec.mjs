import { test, expect } from '@playwright/test';

const count = (page) => page.locator('#jaap-total');
const withinPage = async (page) => {
  const v = await page.evaluate(() => ({w:document.documentElement.clientWidth,s:document.documentElement.scrollWidth}));
  expect(v.s, 'Unexpected horizontal overflow').toBeLessThanOrEqual(v.w + 2);
};

test('religious tools directory and homepage navigation render', async ({page}, testInfo) => {
  await page.goto('/upkaran/');
  await expect(page.getByRole('heading', {name:'धार्मिक उपकरण'})).toBeVisible();
  await expect(page.locator('.tool-card')).toHaveCount(4);
  await expect(page.getByRole('link', {name:/डिजिटल जाप माला/})).toBeVisible();
  await expect(page.locator('.nav-inner [aria-current="page"]')).toContainText('धार्मिक उपकरण');
  await withinPage(page);
  await page.screenshot({path:testInfo.outputPath('religious-tools-hub.png'),fullPage:true});
  await page.goto('/');
  await expect(page.locator('.home-tools-grid .home-tool-link')).toHaveCount(3);
  await withinPage(page);
});

test('108 chants complete one mala and undo works', async ({page}, testInfo) => {
  await page.goto('/upkaran/jaap-mala/');
  await expect(count(page)).toHaveText('०');
  const button = page.locator('#jaap-tap');
  await button.click();
  await expect(count(page)).toHaveText('१');
  await button.evaluate(node => { for (let i=1; i<108; i++) node.click(); });
  await expect(count(page)).toHaveText('१०८');
  await expect(page.locator('#jaap-malas')).toHaveText('१');
  await expect(page.locator('#jaap-current')).toHaveText('०');
  await page.locator('#jaap-undo').click();
  await expect(page.locator('#jaap-current')).toHaveText('१०७');
  await expect(page.locator('#jaap-malas')).toHaveText('०');
  await withinPage(page);
  await page.screenshot({path:testInfo.outputPath('jaap-mala.png'),fullPage:true});
});

test('jaap opt-in storage and reset privacy', async ({page}) => {
  await page.goto('/upkaran/jaap-mala/');
  await page.locator('#jaap-save').check();
  await page.locator('#jaap-tap').click();
  await page.reload();
  await expect(count(page)).toHaveText('१');
  await expect(page.locator('#jaap-save')).toBeChecked();
  await page.locator('#jaap-save').uncheck();
  await expect.poll(() => page.evaluate(()=>localStorage.getItem('sutrapatra-jaap-v1'))).toBeNull();
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#jaap-reset').click();
  await expect(count(page)).toHaveText('०');
});

test('puja checklist chooses template and adds safe custom item', async ({page}, testInfo) => {
  await page.goto('/upkaran/puja-samagri/');
  await expect(page.locator('.puja-item')).toHaveCount(12);
  await page.locator('.puja-item input').first().check();
  await expect(page.locator('#puja-progress')).toContainText('१');
  await page.locator('#puja-custom').fill('अपने घर की वस्तु');
  await page.getByRole('button', {name:'सूची में जोड़ें'}).click();
  await expect(page.locator('.puja-item')).toHaveCount(13);
  await expect(page.locator('.puja-item').last()).toContainText('अपने घर की वस्तु');
  await page.locator('#puja-type').selectOption('shiv');
  await expect(page.locator('.puja-item')).toHaveCount(11);
  await expect(page.locator('.puja-item').filter({hasText:'अपने घर की वस्तु'})).toHaveCount(0);
  await withinPage(page);
  await page.screenshot({path:testInfo.outputPath('puja-checklist.png'),fullPage:true});
});

test('sunrise and sunset calculate nonplaceholder values for Patna', async ({page}, testInfo) => {
  await page.goto('/upkaran/suryoday-suryast/');
  await page.locator('#sun-date').fill('2026-11-25');
  await page.locator('#sun-city').selectOption('patna');
  await page.getByRole('button', {name:'सूर्योदय-सूर्यास्त देखें'}).click();
  await expect(page.locator('#sun-results')).toBeVisible();
  const rise = await page.locator('#sunrise-time').textContent();
  const set = await page.locator('#sunset-time').textContent();
  expect(rise).not.toBe('—');
  expect(set).not.toBe('—');
  expect(rise).not.toBe(set);
  await expect(page.locator('#sun-duration')).toContainText('दिन की अनुमानित अवधि');
  await withinPage(page);
  await page.screenshot({path:testInfo.outputPath('sunrise-sunset.png'),fullPage:true});
});

test('kundli page avoids unverified chart output and collection of birth details', async ({page}) => {
  await page.goto('/upkaran/janam-kundli/');
  await expect(page.getByRole('heading', {name:'जन्म कुंडली निर्माता'})).toBeVisible();
  await expect(page.getByText('अभी कुंडली तैयार करने की सुविधा चालू नहीं है।')).toBeVisible();
  await expect(page.locator('input[type="date"], input[type="time"]')).toHaveCount(0);
  await withinPage(page);
});
