# SutraPatra · Visual language

Established: 25 November 2026. This refresh improves presentation **without changing the site name, URL paths or content publishing model**.

## Art direction

- **Editorial Hindi magazine**, rather than a generic app dashboard or an advertisement-heavy news feed.
- Warm paper/ivory, deep oxblood red, antique brass-gold details and restrained forest/teal category accents.
- Large Devanagari headlines with comfortable line lengths, clear hierarchy, subtle line rules and visible dates.
- Original SVG motifs based on article topics: sun, moon, traditional calendar, open book and lotus. These are **illustrations**, not depictions or claims of historical primary-source images.
- Devotional manuscripts receive a calm ivory reading surface with faint borders and generous text spacing; typography remains resizable.

## Technical design choices

- `src/styles/global.css` remains the original foundation.
- `src/styles/visual-refresh.css` is the overriding design layer for the new system.
- `src/components/EditorialArtwork.astro` creates original, category-colored SVG covers without downloaded or hotlinked assets. The central motif depends on the article's slug.
- Article cards and story pages reuse this component. No new image rights, CDN account or API are needed.
- The devotional archive and reader keep existing search, filters, text-size, copy, print and accessibility controls.
- No web-font requests, remote stock imagery, analytics tracking or paid services are introduced.

## QA and acceptance

The GitHub browser QA workflow tests 320px mobile, 390px mobile and 1280px desktop widths. Screenshots of the homepage, reading page and devotional library are attached to each run. Tests also assert no horizontal page overflow.

**Review is still needed on a physical phone and on a desktop monitor**; browser emulation and automated tests do not conclusively assess subjective visual polish. Source manuscripts must also receive text proofreading independently of their layout.
