export const siteName = 'सूत्रपत्र';
export const siteNameEnglish = 'SutraPatra';
export const tagline = 'जानकारी से समझ तक';

export const categories = [
  {
    slug: 'dharm-sanskriti',
    label: 'धर्म और संस्कृति',
    shortLabel: 'धर्म-संस्कृति',
    description: 'परंपराओं, विचारों और सांस्कृतिक संदर्भों की सरल व्याख्या।',
    letter: 'सं',
  },
  {
    slug: 'aarti-stotra',
    label: 'आरती और स्तोत्र',
    shortLabel: 'आरती-स्तोत्र',
    description: 'प्रार्थना, आरती, स्तोत्र और उनके अर्थ को समझने की जगह।',
    letter: 'ॐ',
  },
  {
    slug: 'vrat-tyohar',
    label: 'व्रत और त्योहार',
    shortLabel: 'व्रत-त्योहार',
    description: 'भारतीय पर्वों, पंचांग और लोकपरंपराओं की जानकारी।',
    letter: 'ति',
  },
] as const;

export type Category = (typeof categories)[number];
export type CategorySlug = Category['slug'];

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function formatHindiDate(date: Date): string {
  return new Intl.DateTimeFormat('hi-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(date);
}
