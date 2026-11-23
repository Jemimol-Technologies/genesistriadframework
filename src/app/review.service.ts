import { Injectable, computed, signal } from '@angular/core';
import { Band, SignalKey } from './audit.model';

/** AI-proposed bands for the FreshBox diagnostic (before Felix's review). */
const PROPOSED: Record<SignalKey, Band> = {
  expectation: 1, experience: 2, reliability: 1, emotional: 2, commitment: 1,
};

/** What Felix signed in the story: Emotional 2 → 1 ("tone shift is a pattern across 3 months, not noise"). */
const SIGNED: Record<SignalKey, Band> = { ...PROPOSED, emotional: 1 };

function totals(b: Record<SignalKey, Band>) {
  return {
    total: Object.values(b).reduce<number>((a, x) => a + x, 0),
    overridden: (Object.keys(PROPOSED) as SignalKey[]).filter(k => b[k] !== PROPOSED[k]),
    pillars: { promise: b.expectation + b.emotional, proof: b.experience + b.reliability, echo: b.expectation + b.commitment },
  };
}

/**
 * Felix's review of the FreshBox diagnostic.
 * His review screen starts from the AI's proposal (`bands`). Priya's signed report shows what he signed (`signed*`):
 * the story's recorded call, or his live clicks once the review screen has been used in this session.
 */
@Injectable({ providedIn: 'root' })
export class ReviewService {
  readonly proposed = PROPOSED;
  /** Bands on Felix's review screen. */
  readonly bands = signal<Record<SignalKey, Band>>({ ...PROPOSED });
  private readonly reviewed = signal(false);

  readonly total = computed(() => totals(this.bands()).total);
  readonly overridden = computed(() => totals(this.bands()).overridden);
  readonly pillars = computed(() => totals(this.bands()).pillars);

  /** What the signed report shows. */
  readonly signedBands = computed(() => (this.reviewed() ? this.bands() : SIGNED));
  readonly signedTotal = computed(() => totals(this.signedBands()).total);
  readonly signedOverridden = computed(() => totals(this.signedBands()).overridden);
  readonly signedPillars = computed(() => totals(this.signedBands()).pillars);

  setBand(key: SignalKey, band: Band): void {
    this.reviewed.set(true);
    this.bands.update(b => ({ ...b, [key]: band }));
  }
}
