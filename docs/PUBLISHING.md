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
