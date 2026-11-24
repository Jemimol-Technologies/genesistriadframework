import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReviewService } from '../../review.service';
import { BAND_LABEL, bucketOf } from '../../score.model';
import { Band, SignalKey } from '../../audit.model';

interface ReviewRow { key: SignalKey; name: string; evidence: string; confidence: number; }

@Component({
  selector: 'gt-review-screen',
  standalone: true,
  imports: [RouterLink],
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
}
