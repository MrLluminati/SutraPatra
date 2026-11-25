import * as Astronomy from 'astronomy-engine';

/** Research-stage astronomy, NOT a validated Vedic Kundli engine.
 * Geocentric apparent tropical ecliptic-of-date angles only.
 * No ayanamsa, lagna, houses, nodes, navamsa or dashas.
 */
export const bodies = [
  {key:'Sun',name:'सूर्य',body:Astronomy.Body.Sun},
  {key:'Moon',name:'चंद्रमा',body:Astronomy.Body.Moon},
  {key:'Mercury',name:'बुध',body:Astronomy.Body.Mercury},
  {key:'Venus',name:'शुक्र',body:Astronomy.Body.Venus},
  {key:'Mars',name:'मंगल',body:Astronomy.Body.Mars},
  {key:'Jupiter',name:'गुरु',body:Astronomy.Body.Jupiter},
  {key:'Saturn',name:'शनि',body:Astronomy.Body.Saturn},
] as const;

export function normalizeDegrees(angle: number): number {
  if (!Number.isFinite(angle)) throw new Error('Invalid longitude');
  return (angle % 360 + 360) % 360;
}

/** Supports 2000–2099 local IST; explicit offset never depends on device timezone. */
export function parseModernIstInstant(date: string, time: string): Date {
  const d = /^(20\d\d)-(\d\d)-(\d\d)$/.exec(date);
  const t = /^(\d\d):(\d\d)$/.exec(time);
  if (!d || !t) throw new Error('तारीख और समय का प्रारूप सही नहीं है।');
  const [y,m,day,hh,mm] = [d[1],d[2],d[3],t[1],t[2]].map(Number);
  if (m < 1 || m > 12 || hh > 23 || mm > 59) throw new Error('तारीख या समय अमान्य है।');
  const check = new Date(Date.UTC(y,m-1,day));
  if (check.getUTCFullYear()!==y || check.getUTCMonth()!==m-1 || check.getUTCDate()!==day)
    throw new Error('यह तारीख कैलेंडर में मान्य नहीं है।');
  const instant = new Date(date+'T'+time+':00+05:30');
  if (Number.isNaN(instant.getTime())) throw new Error('समय रूपांतरण विफल रहा।');
  return instant;
}

export function tropicalPositions(instant: Date) {
  if (Number.isNaN(instant.getTime())) throw new Error('Invalid UTC date');
  return bodies.map(({key,name,body}) => {
    const vector = Astronomy.GeoVector(body,instant,true); // J2000 equator
    const ecliptic = Astronomy.Ecliptic(vector); // true ecliptic of date
    const longitude = normalizeDegrees(ecliptic.elon);
    const latitude = ecliptic.elat;
    if (!Number.isFinite(latitude) || Math.abs(latitude)>90) throw new Error('Invalid latitude');
    return {key,name,longitude,latitude};
  });
}
