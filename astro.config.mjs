import { defineConfig } from 'astro/config';

const site = process.env.PUBLIC_SITE_URL?.trim();

export default defineConfig({
  output: 'static',
  ...(site ? { site } : {}),
  trailingSlash: 'always',
});
