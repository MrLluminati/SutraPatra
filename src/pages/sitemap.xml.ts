import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { categories } from '../lib/site';

const publicPages = [
  '/',
  '/hamare-bare-mein/',
  '/sampadakiya-neeti/',
  '/gopniyata/',
  '/sampark/',
];

const escapeXml = (value: string): string =>
  value.replace(/[<>&"']/g, (character) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
  }[character] ?? character));

export const GET: APIRoute = async ({ site }) => {
  const origin = site ?? new URL('https://sutrapatra.pages.dev');
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  const entries = [
    ...publicPages.map((pathname) => ({ pathname })),
    ...categories.map(({ slug }) => ({ pathname: '/vishay/' + slug + '/' })),
    ...articles.map(({ id, data }) => ({
      pathname: '/lekh/' + id + '/',
      modified: (data.updated ?? data.date).toISOString().slice(0, 10),
    })),
  ];
  const locations = entries.map(({ pathname, modified }) => {
    const location = escapeXml(new URL(pathname, origin).toString());
    const date = modified ? '<lastmod>' + modified + '</lastmod>' : '';
    return '<url><loc>' + location + '</loc>' + date + '</url>';
  }).join('');

  const xml = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    locations + '</urlset>';

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
