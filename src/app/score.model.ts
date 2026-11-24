import { Band } from './audit.model';

/** Where a score sits, in plain words. Store values; labels and meanings below. */
export type Bucket = 'broken' | 'apart' | 'almost' | 'aligned';

/**
 * The four buckets, worked out as a share of the points that could be checked, so the free
 * snapshot (out of 12) and the full audit (out of 15) read the same way.
 * Proposed cut-offs; Genesis Triad's official bands are Felix's to confirm.
 */
export const BUCKETS: readonly {
  id: Bucket; label: string; below: number; of15: string; of12: string; meaning: string; color: string; tint: string;
}[] = [
  { id: 'broken', label: 'Broken', below: 0.3, of15: '0–4', of12: '0–3', meaning: 'Customers are getting a different brand from the one you describe.', color: '#8f1d1d', tint: '#f6dede' },
  { id: 'apart', label: 'Pulling apart', below: 0.6, of15: '5–8', of12: '4–7', meaning: 'Some key promises are not holding, and customers notice.', color: '#e32323', tint: '#fbe7e7' },
  { id: 'almost', label: 'Almost there', below: 0.8, of15: '9–11', of12: '8–9', meaning: 'Mostly true, with one or two gaps to close.', color: '#b7791f', tint: '#f8efdb' },
  { id: 'aligned', label: 'Aligned', below: Infinity, of15: '12–15', of12: '10–12', meaning: 'What you say, what customers get and what others hear all match.', color: '#176b63', tint: '#e0eeec' },
];

export function bucketOf(score: number, max: number) {
  const share = max > 0 ? score / max : 0;
  return BUCKETS.find(b => share < b.below) ?? BUCKETS[BUCKETS.length - 1];
}

/** Each of the five checks, 0–3, in plain words. */
export const BAND_LABEL: Record<Band, string> = { 0: 'Broken', 1: 'Weak', 2: 'Mostly holds', 3: 'Strong' };

/** The five checks, as a customer would ask them. */
export const CHECKS: readonly { name: string; question: string }[] = [
  { name: 'Expectation', question: 'Is your promise clear, and is it true?' },
  { name: 'Experience', question: 'Is it easy to buy from you and use what you sell?' },
  { name: 'Reliability', question: 'Do you deliver the same way every time?' },
  { name: 'Emotional', question: 'How do customers feel about you?' },
  { name: 'Commitment', question: 'Do customers come back, renew and recommend you?' },
];
