import { Band, Reading } from '../../audit.model';

/** Finding kinds (store values); display lives in FINDING_KIND. */
export type FindingKind = 'drift' | 'watch' | 'strength' | 'undertold';

export const FINDING_KIND: Record<FindingKind, {
  label: string; chip: string; border: string; vsColor: string; verdict: string; meter: string;
}> = {
  drift: { label: 'Promise drift', chip: 'red', border: 'var(--red)', vsColor: 'var(--red)', verdict: 'contradicts', meter: 'var(--red)' },
  watch: { label: 'Watch', chip: 'amber', border: 'var(--sand)', vsColor: '#7a5414', verdict: 'partly contradicts', meter: 'var(--amber)' },
  strength: { label: 'Holding', chip: 'teal', border: 'var(--teal)', vsColor: 'var(--teal)', verdict: 'supports', meter: 'var(--teal)' },
  undertold: { label: 'Under-told', chip: 'teal', border: 'var(--teal)', vsColor: 'var(--teal)', verdict: 'exceeds', meter: 'var(--teal)' },
};

export const BAND_LABEL: Record<Band, string> = { 0: 'Critical', 1: 'Weak', 2: 'Stable', 3: 'Strong' };

/** Finding ids are positions in the snapshot's list (store values, used in the address). */
export type FindingId = 'f1' | 'f2' | 'f3';
export const FINDING_IDS: readonly FindingId[] = ['f1', 'f2', 'f3'];

/** One captured item behind a finding. `quote` items are verbatim text from the source. */
export interface EvidenceItem { source: string; when: string; text: string; quote?: boolean; }
export interface Receipts {
  /** Short name of the finding for the panel heading. */
  name: string;
  sections: { heading: string; items: EvidenceItem[]; more?: string }[];
  confidence: number; // 0–1, as the decision model returns it
  pattern: string;
  feeds: string[];
}

export interface Finding {
  id: FindingId;
  kind: FindingKind; kindLabel?: string; signals: string; title: string;
  vs?: { promise: string; sym: string; proof: string };
  /** The story's main finding: pulses to invite the click. */
  featured?: boolean;
  receipts: Receipts;
}

export interface Scenario {
  label: string;
  headline: string; // may contain <em>
  bands: { expectation: Band; experience: Band; reliability: Band; emotional: Band };
  findingsTitle: string;
  shown: string;
  findings: Finding[];
  lockedTeaser: string; // may contain <br>
  lockedPitch: string;
  cta: string;
  note?: string;
}

const HOMEPAGE_30 = { source: 'Website · homepage hero', when: 'captured 21 Nov 2026', text: 'Premium, chef-designed meals. Delivered fresh in 30 minutes.', quote: true };

export const SCENARIOS: Record<Reading, Scenario> = {
  apart: {
    label: 'Pulling apart',
    headline: 'Your promise and experience are <em>pulling apart.</em>',
    bands: { expectation: 1, experience: 2, reliability: 1, emotional: 2 },
    findingsTitle: 'Top drifts we found', shown: '3 of 7 shown',
    findings: [
      { id: 'f1', kind: 'drift', signals: 'Reliability · Expectation', title: '“Delivered in 30 minutes” — customers report about 70', featured: true,
        vs: { promise: '<b>Promise</b> · homepage<br>“Delivered fresh in 30 minutes.”', sym: '≠', proof: '<b>Proof</b> · 38 of 41 delivery reviews<br>Median reported wait ≈ 70 min' },
        receipts: {
          name: 'The 30-minute promise',
          sections: [
            { heading: 'The promise', items: [
              HOMEPAGE_30,
              { source: 'Website history', when: 'first seen Mar 2024', text: 'Claim introduced when the service covered one neighbourhood. Unchanged after city-wide expansion (Jan 2025).' },
            ] },
            { heading: 'The proof', items: [
              { source: 'Customer path · checkout page', when: 'walked 21 Nov 2026', text: 'Estimated delivery: 45–90 minutes.', quote: true },
              { source: 'Review · ★★☆☆☆ · Reviewer A', when: 'Oct 2026', text: 'Ordered at 7:10, arrived 8:20. Great food, but 30 minutes? Never.', quote: true },
              { source: 'Review · ★★★☆☆ · Reviewer B', when: 'Sep 2026', text: 'Tasty and fresh, just plan for an hour.', quote: true },
            ], more: '+ 36 more reviews on delivery time' },
          ],
          confidence: 0.94,
          pattern: 'Pattern rule met: 38 of 41 delivery-time reviews contradict the promise (a repeated pattern, not a single incident).',
          feeds: ['Reliability', 'Expectation'],
        } },
      { id: 'f2', kind: 'drift', kindLabel: 'Message drift', signals: 'Expectation', title: 'Website says “premium”; founder\'s posts say “cheapest”',
        receipts: {
          name: 'Premium or cheapest?',
          sections: [
            { heading: 'The promise', items: [
              HOMEPAGE_30,
              { source: 'Website · pricing page', when: 'captured 21 Nov 2026', text: 'Restaurant-quality ingredients, chef-plated. Worth every rupee.', quote: true },
            ] },
            { heading: 'The echo', items: [
              { source: 'Founder post · LinkedIn', when: 'Oct 2026', text: 'We are the cheapest meal delivery in Bengaluru. Find it lower and we refund the difference.', quote: true },
              { source: 'Company post · LinkedIn', when: 'Sep 2026', text: 'Weeknight meals from ₹149. Budget-friendly, every day.', quote: true },
              { source: 'Search · AI overview', when: 'captured 21 Nov 2026', text: 'FreshBox Kitchens is a budget meal-delivery service in Bengaluru…', quote: true },
            ], more: '+ 12 more posts leading on price' },
          ],
          confidence: 0.88,
          pattern: 'Pattern rule met: 15 of 27 public posts in the last 12 months lead on price, while every website page leads on premium.',
          feeds: ['Expectation'],
        } },
      { id: 'f3', kind: 'watch', kindLabel: 'Experience drift', signals: 'Emotional', title: '“Small portions for the price” — a repeated pattern, 52 reviews',
        receipts: {
          name: 'Portions for the price',
          sections: [
            { heading: 'The promise', items: [
              { source: 'Website · menu page', when: 'captured 21 Nov 2026', text: 'Generous, chef-plated portions.', quote: true },
            ] },
            { heading: 'The proof', items: [
              { source: 'Review · ★★★☆☆ · Reviewer C', when: 'Nov 2026', text: 'Lovely flavours, but the bowl was half full for ₹349.', quote: true },
              { source: 'Review · ★★☆☆☆ · Reviewer D', when: 'Oct 2026', text: 'Portions have shrunk since the summer. Same price though.', quote: true },
              { source: 'Review · ★★★★☆ · Reviewer E', when: 'Sep 2026', text: 'Great taste, small portion. Ordered a second dish.', quote: true },
            ], more: '+ 49 more reviews on portion size' },
          ],
          confidence: 0.81,
          pattern: 'Pattern rule met: 52 of 412 reviews mention portion size, rising each month since July 2026. Not yet the dominant theme, so it is a watch, not a drift.',
          feeds: ['Emotional'],
        } },
    ],
    lockedTeaser: '1. Correct the delivery-time promise …<br>2. Resolve the price position across sales and founder content …<br>3. Portion-to-price perception …',
    lockedPitch: 'The full Triad Audit scores all five signals and tells you what to fix first.',
    cta: 'Unlock the full audit',
  },
  almost: {
    label: 'Almost there',
    headline: 'Mostly aligned — <em>one promise is slipping.</em>',
    bands: { expectation: 2, experience: 3, reliability: 2, emotional: 2 },
    findingsTitle: 'What we found', shown: '3 of 4 shown',
    findings: [
      { id: 'f1', kind: 'watch', kindLabel: 'Slipping', signals: 'Reliability · Expectation', title: '30 minutes holds on weekdays; weekends run about 50', featured: true,
        vs: { promise: '<b>Promise</b> · homepage<br>“Delivered fresh in 30 minutes.”', sym: '≈', proof: '<b>Proof</b> · 112 delivery reviews<br>Weekdays ≈ 32 min · weekends ≈ 50 min' },
        receipts: {
          name: 'The 30-minute promise, by day',
          sections: [
            { heading: 'The promise', items: [HOMEPAGE_30] },
            { heading: 'The proof', items: [
              { source: 'Review · ★★★★★ · Reviewer F · a Tuesday', when: 'Nov 2026', text: 'Here in 28 minutes, exactly as promised.', quote: true },
              { source: 'Review · ★★★☆☆ · Reviewer G · a Saturday', when: 'Nov 2026', text: 'Took nearly an hour on Saturday night. Still good food.', quote: true },
              { source: 'Customer path · checkout page', when: 'walked Sat 22 Nov 2026', text: 'Estimated delivery: 40–55 minutes.', quote: true },
            ], more: '+ 109 more delivery reviews' },
          ],
          confidence: 0.86,
          pattern: 'Weekday reviews: median 32 minutes across 71 reviews. Weekend reviews: median 50 minutes across 41. The promise holds on weekdays only.',
          feeds: ['Reliability', 'Expectation'],
        } },
      { id: 'f2', kind: 'strength', signals: 'Experience', title: 'Checkout is quick and clear — 4 steps, no forced sign-up',
        receipts: {
          name: 'A quick checkout',
          sections: [
            { heading: 'The promise', items: [
              { source: 'Website · homepage', when: 'captured 21 Nov 2026', text: 'Order in under a minute.', quote: true },
            ] },
            { heading: 'The proof', items: [
              { source: 'Customer path · landing to payment', when: 'walked 21 Nov 2026', text: '4 steps · guest checkout · UPI and card · 48 seconds end to end.' },
              { source: 'Review · ★★★★★ · Reviewer H', when: 'Oct 2026', text: 'Ordering is super quick, no account needed.', quote: true },
            ], more: '+ 18 more reviews praise ordering' },
          ],
          confidence: 0.9,
          pattern: 'The scripted walk confirms the claim, and no review in 12 months complains about ordering.',
          feeds: ['Experience'],
        } },
      { id: 'f3', kind: 'strength', signals: 'Emotional', title: '“Fresh” and “tasty” dominate reviews, steady for 12 months',
        receipts: {
          name: 'Fresh and tasty',
          sections: [
            { heading: 'The promise', items: [HOMEPAGE_30] },
            { heading: 'The proof', items: [
              { source: 'Review · ★★★★★ · Reviewer I', when: 'Nov 2026', text: 'Tastes like it was cooked ten minutes ago. Every time.', quote: true },
              { source: 'Review themes · last 12 months', when: '412 reviews', text: '“Fresh” or “tasty” appear in 61% of reviews; the share has not dropped in any quarter.' },
            ], more: '+ 250 more reviews on taste and freshness' },
          ],
          confidence: 0.92,
          pattern: 'The dominant review theme, stable across four quarters.',
          feeds: ['Emotional'],
        } },
    ],
    lockedTeaser: '1. Weekend capacity vs the 30-minute promise …<br>2. Lift Emotional from Stable to Strong …',
    lockedPitch: 'You are close. The full audit finds the one fix that moves you to Strong — and checks Commitment.',
    cta: 'Unlock the full audit',
  },
  aligned: {
    label: 'Perfectly aligned',
    headline: 'Promise, proof and echo <em>say the same thing.</em>',
    bands: { expectation: 3, experience: 3, reliability: 3, emotional: 3 },
    findingsTitle: 'What is holding', shown: '3 of 5 shown',
    findings: [
      { id: 'f1', kind: 'strength', signals: 'Reliability · Expectation', title: '“30 minutes” is what customers report — 94% of delivery reviews', featured: true,
        vs: { promise: '<b>Promise</b> · homepage<br>“Delivered fresh in 30 minutes.”', sym: '=', proof: '<b>Proof</b> · 140 delivery reviews<br>Median reported wait ≈ 28 min' },
        receipts: {
          name: 'The 30-minute promise holds',
          sections: [
            { heading: 'The promise', items: [HOMEPAGE_30] },
            { heading: 'The proof', items: [
              { source: 'Customer path · checkout page', when: 'walked 21 Nov 2026', text: 'Estimated delivery: 25–30 minutes.', quote: true },
              { source: 'Review · ★★★★★ · Reviewer J', when: 'Nov 2026', text: '27 minutes and still piping hot.', quote: true },
              { source: 'Review · ★★★★☆ · Reviewer K', when: 'Oct 2026', text: 'Always on time, even when it rains.', quote: true },
            ], more: '+ 137 more delivery reviews' },
          ],
          confidence: 0.95,
          pattern: '132 of 140 delivery-time reviews (94%) report 30 minutes or less; median 28 minutes.',
          feeds: ['Reliability', 'Expectation'],
        } },
      { id: 'f2', kind: 'strength', signals: 'Expectation', title: 'Website, ads and founder posts all say “premium, chef-designed”',
        receipts: {
          name: 'One premium message',
          sections: [
            { heading: 'The promise', items: [HOMEPAGE_30] },
            { heading: 'The echo', items: [
              { source: 'Founder post · LinkedIn', when: 'Oct 2026', text: 'Every dish on our menu is designed by our head chef, and it shows.', quote: true },
              { source: 'Search ad', when: 'captured 21 Nov 2026', text: 'Premium chef-designed meals, delivered fresh.', quote: true },
              { source: 'Search · AI overview', when: 'captured 21 Nov 2026', text: 'FreshBox Kitchens is a premium, chef-led meal-delivery service…', quote: true },
            ], more: '+ 21 more posts and ads on message' },
          ],
          confidence: 0.89,
          pattern: '24 of 27 public posts and every captured ad lead on premium, matching the website.',
          feeds: ['Expectation'],
        } },
      { id: 'f3', kind: 'strength', signals: 'Emotional', title: 'Tone is warm and stable — no negative shift in 12 months',
        receipts: {
          name: 'A warm, steady tone',
          sections: [
            { heading: 'The proof', items: [
              { source: 'Review · ★★★★★ · Reviewer L', when: 'Nov 2026', text: 'Our Friday treat. Never lets us down.', quote: true },
              { source: 'Review tone · last 12 months', when: '412 reviews', text: 'Warm or positive tone in 83% of reviews, within 3 points every quarter.' },
            ], more: '+ 340 more positive reviews' },
          ],
          confidence: 0.87,
          pattern: 'No quarter shows a negative tone shift beyond normal variation.',
          feeds: ['Emotional'],
        } },
    ],
    lockedTeaser: 'Commitment: repeat orders, referrals …<br>Leadership intent vs evidence …<br>Early-warning thresholds for drift …',
    lockedPitch: 'Public evidence says aligned. The full audit confirms Commitment — and monitoring keeps it that way as you grow.',
    cta: 'Confirm it with the full audit',
    note: 'Strong on every observable signal. Growth is when alignment usually breaks — a new city, a new offer, a new agency.',
  },
  over: {
    label: 'Over-delivering',
    headline: 'Customers get more than you promise — <em>you are under-telling it.</em>',
    bands: { expectation: 2, experience: 3, reliability: 3, emotional: 3 },
    findingsTitle: 'Where proof outruns promise', shown: '3 of 5 shown',
    findings: [
      { id: 'f1', kind: 'undertold', signals: 'Expectation · Reliability', title: 'You promise “within the hour”; customers report about 25 minutes', featured: true,
        vs: { promise: '<b>Promise</b> · homepage<br>“Delivered within the hour.”', sym: '<', proof: '<b>Proof</b> · 140 delivery reviews<br>Median reported wait ≈ 25 min' },
        receipts: {
          name: 'Faster than you say',
          sections: [
            { heading: 'The promise', items: [
              { source: 'Website · homepage hero', when: 'captured 21 Nov 2026', text: 'Home-style meals, delivered within the hour.', quote: true },
            ] },
            { heading: 'The proof', items: [
              { source: 'Customer path · checkout page', when: 'walked 21 Nov 2026', text: 'Estimated delivery: 20–30 minutes.', quote: true },
              { source: 'Review · ★★★★★ · Reviewer M', when: 'Nov 2026', text: 'Arrived in 22 minutes. They said an hour!', quote: true },
            ], more: '+ 138 more delivery reviews' },
          ],
          confidence: 0.93,
          pattern: '129 of 140 delivery-time reviews report under 35 minutes; median 25. The promise undersells the proof by more than half.',
          feeds: ['Expectation', 'Reliability'],
        } },
      { id: 'f2', kind: 'undertold', signals: 'Expectation', title: 'Reviews praise “restaurant quality”; your site says “affordable home meals”',
        receipts: {
          name: 'Restaurant quality, home-meal price',
          sections: [
            { heading: 'The promise', items: [
              { source: 'Website · homepage hero', when: 'captured 21 Nov 2026', text: 'Affordable home meals for busy weeks.', quote: true },
            ] },
            { heading: 'The proof', items: [
              { source: 'Review · ★★★★★ · Reviewer N', when: 'Nov 2026', text: 'Honestly restaurant quality. Can’t believe the price.', quote: true },
              { source: 'Review · ★★★★★ · Reviewer O', when: 'Oct 2026', text: 'Better than most places we eat out.', quote: true },
            ], more: '+ 64 more reviews compare it to restaurants' },
          ],
          confidence: 0.84,
          pattern: '66 of 412 reviews compare the food to restaurants; none call it basic or home-style.',
          feeds: ['Expectation'],
        } },
      { id: 'f3', kind: 'undertold', signals: 'Emotional', title: '“Delighted” and “surprised” top review themes — expectations set too low',
        receipts: {
          name: 'Customers are surprised',
          sections: [
            { heading: 'The proof', items: [
              { source: 'Review · ★★★★★ · Reviewer P', when: 'Nov 2026', text: 'Pleasantly surprised. Expected average, got amazing.', quote: true },
              { source: 'Review themes · last 12 months', when: '412 reviews', text: '“Surprised”, “delighted” or “exceeded” appear in 38% of reviews.' },
            ], more: '+ 155 more reviews on exceeded expectations' },
          ],
          confidence: 0.8,
          pattern: 'Surprise is the top emotional theme: a sign the promise sets expectations below the experience.',
          feeds: ['Emotional'],
        } },
    ],
    lockedTeaser: '1. Raise the promise to what you already deliver …<br>2. Price position vs perceived quality …<br>3. Put review language into the Echo …',
    lockedPitch: 'Over-delivery is drift too: the experience is paying for a promise you are not making. The full audit shows what to claim — and what it is worth.',
    cta: 'Unlock the full audit',
    note: 'A high score with a direction: Proof is ahead of Promise and Echo. Good for loyalty, costly for acquisition and pricing.',
  },
};
