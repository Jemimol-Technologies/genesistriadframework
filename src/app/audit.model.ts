/** The five Genesis Triad alignment signals (store values). */
export type SignalKey = 'expectation' | 'experience' | 'reliability' | 'emotional' | 'commitment';
export type Band = 0 | 1 | 2 | 3;

/** Screen states reached by address (`?state=`). Store values; anything else falls back to the default. */
export type CollectMode = 'miss' | 'hit';
export const COLLECT_MODES: readonly CollectMode[] = ['miss', 'hit'];
export type Reading = 'apart' | 'almost' | 'aligned' | 'over';
export const READINGS: readonly Reading[] = ['apart', 'almost', 'aligned', 'over'];

/** Read a `?state=` value against its allowed list. */
export function pickState<T extends string>(raw: string | null, allowed: readonly T[], fallback: T): T {
  return allowed.includes(raw as T) ? (raw as T) : fallback;
}
