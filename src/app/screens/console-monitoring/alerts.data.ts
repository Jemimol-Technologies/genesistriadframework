import { Band } from '../../audit.model';
import { MonitorStage } from '../../audit.model';
import { From, Weight } from '../review/review.data';

/** Which way one piece of evidence points about the alert. Store values; labels live in ALERT_LEAN. */
export type AlertLean = 'drift' | 'fine' | 'unsure';

export const ALERT_LEAN: Record<AlertLean, { label: string; short: string; color: string }> = {
  drift: { label: 'Says it is drifting', short: 'Drifting', color: 'var(--red)' },
  fine: { label: 'Says the new claim could hold', short: 'Could hold', color: 'var(--teal)' },
  unsure: { label: 'Can’t conclude', short: 'Can’t conclude', color: 'var(--amber)' },
};

export interface AlertItem { id: string; lean: AlertLean; weight: Weight; from: From; text: string; source: string; why?: string; }

export interface AlertFile {
  id: string;
  /** Which demo date the alert belongs to. */
  stage: MonitorStage;
  client: string;
  claim: string;
  seen: string;
  today: string;
  /** The signed promise from the starting line, and the new wording the re-scan found. */
  before: { text: string; source: string };
  after: { text: string; source: string };
  baseline: string;
  check: string;
  /** The engine's own one-paragraph reading. */
  reading: string;
  items: AlertItem[];
  /** Effect on the score if nothing changes. */
  impact: { check: string; from: Band; to: Band; totalFrom: number; totalTo: number; note: string };
  runs: number;
  confidence: number;
  draft: string;
}

export const ALERT_FILES: AlertFile[] = [
  {
    id: 'kite-pricing', stage: 'start', client: 'Kite Bikes', today: 'Thu 3 Dec 2026',
    claim: 'Pricing page now says “lowest prices in town”', seen: 'Re-scan Tue 1 Dec',
    before: { text: '“Hand-built in Pune. Priced for a lifetime.”', source: 'Pricing page headline · signed starting line, Jun 2026' },
    after: { text: '“The lowest prices in town.”', source: 'Pricing page headline · first seen 27 Nov 2026' },
    baseline: 'Starting line signed 14 Jun 2026: “Premium, hand-built bikes.”', check: 'Expectation',
    reading: 'Kite changed its main pricing line from quality to price. Nothing else about the brand moved with it: prices are still above the city average and customers still praise the build. One new budget range could explain the line, and a Black Friday post could mean it is temporary.',
    items: [
      { id: 'k1', lean: 'drift', weight: 3, from: 'outside', text: 'Kite’s bikes cost 22% more than comparable bikes from 5 local rivals.', source: 'Price scan · 1 Dec' },
      { id: 'k2', lean: 'drift', weight: 3, from: 'outside', text: '64% of reviews praise the build or the frame; 3% mention price.', source: '286 reviews · 2026' },
      { id: 'k3', lean: 'drift', weight: 3, from: 'leaders', text: 'Founder, at the starting line: “We never compete on price.”', source: 'Intent answers · Jun 2026' },
      { id: 'k4', lean: 'drift', weight: 2, from: 'outside', text: 'Search ads and the homepage still say “hand-built”.', source: 'Search ads · homepage · 1 Dec' },
      { id: 'k5', lean: 'fine', weight: 2, from: 'outside', text: 'New “City Commuter” range at ₹18,900 is the cheapest of its class among 5 rivals.', source: 'Product page · launched 20 Nov' },
      { id: 'k6', lean: 'unsure', weight: 2, from: 'outside', text: 'Instagram story: “Black Friday: lowest prices in town”.', source: 'Instagram · 27 Nov', why: 'Could be a one-week sale line copied to the pricing page, or the start of a new position.' },
    ],
    impact: { check: 'Expectation', from: 2, to: 1, totalFrom: 7, totalTo: 6, note: 'Two promises pulling different ways is what cost Kite its first point in June.' },
    runs: 4, confidence: 0.78,
    draft: 'Your pricing page changed on 27 Nov to “lowest prices in town”. Your promise is “premium, hand-built bikes”, and your reviews praise build quality, not price. This pulls your message apart again. We suggest reverting the line, or talking to us before you change your position.',
  },
  {
    id: 'freshbox-20min', stage: 'feb', client: 'FreshBox Kitchens', today: 'Mon 1 Feb 2027',
    claim: 'Campaign now claims “20-minute delivery”', seen: 'Re-scan Mon 1 Feb',
    before: { text: '“Fresh meals at your door in about 45 minutes.”', source: 'Homepage · signed starting line, 3 Dec 2026' },
    after: { text: '“Hungry? 20-minute delivery.”', source: '3 search ads · live since 26 Jan 2027' },
    baseline: 'Starting line signed 3 Dec 2026, after FreshBox corrected “30 minutes” to “about 45”.', check: 'Expectation',
    reading: 'FreshBox closed this exact gap in December: it changed “30 minutes” to “about 45” and now delivers inside that 81% of the time. The new ads go back to a time almost no order meets. A new express kitchen could make it true in one area, but the ads’ targeting is not public.',
    items: [
      { id: 'f1', lean: 'drift', weight: 3, from: 'yours', text: 'Median delivery in January: 41 minutes.', source: 'On-time export · Jan 2027' },
      { id: 'f2', lean: 'drift', weight: 3, from: 'yours', text: 'Only 4% of January orders arrived within 20 minutes.', source: 'On-time export · Jan 2027' },
      { id: 'f3', lean: 'drift', weight: 2, from: 'outside', text: '7 of 9 January reviews that mention time say “about 40 minutes”.', source: 'Reviews · Jan 2027' },
      { id: 'f4', lean: 'drift', weight: 2, from: 'outside', text: 'The homepage and checkout still say “about 45 minutes”.', source: 'Site walk · 1 Feb' },
      { id: 'f5', lean: 'fine', weight: 2, from: 'yours', text: 'New Indiranagar express kitchen: median 19 minutes within 3 km.', source: 'On-time export, by kitchen · since 18 Jan' },
      { id: 'f6', lean: 'unsure', weight: 2, from: 'outside', text: 'Who sees the ads.', source: 'Search ads', why: 'Ad targeting is not public. If the ads run only within 3 km of Indiranagar, the claim may be true there.' },
    ],
    impact: { check: 'Expectation', from: 2, to: 1, totalFrom: 10, totalTo: 9, note: 'In November this same gap took Expectation to 1 and dragged Emotional down with it.' },
    runs: 5, confidence: 0.72,
    draft: 'A new search campaign promises “20-minute delivery”. You corrected your promise to 45 minutes in December, and your on-time rate is now 81% against that. If the ad stays, the gap you closed opens again. Is this a mistake to fix, or a real new promise?',
  },
];

export const alertFile = (id: string | null | undefined) => ALERT_FILES.find(a => a.id === id);
export const alertFor = (stage: MonitorStage) => ALERT_FILES.find(a => a.stage === stage)!;
