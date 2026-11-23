# Deploy SutraPatra to Cloudflare Pages

The project is a **static Astro 6** website. No adapter or serverless runtime is required.

1. Sign in to Cloudflare Dashboard.
2. Go to **Workers & Pages → Create → Pages → Connect to Git** (wording may vary).
3. Connect the GitHub repository `MrLluminati/SutraPatra`, branch `main`.
4. Set the build command to `npm run build` and the output directory to `dist`.
5. Add environment variable `NODE_VERSION` set to `22` (or any supported newer LTS version).
6. Deploy. Cloudflare assigns a `.pages.dev` hostname.
7. Once the real hostname is known, add `PUBLIC_SITE_URL` with the full HTTPS origin (for example `https://actual-name.pages.dev`), then redeploy. The website will then generate absolute canonical and OpenGraph URLs.

Cloudflare Pages and GitHub remain free within their respective plan limits. Domain purchases are optional.

## Before going live

- Review the three starter articles for editorial accuracy.
- Replace the temporary contact-page text with a working editorial email.
- Verify legal/privacy disclosures against the actual services enabled.
- Test mobile navigation, article links, category links, 404 page and favicon.
- Submit the verified live site to Google Search Console once ready.

For local preview, use Node.js 22+, then run:

```bash
npm install
npm run dev
npm run build
```

No analytics, ad scripts, newsletter integration or backend services are enabled in the initial build.
