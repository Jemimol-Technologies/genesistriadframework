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
  /** Felix has signed the FreshBox report in this session (his console reflects it). */
  readonly signed = signal(false);

  readonly total = computed(() => totals(this.bands()).total);
  readonly overridden = computed(() => totals(this.bands()).overridden);
  readonly pillars = computed(() => totals(this.bands()).pillars);

  /** What the signed report shows. */
  readonly signedBands = computed(() => (this.reviewed() ? this.bands() : SIGNED));
  readonly signedTotal = computed(() => totals(this.signedBands()).total);
  readonly signedOverridden = computed(() => totals(this.signedBands()).overridden);
  readonly signedPillars = computed(() => totals(this.signedBands()).pillars);

  /** Opening a signed review directly: show what was signed (the story's call, unless Felix already reviewed live). */
  showSigned(): void {
    if (!this.reviewed()) { this.bands.set({ ...SIGNED }); this.reviewed.set(true); }
    this.signed.set(true);
  }

  /** Felix's calls on evidence the engine could not read either way, by item id. */
  readonly calls = signal<Record<string, 'pos' | 'neg'>>({});
  /** Checks Felix has ruled on from the score screen. */
  readonly ruled = signal<Partial<Record<SignalKey, 'agreed' | 'changed'>>>({});
  /** Felix's reason for each changed level. The story's recorded Emotional call is the default. */
  readonly reasons = signal<Partial<Record<SignalKey, string>>>({ emotional: 'Tone shift is a pattern across 3 months, not noise.' });

  call(id: string, lean: 'pos' | 'neg' | null): void {
    this.calls.update(c => { const n = { ...c }; if (lean) n[id] = lean; else delete n[id]; return n; });
  }

  /** Felix's ruling on one check: keep the engine's level, or set his own with a reason. */
  rule(key: SignalKey, band: Band, reason: string): void {
    this.setBand(key, band);
    const changed = band !== PROPOSED[key];
    this.ruled.update(r => ({ ...r, [key]: changed ? 'changed' : 'agreed' }));
    if (changed) this.reasons.update(r => ({ ...r, [key]: reason.trim() }));
  }

  setBand(key: SignalKey, band: Band): void {
    this.reviewed.set(true);
    this.bands.update(b => ({ ...b, [key]: band }));
  }
}
