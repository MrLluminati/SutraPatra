import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

const escapeXml = (value: string): string =>
  value.replace(/[<>&"']/g, (character) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
  }[character] ?? character));

export const GET: APIRoute = async ({ site }) => {
  const origin = site ?? new URL('https://sutrapatra.pages.dev');
  const articles = (await getCollection('articles', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, 30);

  const items = articles.map(({ id, data }) => {
    const location = new URL('/lekh/' + id + '/', origin).toString();
    return '<item>' +
      '<title>' + escapeXml(data.title) + '</title>' +
      '<link>' + escapeXml(location) + '</link>' +
      '<guid isPermaLink="true">' + escapeXml(location) + '</guid>' +
      '<description>' + escapeXml(data.description) + '</description>' +
      '<pubDate>' + data.date.toUTCString() + '</pubDate>' +
      '</item>';
  }).join('');

  const xml = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<rss version="2.0"><channel>' +
    '<title>सूत्रपत्र — नवीन लेख</title>' +
    '<link>' + escapeXml(origin.toString()) + '</link>' +
    '<description>सूत्रपत्र की नवीनतम हिंदी सामग्री</description>' +
    '<language>hi-IN</language>' +
    items + '</channel></rss>';

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
