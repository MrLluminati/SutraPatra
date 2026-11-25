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


test('kundli research lab labels tropical positions and never implies completed D1', async ({page}, testInfo) => {
  await page.goto('/upkaran/janam-kundli/');
  await expect(page.getByRole('heading', {name:'जन्म कुंडली निर्माता'})).toBeVisible();
  await expect(page.getByText('महत्त्वपूर्ण: यह जन्म कुंडली नहीं है।')).toBeVisible();
  await expect(page.locator('#kundli-lab-result')).toBeHidden();
  await page.locator('#kundli-date').fill('2026-06-21');
  await page.locator('#kundli-time').fill('12:00');
  await page.getByRole('button',{name:'ग्रहों की स्थिति देखें'}).click();
  await expect(page.locator('#kundli-lab-result')).toBeVisible();
  await expect(page.locator('#kundli-position-rows tr')).toHaveCount(7);
  await expect(page.locator('#kundli-utc')).toContainText('2026-06-21T06:30:00Z');
  await expect(page.locator('.kundli-result-warning')).toContainText('D1 कुंडली नहीं');
  await withinPage(page);
  await page.screenshot({path:testInfo.outputPath('kundli-research-lab.png'),fullPage:true});
});

test('astronomy lab updates with new date and has no local birth-data storage', async ({page}) => {
  await page.goto('/upkaran/janam-kundli/');
  await page.locator('#kundli-date').fill('2000-01-01');
  await page.locator('#kundli-time').fill('00:00');
  await page.getByRole('button',{name:'ग्रहों की स्थिति देखें'}).click();
  await expect(page.locator('#kundli-utc')).toContainText('1999-12-31T18:30:00Z');
  const first = await page.locator('#kundli-position-rows tr').first().textContent();
  await page.locator('#kundli-date').fill('2026-06-21');
  await page.getByRole('button',{name:'ग्रहों की स्थिति देखें'}).click();
  await expect(page.locator('#kundli-position-rows tr')).toHaveCount(7);
  const second = await page.locator('#kundli-position-rows tr').first().textContent();
  expect(second).not.toBe(first);
  const saved = await page.evaluate(() => Object.keys(localStorage).filter(key => /kundli|birth|janam/i.test(key)));
  expect(saved).toHaveLength(0);
});


test('tropical Sun near June solstice is near 90 degrees — astronomical sanity check', async ({page}) => {
  await page.goto('/upkaran/janam-kundli/');
  await page.locator('#kundli-date').fill('2026-06-21');
  await page.locator('#kundli-time').fill('12:00');
  await page.getByRole('button',{name:'ग्रहों की स्थिति देखें'}).click();
  await expect(page.locator('#kundli-position-rows tr')).toHaveCount(7);
  const sun = await page.locator('#kundli-position-rows tr').first().locator('td').first().textContent();
  const digits = '०१२३४५६७८९';
  const asAscii = (sun ?? '').replace(/[०-९]/g, char => String(digits.indexOf(char)));
  const longitude = parseFloat(asAscii);
  expect(longitude,'June solstice solar tropical longitude').toBeGreaterThan(88);
  expect(longitude,'June solstice solar tropical longitude').toBeLessThan(92);
});
