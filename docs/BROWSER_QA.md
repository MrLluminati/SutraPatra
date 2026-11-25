# SutraPatra · Browser QA

The public site has a static Astro build and no paid search service. Browser QA tests use Chromium mobile emulation to test the devotional archive and reader at:

- 320 × 740 (small phone)
- 390 × 844 (modern phone)
- 1280 × 800 (desktop)

Test coverage:
- Archive loads published prayer cards and deity browse links
- Title search and **full prayer-text** search
- Type/deity filter intersections, no-results state, and reset
- Deity archive navigation
- Hanuman Chalisa reading view, font-size controls, print handler
- Original-language metadata and verse language semantics
- Horizontal document overflow at phone widths

Runs in GitHub Actions automatically when devotional pages/styles/content/tests change; the workflow can also run manually. Each run uploads an HTML report and per-viewport screenshots (7-day retention). The test suite runs against an Astro preview of the production build, **not directly against Cloudflare**.

Successful browser emulation is not a substitute for an occasional manual check on a real Android/iOS browser or for review of the poetic text itself.

To run locally: `npm install`, `npx playwright install chromium`, `npm run build`, `npm run test:e2e`.
