import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConsoleNavComponent } from '../../shared/console-nav.component';
import { ReviewService } from '../../review.service';
import { BAND_LABEL } from '../../score.model';
import { Band } from '../../audit.model';
import { CHECK_FILES, LEAN, LEVEL_LINES, WEIGHT, checkFile, weigh } from '../review/review.data';

/** How one check's evidence was consolidated into its level, and Felix's ruling on it. */
@Component({
  selector: 'gt-review-score-screen',
  standalone: true,
  imports: [RouterLink, ConsoleNavComponent],
  templateUrl: './review-score.component.html',
})
export class ReviewScoreScreenComponent {
  readonly s = inject(ReviewService);
  private readonly router = inject(Router);
  readonly check = input<string>('');
  readonly file = computed(() => checkFile(this.check()));
  readonly bandLabel = BAND_LABEL;
  readonly lean = LEAN;
  readonly weight = WEIGHT;
  readonly lines = LEVEL_LINES;
  readonly bands: Band[] = [0, 1, 2, 3];
  readonly engine = computed(() => { const f = this.file(); return f ? weigh(f) : null; });
  readonly mine = computed(() => { const f = this.file(); return f ? weigh(f, this.s.calls()) : null; });
  readonly hasCalls = computed(() => !!this.file()?.items.some(i => this.s.calls()[i.id]));
  readonly agree = computed(() => { const f = this.file(); return f ? f.runs.filter(r => r === this.s.proposed[f.key]).length : 0; });
  readonly next = computed(() => { const i = CHECK_FILES.findIndex(c => c.key === this.file()?.key); return CHECK_FILES[i + 1] ?? null; });
  readonly locked = computed(() => this.s.signed());

  /** The level Felix is about to rule, and his reason if it differs from the engine. */
  readonly pick = signal<Band>(0);
  readonly reason = signal('');
  readonly changing = computed(() => { const f = this.file(); return !!f && this.pick() !== this.s.proposed[f.key]; });
  readonly canRule = computed(() => !this.changing() || this.reason().trim().length > 3);

  constructor() {
    effect(() => { if (this.check() && !this.file()) this.router.navigate(['/console/review/freshbox']); });
    effect(() => {
      const f = this.file();
      if (!f) return;
      untracked(() => { this.pick.set(this.s.bands()[f.key]); this.reason.set(this.s.reasons()[f.key] ?? ''); });
    }, { allowSignalWrites: true });
  }

  pct(v: number): string { return `${Math.round(v * 100)}%`; }

  rule(): void {
    const f = this.file();
    if (!f || !this.canRule()) return;
    this.s.rule(f.key, this.pick(), this.reason());
  }
}
