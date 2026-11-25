# Kundli astronomical foundation: validation and release gate

Status: **Geocentric tropical research demonstration only, NOT a Vedic Kundli**. Updated 25 November 2026.

## Public, working foundation

- `src/lib/kundli-astronomy.ts` computes apparent geocentric positions of Sun, Moon, Mercury, Venus, Mars, Jupiter and Saturn via the MIT-licensed `astronomy-engine` library. `GeoVector(body, date, true)` creates a J2000-equator position; `Ecliptic(vector)` rotates to **true ecliptic of date**, reporting tropical longitude and latitude.
- The form at `/upkaran/janam-kundli/` shows numbers as *research-stage astronomy*, not kundli or horoscope. Date/time supports **2000-01-01–2099-12-31** with an explicit `+05:30` IST offset. 00:00 IST on 2000-01-01 corresponds to 1999-12-31T18:30:00Z; this is browser-timezone-independent.
- This geocentric calculation is independent of observer city. It does not generate a lagna or house system.
- All processing happens in-browser with no request from the form and no persistent storage of selected date/time.

## Reproducible checks (GitHub Browser QA)

1. Converted 2000-01-01 00:00 IST to 1999-12-31T18:30Z (boundary).
2. 2026-06-21 12:00 IST to 2026-06-21T06:30Z.
3. Seven objects returned with numeric longitudes/latitudes, and dates change the results.
4. Near the June solstice, the Sun's **tropical** longitude must lie within 88–92°, an independent high-level calendar sanity check rather than arcsecond-level validation.
5. Browser QA covers 320px, 390px and 1280px screens, with no horizontal overflow.
6. Every result carries an explicit 'not a D1 kundli' warning.

These tests **do not** independently certify arcminute/arcsecond precision or a Vedic birth chart. Numerical ephemeris benchmark fixtures and ascendant tests remain outstanding.

## Lahiri/Chitrapaksha: remaining numerical work

The Indian Calendar Reform Committee defined an ayanamsa reference near **23°15′00.658″ at 1956-03-21 00:00 Ephemeris Time**, documented in Swiss Ephemeris references. Published value for 2000-01-01 00:00 UT in some software is ~23°51′12″, but different conventions (true vs mean equinox, nutation and reference implementations) produce non-identical values.

**Do not** subtract a simplistic fixed 24° or a merely linear approximation while claiming a validated Lahiri chart. Before enabling sidereal signs/nakshatras:
- Choose and document a reproducible Lahiri implementation and precise frame (mean/true equinox, precession, nutation) compatible with the tropical positions being subtracted.
- Compare multiple epoch samples and independent trusted ephemerides, including dates near sign/nakshatra boundaries.
- Recheck changing historical time-zone offsets internationally and exact birthplace coordinates.
- Independently verify rising ecliptic longitude (lagna) at multiple latitudes, both hemispheres and near sunrise/sunset, and chart house layout.
- Choose true vs mean Rahu/Ketu, calculate node positions, and verify D9/dasha only after D1 is accepted.

## License and interpretation

- Astronomy Engine JS documentation: https://github.com/cosinekitty/astronomy/blob/master/source/js/README.md — MIT license.
- Swiss Ephemeris Lahiri definition and licensing: https://www.astro.com/swisseph/swisseph.htm — reference documentation only; **Swiss Ephemeris is not included**.
- IMD Rashtriya Panchang: https://packolkata.imd.gov.in/panchang/en/explanation
- Astronomical coordinates are measurable; astrological life interpretations are traditional, not scientifically verified predictions.

Keep the chart disabled until the remaining release gate passes, particularly for births at sign boundaries.
