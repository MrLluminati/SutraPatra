# SutraPatra · सूत्रपत्र

A fast, independent Hindi digital publication built with Astro and deployed as static files to Cloudflare Pages.

## Local development

```bash
npm install
npm run dev
npm run build
```

## Deployment

Connect this GitHub repository to **Cloudflare Pages**. Use build command `npm run build`, output directory `dist`, and Node.js 22 or newer. Static pages do not require a Cloudflare adapter.

## Editorial principle

Only publish reviewed, sourced, original material. Articles live in `src/content/articles/`; drafts require `draft: true` and are excluded from public pages.

## Status

Initial website in development. No ads, analytics scripts or trackers are included by default.
