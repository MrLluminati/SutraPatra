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
