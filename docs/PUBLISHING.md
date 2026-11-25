# Publishing an article

SutraPatra articles are Markdown files in `src/content/articles/`. File names become article URL slugs:

`src/content/articles/example-article.md` → `/lekh/example-article/`

Use the following frontmatter:

```yaml
---
title: "लेख का स्पष्ट हिंदी शीर्षक"
description: "लेख का सारांश, जो पाठक को वास्तविक जानकारी दे और खोज परिणाम में भी दिख सके।"
category: "dharm-sanskriti"
date: 2026-11-25
author: "सूत्रपत्र संपादकीय"
featured: false
draft: true
---
```

Valid categories: `dharm-sanskriti`, `aarti-stotra`, and `vrat-tyohar`.

## Solo editorial workflow

1. Choose a topic from `docs/EDITORIAL_PLAN.md` (or propose another topic).
2. Draft an original Hindi explainer, recording the specific source links used.
3. Verify all key facts, wording, citations, regional differences, and copyright boundaries.
4. Run `npm run check:content` (automatically run by GitHub Actions) to catch missing metadata and broken internal article links.
5. **Have the owner review the text before marking `draft: false` in routine publication workflows.** A draft is excluded from the website and sitemap.
6. Commit to `main`. Cloudflare Pages automatically deploys updates.
7. Check the published page and the `/sitemap.xml` entry.

**ChatGPT-assisted path:** Give the topic, notes or reference material in this conversation. ChatGPT can make direct GitHub repository changes when authorized and available. No Codex, local PowerShell, or paid editor is needed.

**GitHub web fallback:** Open `src/content/articles/`, choose **Add file → Create new file**, enter the slug and `.md` extension, and add content with `draft: true`. Request a review before publishing.

Use `updated: YYYY-MM-DD` for substantive corrections while retaining the original publication date in `date`. Avoid year-specific claims without year/location verification.

The first source-linked batch is recorded in `docs/ARTICLE_REVIEW.md`. The six articles from that batch need a final site-owner copyedit even though they were prepared and source-compared before publication. The original three articles should also be reviewed for citations.

## Complete aarti, chalisa and stotra text pages

Full texts are **not** stored as regular articles. Their Markdown files are in `src/content/prayers/`, served at `/paath/{slug}/`, and listed at `/paath/`.

Frontmatter:

```yaml
---
title: "पाठ का नाम"
description: "मूल पाठ के बारे में पर्याप्त विवरण..."
kind: "stotra" # or "aarti", "chalisa"
deity: "श्री गणेश"
language: "sa" # Sanskrit (sa), Marathi (mr), Hindi (hi), Awadhi (awa)
attribution: "रचयिता या पारंपरिक श्रेय"
date: 2026-11-25
draft: true
---
```

Use blockquoted stanzas with two spaces before each line break to retain the two-line verse format. Include historical source/edition notes and clear treatment of text variants. Only public-domain source compositions or material with adequate republication rights may be added; do not copy modern translations or web-specific annotations without permission.

The `/paath/` archive and site sitemap automatically include approved (non-draft) texts. Use the original language in metadata, including Marathi and Sanskrit rather than assuming all Devanagari is Hindi. Reading mode includes size adjustment, copy-text, and print controls. Refer to `docs/TEXT_SOURCES.md` before extending the library.
