import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  expect: { timeout: 8000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: 'http://127.0.0.1:4321',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'mobile-320',
      use: { browserName: 'chromium', viewport: { width: 320, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
    },
    {
      name: 'mobile-390',
      use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
    },
    {
      name: 'desktop-1280',
      use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4321',
    url: 'http://127.0.0.1:4321/paath/',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
