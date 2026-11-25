import type { CollectionEntry } from 'astro:content';

export const deityGroups = [
  { slug: 'ganesh', name: 'श्री गणेश', description: 'गणेश जी की आरतियाँ और पारंपरिक संस्कृत स्तोत्र', symbol: 'ग' },
  { slug: 'hanuman', name: 'श्री हनुमान', description: 'हनुमान जी की चालीसा और अन्य पारंपरिक पाठ', symbol: 'ह' },
  { slug: 'shiv', name: 'भगवान शिव', description: 'शिवजी के पंचाक्षर एवं अन्य स्तोत्रों का पाठ', symbol: 'शि' },
  { slug: 'vishnu', name: 'भगवान विष्णु', description: 'विष्णु एवं जगदीश की पारंपरिक आरतियाँ और स्तुतियाँ', symbol: 'वि' },
] as const;

export type DevotionalKind = 'aarti' | 'chalisa' | 'stotra';
export type DeitySlug = (typeof deityGroups)[number]['slug'];
export const kindLabels: Record<DevotionalKind, string> = {
  aarti: 'आरती',
  chalisa: 'चालीसा',
  stotra: 'स्तोत्र',
};

export function getDeity(slug: string) {
  return deityGroups.find((deity) => deity.slug === slug);
}

export function publishedPrayers(items: CollectionEntry<'prayers'>[]) {
  return items.filter(({ data }) => !data.draft);
}
