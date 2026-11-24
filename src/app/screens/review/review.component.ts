import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConsoleNavComponent } from '../../shared/console-nav.component';
import { ModalComponent } from '../../shared/modal.component';
import { ScoreMeterComponent } from '../../shared/score-meter.component';
import { ReviewService } from '../../review.service';
import { BAND_LABEL, bucketOf } from '../../score.model';
import { Band, SignalKey } from '../../audit.model';
import { checkFile } from './review.data';

interface ReviewRow { key: SignalKey; name: string; evidence: string; confidence: number; }

@Component({
  selector: 'gt-review-screen',
  standalone: true,
  imports: [RouterLink, ConsoleNavComponent, ModalComponent, ScoreMeterComponent],
  templateUrl: './review.component.html',
})
export class ReviewScreenComponent {
  readonly s = inject(ReviewService);
  readonly bk = bucketOf;
  readonly bandLabel = BAND_LABEL;
  readonly bandValues: Band[] = [0, 1, 2, 3];
  /** Calls below this confidence are flagged for the principal. */
  readonly threshold = 0.7;
  readonly rows: ReviewRow[] = [
    { key: 'expectation', name: 'Expectation', confidence: 0.91, evidence: '38/41 delivery reviews · checkout 45–90 min · intent: founder “premium”, sales “cheapest”' },
    { key: 'experience', name: 'Experience', confidence: 0.84, evidence: 'Checkout completion 71% · 11-field sign-up · 9% need help' },
    { key: 'reliability', name: 'Reliability', confidence: 0.93, evidence: 'On-time (own window) 58% · rework 6%' },
    { key: 'emotional', name: 'Emotional', confidence: 0.62, evidence: '★ 3.9 avg · tone shifting “confused” → “annoyed” in last 60 days' },
    { key: 'commitment', name: 'Commitment', confidence: 0.66, evidence: 'Repeat orders 24% (90 days) · referral 3%' },
  ];
  /** Confidence is stored 0–1 (as the decision model returns it) and shown as a percentage. */
  pct(v: number): string { return `${Math.round(v * 100)}%`; }
  readonly emotionalOverridden = computed(() => this.s.bands().emotional !== this.s.proposed.emotional);

  private readonly router = inject(Router);
  /** `?state=signed`: Felix has signed and sent the report. */
  readonly state = input<string | null>(null);
  readonly signedState = computed(() => this.state() === 'signed');
  readonly confirming = signal(false);

  constructor() {
    // Opening the signed state directly reflects the story's recorded signature.
    effect(() => { if (this.signedState()) untracked(() => this.s.showSigned()); }, { allowSignalWrites: true });
  }

  /** Item counts per lean, for the drill-down link on each row. */
  counts(k: SignalKey) {
    const items = checkFile(k)?.items ?? [];
    return { pos: items.filter(i => i.lean === 'pos').length, neg: items.filter(i => i.lean === 'neg').length, unsure: items.filter(i => i.lean === 'unsure').length };
  }
  readonly ruledCount = computed(() => Object.keys(this.s.ruled()).length);

  nameOf(k: SignalKey): string { return this.rows.find(r => r.key === k)?.name ?? k; }

  sign(): void {
    this.s.signed.set(true);
    this.confirming.set(false);
    this.router.navigate(['/console/review/freshbox'], { queryParams: { state: 'signed' } });
  }
}
