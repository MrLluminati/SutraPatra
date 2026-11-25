import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string().min(8),
    description: z.string().min(30),
    category: z.enum(['dharm-sanskriti', 'aarti-stotra', 'vrat-tyohar']),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string().default('सूत्रपत्र संपादकीय'),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const prayers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/prayers' }),
  schema: z.object({
    title: z.string().min(8),
    description: z.string().min(30),
    kind: z.enum(['aarti', 'chalisa', 'stotra']),
    deity: z.string().min(2),
    deitySlug: z.enum(['ganesh', 'hanuman', 'shiv', 'vishnu']),
    language: z.enum(['hi', 'mr', 'sa', 'awa']).default('hi'),
    attribution: z.string().min(4),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(true),
  }),
});

export const collections = { articles, prayers };
