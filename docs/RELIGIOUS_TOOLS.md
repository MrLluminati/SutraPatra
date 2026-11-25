# SutraPatra · Religious Tools Roadmap

**Release 1 — implemented 25 November 2026**

- `/upkaran/`: editorial directory of religious tools.
- `/upkaran/jaap-mala/`: a working, 108-count digital jaap counter; total, completed malas, undo, reset and optional browser-only saved count (localStorage with user opt-in). No data is transmitted from the counter.
- `/upkaran/puja-samagri/`: initial item checklists for Ganesh, Shiv, Lakshmi and Satyanarayan Puja; supports check/uncheck, personal items, copying, clearing and printing. State stays in memory only; a page refresh resets it.
- `/upkaran/suryoday-suryast/`: astronomy-based sunrise/sunset for ten Indian cities with city-center coordinates. Uses `astronomy-engine` v2.1.x (MIT license) in the user's browser. Dates 2000–2099; results formatted Asia/Kolkata. Definitions use top edge of the Sun with usual atmospheric refraction over a modeled horizon; do not advertise these as religious muhurat, local temple schedules, or exact visible time in obstructed terrain.
- `/upkaran/janam-kundli/`: explanatory **development-status page, not a generator**. It contains no birth-date/time input and no fictitious planetary chart. This is intentional.

## Kundli engine — prerequisites before release

1. Pick and record astronomical position conventions (geocentric vs topocentric, apparent vs mean, epoch); validate against known published positions.
2. Convert birthplace plus historical local time into an exact UTC instant, including historical daylight-saving changes; don't presume modern IST applies internationally.
3. Select and document a sidereal ayanamsa (e.g., Lahiri/Chitrapaksha) with reproducible values across dates. A general astronomical library **does not automatically provide a verified Vedic Kundli**.
4. Independently test lagna calculations at multiple latitudes and birth times, compare D1 chart positions with trusted reference sources, then add D9 and dashas only after D1 passes.
5. Use no cloud storage or transfer of visitor birth details without a clearly disclosed need and consent. Prefer full client-side calculations.
6. Distinguish traditionally interpreted astrological predictions from empirically established science. Do not give deterministic medical, legal, or financial forecasts.

## Source and licensing notes

- Astronomy Engine documentation: https://github.com/cosinekitty/astronomy ; https://www.npmjs.com/package/astronomy-engine — MIT.
- NOAA calculator for sanity-checking representative sunrise/sunset dates: https://gml.noaa.gov/grad/solcalc/
- IMD Rashtriya Panchang: https://packolkata.imd.gov.in/panchang/en/explanation — religious calendar rules and tithi differ from simple Sun rise/set.
- Swiss Ephemeris: https://www.astro.com/swisseph/swephinfo_e.htm — AGPL or professional license; **not incorporated** into this release.

## Quality assurance

GitHub Actions runs Astro build, content checks and Playwright browser tests at 320px, 390px and 1280px widths. The tool tests cover counter progression/opt-in persistence, puja custom items and template changes, local solar calculation output, and explicit Kundli under-development labelling.

No paid API key, account system, location permission or user-uploaded personal data is required for Release 1.
