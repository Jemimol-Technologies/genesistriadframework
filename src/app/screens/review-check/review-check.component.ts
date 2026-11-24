import { Component, computed, effect, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConsoleNavComponent } from '../../shared/console-nav.component';
import { ReviewService } from '../../review.service';
import { BAND_LABEL } from '../../score.model';
import { CHECK_FILES, EvidenceItem, FROM, LEAN, Lean, WEIGHT, checkFile, weigh } from '../review/review.data';

/** One check's case file: every piece of evidence, sorted by which way it points. */
@Component({
  selector: 'gt-review-check-screen',
  standalone: true,
  imports: [RouterLink, ConsoleNavComponent],
  templateUrl: './review-check.component.html',
})
export class ReviewCheckScreenComponent {
  readonly s = inject(ReviewService);
  private readonly router = inject(Router);
  readonly check = input<string>('');
  readonly file = computed(() => checkFile(this.check()));
  readonly files = CHECK_FILES;
  readonly bandLabel = BAND_LABEL;
  readonly lean = LEAN;
  readonly from = FROM;
  readonly weight = WEIGHT;
  readonly leans: Lean[] = ['pos', 'neg', 'unsure'];
  readonly engine = computed(() => { const f = this.file(); return f ? weigh(f) : null; });
  readonly withCalls = computed(() => { const f = this.file(); return f ? weigh(f, this.s.calls()) : null; });
  readonly locked = computed(() => this.s.signed());

  constructor() {
    effect(() => { if (this.check() && !this.file()) this.router.navigate(['/console/review/freshbox']); });
  }

  itemsOf(l: Lean): EvidenceItem[] { return this.file()?.items.filter(i => i.lean === l) ?? []; }
  weightOf(l: Lean): number { return this.itemsOf(l).reduce((a, i) => a + i.weight, 0); }
  pct(v: number): string { return `${Math.round(v * 100)}%`; }
  dots(w: number): number[] { return [1, 2, 3].map(n => (n <= w ? 1 : 0)); }
}
