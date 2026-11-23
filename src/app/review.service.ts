import { Injectable, computed, signal } from '@angular/core';
import { Band, SignalKey } from './audit.model';

/** AI-proposed bands for the FreshBox diagnostic (before Felix's review). */
const PROPOSED: Record<SignalKey, Band> = {
  expectation: 1, experience: 2, reliability: 1, emotional: 2, commitment: 1,
};

/** Felix's review of the FreshBox diagnostic: his band calls carry from the review screen to the signed report. */
@Injectable({ providedIn: 'root' })
export class ReviewService {
  readonly proposed = PROPOSED;
  /** Bands after the principal's calls. */
  readonly bands = signal<Record<SignalKey, Band>>({ ...PROPOSED });
  readonly total = computed(() => Object.values(this.bands()).reduce<number>((a, b) => a + b, 0));
  readonly overridden = computed(() =>
    (Object.keys(PROPOSED) as SignalKey[]).filter(k => this.bands()[k] !== PROPOSED[k]),
  );
  readonly pillars = computed(() => {
    const b = this.bands();
    return {
      promise: b.expectation + b.emotional,
      proof: b.experience + b.reliability,
      echo: b.expectation + b.commitment,
    };
  });

  setBand(key: SignalKey, band: Band): void {
    this.bands.update(b => ({ ...b, [key]: band }));
  }
}
