# Search-readiness checklist

The initial public website includes:
- Distinct static category and article URLs
- Hindi language metadata and article titles/descriptions
- Canonical URLs via `PUBLIC_SITE_URL` or fallback `https://sutrapatra.pages.dev`
- An XML sitemap at `/sitemap.xml` (automatically includes published articles)
- A `robots.txt` sitemap declaration
- An RSS feed at `/rss.xml`
- Article structured data in JSON-LD

**Before submitting the site to Google Search Console:**
1. Review each starter article and verify accuracy and authorship.
2. Add a working editorial contact email on the contact page.
3. Confirm the privacy and editorial pages describe actual practices.
4. Inspect `https://sutrapatra.pages.dev/sitemap.xml` and `/robots.txt`.
5. Verify the site using the Google Search Console domain/URL-prefix property flow.
6. Submit `https://sutrapatra.pages.dev/sitemap.xml` in Search Console.
7. After changing to a custom domain, update `PUBLIC_SITE_URL` and the sitemap declaration in `public/robots.txt` and redeploy.

Search Console submission is not an indexing guarantee. Indexability also depends on content quality, accessibility and search engine decisions.
