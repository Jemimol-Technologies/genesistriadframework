import { Band, SignalKey } from '../../audit.model';

/** Which way one piece of evidence points. Store values; labels live in LEAN. */
export type Lean = 'pos' | 'neg' | 'unsure';
/** Where a piece of evidence came from. */
export type From = 'outside' | 'yours' | 'leaders';
/** How much one piece counts: 1 light, 2 medium, 3 strong. */
export type Weight = 1 | 2 | 3;

export const LEAN: Record<Lean, { label: string; short: string; color: string; tint: string }> = {
  pos: { label: 'Supports a positive picture', short: 'Positive', color: 'var(--teal)', tint: '#e3efed' },
  neg: { label: 'Points to a problem', short: 'Negative', color: 'var(--red)', tint: '#fdecec' },
  unsure: { label: 'Can’t conclude', short: 'Can’t conclude', color: 'var(--amber)', tint: '#fbf2e0' },
};
export const FROM: Record<From, string> = { outside: 'Public', yours: 'FreshBox data', leaders: 'Leaders' };
export const WEIGHT: Record<Weight, { label: string; why: string }> = {
  1: { label: 'Light', why: 'One post, one page or a short window' },
  2: { label: 'Medium', why: 'Several sources agree, or a small sample' },
  3: { label: 'Strong', why: 'Your own numbers, or a large sample of customers' },
};

export interface EvidenceItem {
  id: string;
  text: string;
  source: string;
  from: From;
  lean: Lean;
  weight: Weight;
  /** For "can't conclude" items: why the engine would not call it. */
  why?: string;
}

export interface CheckFile {
  key: SignalKey;
  name: string;
  question: string;
  /** What each level means for this check. */
  levels: Record<Band, string>;
  /** The engine's own one-paragraph reading. */
  reading: string;
  items: EvidenceItem[];
  /** The level each of the five independent runs reached. */
  runs: Band[];
  /** Engine confidence, stored 0–1 as the decision model returns it. */
  confidence: number;
  /** Which report pillars this check feeds. */
  feeds: string;
}

/** Share of counted weight that is positive → level. Same lines for every check. */
export const LEVEL_LINES = [0.25, 0.5, 0.75] as const;
export function levelOf(share: number): Band {
  return (share < LEVEL_LINES[0] ? 0 : share < LEVEL_LINES[1] ? 1 : share < LEVEL_LINES[2] ? 2 : 3) as Band;
}

/** FreshBox Kitchens' diagnostic, check by check. Illustrative. */
export const CHECK_FILES: CheckFile[] = [
  {
    key: 'expectation', name: 'Expectation', question: 'Is the promise clear, and is it true?', feeds: 'Promise and Echo',
    levels: { 0: 'The promise is mostly untrue', 1: 'A key promise is often broken', 2: 'Mostly true, with gaps', 3: 'Clear, and true' },
    reading: 'The food promise holds, but the headline promise does not: “30 minutes” meets a 70-minute median, and the brand cannot agree whether it is premium or cheap. That is well inside “often broken”.',
    runs: [1, 1, 1, 1, 1], confidence: 0.91,
    items: [
      { id: 'x1', lean: 'pos', weight: 2, from: 'outside', text: 'Checkout states delivery honestly: “45–90 min”.', source: 'Checkout walk · 19 Nov' },
      { id: 'x2', lean: 'pos', weight: 1, from: 'outside', text: 'Search summary repeats “fresh, restaurant-quality food”, matching the homepage.', source: 'AI search overview · 19 Nov' },
      { id: 'x3', lean: 'pos', weight: 3, from: 'outside', text: '“Fresh” or “tasty” in 61% of reviews, steady for 12 months.', source: '412 reviews · Dec 2025 – Nov 2026' },
      { id: 'x4', lean: 'neg', weight: 3, from: 'yours', text: 'Homepage promises 30 minutes; median delivery is 70.', source: '38 of 41 delivery reviews · on-time export' },
      { id: 'x5', lean: 'neg', weight: 3, from: 'outside', text: 'Founder posts “the cheapest in Bengaluru”; the site says “premium”.', source: '15 of 27 posts · pricing page' },
      { id: 'x6', lean: 'neg', weight: 3, from: 'leaders', text: 'Leaders describe the promise differently: founder “premium”, sales lead “cheapest”.', source: 'Intent answers · 2 of 3 leaders' },
      { id: 'x7', lean: 'neg', weight: 2, from: 'outside', text: '“Chef-designed”, but no chef is named or shown anywhere.', source: 'Site walk · website history' },
      { id: 'x8', lean: 'neg', weight: 1, from: 'outside', text: 'Six search ads still say “30-minute delivery”.', source: 'Search ads · 18 Nov' },
      { id: 'x9', lean: 'unsure', weight: 2, from: 'outside', text: '“Generous portions”: customer photos vary widely.', source: '9 customer photos · Oct–Nov', why: 'Photos are not taken at a fixed angle or size, so portions cannot be measured from them.' },
    ],
  },
  {
    key: 'experience', name: 'Experience', question: 'Is it easy to buy and use?', feeds: 'Proof',
    levels: { 0: 'Buying is a struggle for most', 1: 'Many customers get stuck', 2: 'Mostly smooth, some friction', 3: 'Easy all the way through' },
    reading: 'Once signed up, ordering is smooth and reordering is easy. The long sign-up is the one real wall, and it costs carts. Mostly smooth, with one clear point of friction.',
    runs: [2, 2, 2, 2, 2], confidence: 0.84,
    items: [
      { id: 'p1', lean: 'pos', weight: 3, from: 'yours', text: '71% of signed-up customers who start checkout finish it.', source: 'Analytics funnel · Sep–Nov' },
      { id: 'p2', lean: 'pos', weight: 2, from: 'outside', text: '46 app reviews call reordering “easy” or “quick”.', source: 'App store reviews · 2026' },
      { id: 'p3', lean: 'pos', weight: 2, from: 'outside', text: 'Menu loads in under 2 seconds on a mid-range phone.', source: 'Site walk · 19 Nov' },
      { id: 'p4', lean: 'pos', weight: 2, from: 'outside', text: 'Saved addresses and one-tap reorder.', source: 'Site walk · 19 Nov' },
      { id: 'n1', lean: 'neg', weight: 3, from: 'yours', text: '11-field sign-up before checkout; 29% of carts are abandoned there.', source: 'Analytics funnel · checkout walk' },
      { id: 'n2', lean: 'neg', weight: 2, from: 'yours', text: '9% of support chats are login help.', source: 'Support export · Sep–Nov' },
      { id: 'n3', lean: 'neg', weight: 1, from: 'outside', text: 'Ads say “order in seconds”; first order takes about 4 minutes.', source: 'Search ads · checkout walk' },
      { id: 'u1', lean: 'unsure', weight: 2, from: 'outside', text: 'Delivery-partner app rated 4.2★.', source: 'Partner app listing', why: 'This rates the delivery partner’s app, not FreshBox’s own ordering.' },
      { id: 'u2', lean: 'unsure', weight: 1, from: 'yours', text: 'Abandoned carts spike on Sunday evenings.', source: 'Analytics funnel', why: 'Could be friction, or people browsing to plan the week. The data does not say why.' },
    ],
  },
  {
    key: 'reliability', name: 'Reliability', question: 'Is it delivered the same way every time?', feeds: 'Proof',
    levels: { 0: 'Rarely as promised', 1: 'Often misses', 2: 'Usually delivers', 3: 'The same every time' },
    reading: 'The food itself is consistent, but delivery misses its own window four times in ten, worst on Friday and Saturday nights. The team already knows. Clearly “often misses”.',
    runs: [1, 1, 1, 1, 1], confidence: 0.93,
    items: [
      { id: 'r1', lean: 'pos', weight: 2, from: 'yours', text: 'Refunds and remakes at 6% of orders.', source: 'Order export · Sep–Nov' },
      { id: 'r2', lean: 'pos', weight: 3, from: 'outside', text: 'Reviews describe the same food quality across all 4 kitchens.', source: '412 reviews, by kitchen' },
      { id: 'r3', lean: 'neg', weight: 3, from: 'yours', text: 'Only 58% arrive inside FreshBox’s own 45–90 minute window.', source: 'On-time export · Sep–Nov' },
      { id: 'r4', lean: 'neg', weight: 3, from: 'outside', text: '38 of 41 reviews that mention delivery say it was late.', source: 'Reviews · 2026' },
      { id: 'r5', lean: 'neg', weight: 2, from: 'yours', text: 'Late orders cluster on Friday and Saturday dinners, at 2 of 4 kitchens.', source: 'On-time export, by kitchen' },
      { id: 'r6', lean: 'neg', weight: 3, from: 'leaders', text: 'Operations lead: “We know Friday and Saturday are broken.”', source: 'Intent answers · Meera S.' },
      { id: 'r7', lean: 'unsure', weight: 1, from: 'yours', text: 'Rain-day delays in July.', source: 'On-time export · Jul', why: 'Weather delays hit every service in the city; FreshBox’s own share cannot be separated out.' },
    ],
  },
  {
    key: 'emotional', name: 'Emotional', question: 'How do customers feel about the brand?', feeds: 'Promise',
    levels: { 0: 'Customers feel misled or angry', 1: 'Warmth fading, frustration growing', 2: 'Mostly warm, some strain', 3: 'Customers love it and defend it' },
    reading: 'Customers still like the food and say so. But the newest reviews are angrier, mostly about lateness. On balance this sits just above the line for “Mostly holds”, and four items could not be read either way.',
    runs: [2, 1, 2, 2, 1], confidence: 0.62,
    items: [
      { id: 'e1', lean: 'pos', weight: 3, from: 'outside', text: '“Fresh” or “tasty” in 61% of reviews, steady for 12 months.', source: '412 reviews · Dec 2025 – Nov 2026' },
      { id: 'e2', lean: 'pos', weight: 3, from: 'outside', text: 'Average 3.9★, above the city’s meal-kit average of 3.6★.', source: 'Google and app store · 412 reviews' },
      { id: 'e3', lean: 'pos', weight: 2, from: 'outside', text: '31 customers posted their meals unprompted, mostly happy.', source: 'Instagram · last 90 days' },
      { id: 'e4', lean: 'pos', weight: 3, from: 'yours', text: 'Customers with 3 or more orders: NPS +18.', source: 'October customer survey' },
      { id: 'e5', lean: 'neg', weight: 3, from: 'outside', text: 'Review tone moved from “confused” to “annoyed” in the last 60 days.', source: '118 reviews · Sep–Nov' },
      { id: 'e6', lean: 'neg', weight: 3, from: 'outside', text: 'Late-delivery reviews now say they feel “lied to” about 30 minutes.', source: '14 reviews quoting the promise' },
      { id: 'e7', lean: 'neg', weight: 2, from: 'yours', text: 'First-time customers: NPS −22.', source: 'October customer survey' },
      { id: 'e8', lean: 'neg', weight: 2, from: 'yours', text: 'Support chats tagged “angry” doubled since August, 4% → 8%.', source: 'Support export · Aug–Nov' },
      { id: 'e9', lean: 'unsure', weight: 2, from: 'outside', text: '“Used to love it.”', source: '9 reviews · November', why: 'Could be a loyal customer who is disappointed, or one who has already left. The words alone do not say which.' },
      { id: 'e10', lean: 'unsure', weight: 1, from: 'outside', text: 'Founder’s post about the kitchen team: 1,200 likes.', source: 'LinkedIn · October', why: 'Likes come from peers and staff as much as customers.' },
      { id: 'e11', lean: 'unsure', weight: 2, from: 'outside', text: '“30 minutes lol” comments under brand posts.', source: '6 comments · Oct–Nov', why: 'Sarcasm reads as positive word by word. The engine marks it unclear rather than guess.' },
      { id: 'e12', lean: 'unsure', weight: 1, from: 'outside', text: 'Rating dipped 4.1★ → 3.9★ in October, then edged up in November.', source: 'Google · monthly average', why: 'Too short a window to call a trend.' },
    ],
  },
  {
    key: 'commitment', name: 'Commitment', question: 'Do customers come back and recommend it?', feeds: 'Echo',
    levels: { 0: 'Few come back', 1: 'Some return, few recommend', 2: 'Many return, some recommend', 3: 'They return and recommend' },
    reading: 'Regulars stay, but too few customers become regulars and almost nobody refers a friend. The new subscription push could change this, but it is too early to count.',
    runs: [1, 1, 2, 1, 1], confidence: 0.66,
    items: [
      { id: 'c1', lean: 'pos', weight: 3, from: 'yours', text: '71% of customers with 3+ orders are still ordering 6 months later.', source: 'Order export · cohorts' },
      { id: 'c2', lean: 'pos', weight: 1, from: 'outside', text: '12 reviews say “we order every week”.', source: 'Reviews · 2026' },
      { id: 'c3', lean: 'neg', weight: 3, from: 'yours', text: 'Only 24% order again within 90 days.', source: 'Business metrics' },
      { id: 'c4', lean: 'neg', weight: 2, from: 'yours', text: 'Referrals bring 3% of new customers.', source: 'Business metrics' },
      { id: 'c5', lean: 'neg', weight: 1, from: 'outside', text: 'No loyalty or referral offer anywhere customers look.', source: 'Site walk · emails' },
      { id: 'c6', lean: 'unsure', weight: 3, from: 'yours', text: 'Subscription sign-ups up 18% since September.', source: 'Business metrics', why: 'They came in on a 40% first-month discount. Too early to tell whether they stay.' },
      { id: 'c7', lean: 'unsure', weight: 2, from: 'leaders', text: 'Leaders disagree on retention: founder “strong”, operations “weak”.', source: 'Intent answers', why: 'Opinions, not data. Noted, but not counted until the numbers agree with one of them.' },
    ],
  },
];

export const checkFile = (k: string | null | undefined) => CHECK_FILES.find(c => c.key === k);

/** The engine's arithmetic for one check, with any of Felix's calls on "can't conclude" items applied. */
export function weigh(c: CheckFile, calls: Record<string, 'pos' | 'neg'> = {}) {
  const lean = (i: EvidenceItem): Lean => (i.lean === 'unsure' ? calls[i.id] ?? 'unsure' : i.lean);
  const sum = (l: Lean) => c.items.filter(i => lean(i) === l).reduce((a, i) => a + i.weight, 0);
  const pos = sum('pos'), neg = sum('neg'), unsure = sum('unsure');
  const share = pos + neg > 0 ? pos / (pos + neg) : 0;
  const level = levelOf(share);
  const margin = Math.min(...LEVEL_LINES.map(l => Math.abs(share - l)));
  return { pos, neg, unsure, share, level, margin, unsureShare: unsure / (pos + neg + unsure), lean };
}
