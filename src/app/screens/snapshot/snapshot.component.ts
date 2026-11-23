import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Band, READINGS, Reading, pickState } from '../../audit.model';

/** Finding kinds (store values); display lives in FINDING_KIND. */
type FindingKind = 'drift' | 'watch' | 'strength' | 'undertold';

const FINDING_KIND: Record<FindingKind, { label: string; chip: string; border: string; vsColor: string }> = {
  drift: { label: 'Promise drift', chip: 'red', border: 'var(--red)', vsColor: 'var(--red)' },
  watch: { label: 'Watch', chip: 'amber', border: 'var(--sand)', vsColor: '#7a5414' },
  strength: { label: 'Holding', chip: 'teal', border: 'var(--teal)', vsColor: 'var(--teal)' },
  undertold: { label: 'Under-told', chip: 'teal', border: 'var(--teal)', vsColor: 'var(--teal)' },
};

const BAND_LABEL: Record<Band, string> = { 0: 'Critical', 1: 'Weak', 2: 'Stable', 3: 'Strong' };

interface Finding {
  kind: FindingKind; kindLabel?: string; signals: string; title: string;
  vs?: { promise: string; sym: string; proof: string };
  /** Opens the evidence drawer (only wired for the story's main finding). */
  opens?: boolean;
}

interface Scenario {
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

const SCENARIOS: Record<Reading, Scenario> = {
  apart: {
    label: 'Pulling apart',
    headline: 'Your promise and experience are <em>pulling apart.</em>',
    bands: { expectation: 1, experience: 2, reliability: 1, emotional: 2 },
    findingsTitle: 'Top drifts we found', shown: '3 of 7 shown',
    findings: [
      { kind: 'drift', signals: 'Reliability · Expectation', title: '“Delivered in 30 minutes” — customers report about 70', opens: true,
        vs: { promise: '<b>Promise</b> · homepage<br>“Delivered fresh in 30 minutes.”', sym: '≠', proof: '<b>Proof</b> · 38 of 41 delivery reviews<br>Median reported wait ≈ 70 min' } },
      { kind: 'drift', kindLabel: 'Message drift', signals: 'Expectation', title: 'Website says “premium”; founder\'s posts say “cheapest”' },
      { kind: 'watch', kindLabel: 'Experience drift', signals: 'Emotional', title: '“Small portions for the price” — a repeated pattern, 52 reviews' },
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
      { kind: 'watch', kindLabel: 'Slipping', signals: 'Reliability · Expectation', title: '30 minutes holds on weekdays; weekends run about 50',
        vs: { promise: '<b>Promise</b> · homepage<br>“Delivered fresh in 30 minutes.”', sym: '≈', proof: '<b>Proof</b> · 112 delivery reviews<br>Weekdays ≈ 32 min · weekends ≈ 50 min' } },
      { kind: 'strength', signals: 'Experience', title: 'Checkout is quick and clear — 4 steps, no forced sign-up' },
      { kind: 'strength', signals: 'Emotional', title: '“Fresh” and “tasty” dominate reviews, steady for 12 months' },
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
      { kind: 'strength', signals: 'Reliability · Expectation', title: '“30 minutes” is what customers report — 94% of delivery reviews',
        vs: { promise: '<b>Promise</b> · homepage<br>“Delivered fresh in 30 minutes.”', sym: '=', proof: '<b>Proof</b> · 140 delivery reviews<br>Median reported wait ≈ 28 min' } },
      { kind: 'strength', signals: 'Expectation', title: 'Website, ads and founder posts all say “premium, chef-designed”' },
      { kind: 'strength', signals: 'Emotional', title: 'Tone is warm and stable — no negative shift in 12 months' },
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
      { kind: 'undertold', signals: 'Expectation · Reliability', title: 'You promise “within the hour”; customers report about 25 minutes',
        vs: { promise: '<b>Promise</b> · homepage<br>“Delivered within the hour.”', sym: '<', proof: '<b>Proof</b> · 140 delivery reviews<br>Median reported wait ≈ 25 min' } },
      { kind: 'undertold', signals: 'Expectation', title: 'Reviews praise “restaurant quality”; your site says “affordable home meals”' },
      { kind: 'undertold', signals: 'Emotional', title: '“Delighted” and “surprised” top review themes — expectations set too low' },
    ],
    lockedTeaser: '1. Raise the promise to what you already deliver …<br>2. Price position vs perceived quality …<br>3. Put review language into the Echo …',
    lockedPitch: 'Over-delivery is drift too: the experience is paying for a promise you are not making. The full audit shows what to claim — and what it is worth.',
    cta: 'Unlock the full audit',
    note: 'A high score with a direction: Proof is ahead of Promise and Echo. Good for loyalty, costly for acquisition and pricing.',
  },
};

@Component({
  selector: 'gt-snapshot-screen',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './snapshot.component.html',
})
export class SnapshotScreenComponent {
  readonly kinds = FINDING_KIND;
  readonly bandLabel = BAND_LABEL;
  private readonly router = inject(Router);
  /** `?state=apart|almost|aligned|over`: which reading this brand's snapshot shows. Default: apart. */
  readonly state = input<string | null>(null);
  readonly reading = computed<Reading>(() => pickState(this.state() ?? null, READINGS, 'apart'));
  readonly sc = computed(() => SCENARIOS[this.reading()]);
  readonly total = computed(() => Object.values(this.sc().bands).reduce((a: number, b) => a + b, 0));
  readonly rows = computed(() => {
    const b = this.sc().bands;
    return [
      { name: 'Expectation', hint: 'Promise understood &amp; true?', band: b.expectation },
      { name: 'Experience', hint: 'Low friction?', band: b.experience },
      { name: 'Reliability', hint: 'Delivers consistently?', band: b.reliability },
      { name: 'Emotional', hint: 'How people feel', band: b.emotional },
    ];
  });

  /** Open the first finding's receipts. */
  open(): void { this.router.navigateByUrl('/r/SNP-2611-0417/f1'); }
}
