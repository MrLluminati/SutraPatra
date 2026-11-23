import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: process.env.PUBLIC_SITE_URL?.trim() || 'https://sutrapatra.pages.dev',
  trailingSlash: 'always',
});
