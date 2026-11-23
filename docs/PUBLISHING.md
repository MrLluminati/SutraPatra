# Publishing an article

Each article is a Markdown file in `src/content/articles/`. File names become article URL slugs, for example:

`src/content/articles/example-article.md` → `/lekh/example-article/`

Use the following frontmatter:

```yaml
---
title: "लेख का स्पष्ट हिंदी शीर्षक"
description: "लेख का सारांश, जो पाठक को वास्तविक जानकारी दे और खोज परिणाम में भी दिख सके।"
category: "dharm-sanskriti"
date: 2026-11-23
author: "सूत्रपत्र संपादकीय"
featured: false
draft: true
---
```

Valid category identifiers:

- `dharm-sanskriti`
- `aarti-stotra`
- `vrat-tyohar`

Write the article below the frontmatter using Markdown headings, paragraphs and links. Set `draft: false` **only after human editorial review**. Draft entries will not appear in production routes or article lists.

To correct an existing article, you may add an `updated: YYYY-MM-DD` field. Retain the original `date` when making an ordinary correction.

Please verify factual statements, avoid copying copyrighted materials and disclose sponsored content clearly if introduced in the future.

## Publishing workflow for our solo operation

1. Choose a topic from `docs/EDITORIAL_PLAN.md` (or propose a new one).
2. Create a **draft**, verify names/dates/claims and add sources as appropriate.
3. Check that the heading answers a clear reader question, the body is useful and accurate, and copyrighted material is not copied.
4. Set `draft: false` only after review. GitHub automatically builds the updated site through Cloudflare Pages.
5. Confirm the article URL works and appears in `/sitemap.xml`.

**ChatGPT-assisted path:** Send the proposed topic, notes and/or sources in this conversation. ChatGPT can prepare or update the Markdown file directly in the GitHub repository where connected permissions allow. No Codex, paid editor, or local PowerShell is required.

**Manual GitHub fallback:** Open `src/content/articles/` in GitHub and use **Add file → Create new file**. Choose a descriptive, lowercase hyphen-separated name ending in `.md`. Use the frontmatter from this document, save it with `draft: true`, then request review before changing to `draft: false`.

Never publish articles solely to hit an arbitrary daily quantity. Correct existing content when warranted, and keep the original publication date on ordinary edits.
