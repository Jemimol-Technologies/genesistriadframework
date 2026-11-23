import { Component, OnDestroy, computed, effect, input, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COLLECT_MODES, pickState } from '../../audit.model';

interface Source { name: string; detail: string; unit: string; target: number; count: number; state: 'wait' | 'run' | 'done'; }

@Component({
  selector: 'gt-collect-screen',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './collect.component.html',
})
export class CollectScreenComponent implements OnDestroy {
  /** `?state=hit`: the brand was scanned within the cache window, so the cached snapshot is shown. Default: a fresh collection. */
  readonly state = input<string | null>(null);
  readonly mode = computed(() => pickState(this.state() ?? null, COLLECT_MODES, 'miss'));
  readonly frozen = signal(false);
  readonly sources = signal<Source[]>([
    { name: 'Website, today', detail: 'Home, pricing, menu, FAQ, checkout', unit: 'pages', target: 14 },
    { name: 'Website history', detail: 'Archived versions, 2023 → 2026', unit: 'snapshots', target: 38 },
    { name: 'Customer reviews', detail: 'Google Maps · names removed before analysis', unit: 'reviews', target: 412 },
    { name: 'Public posts', detail: 'Company & founder, last 12 months', unit: 'posts', target: 27 },
    { name: 'Search results', detail: 'Brand queries + AI overview', unit: 'results', target: 22 },
    { name: 'Customer path walk', detail: 'Landing → sign-up → checkout (public steps)', unit: 'steps', target: 6 },
  ].map(x => ({ ...x, count: 0, state: 'wait' as const })));

  private timer?: ReturnType<typeof setInterval>;

  constructor() {
    effect(() => {
      const mode = this.mode();
      untracked(() => this.apply(mode));
    }, { allowSignalWrites: true });
  }

  /** Show a fresh collection or a cached snapshot. */
  private apply(mode: 'miss' | 'hit'): void {
    clearInterval(this.timer);
    if (mode === 'hit') {
      this.sources.update(list => list.map(x => ({ ...x, count: x.target, state: 'done' as const })));
      this.frozen.set(true);
    } else {
      this.sources.update(list => list.map(x => ({ ...x, count: 0, state: 'wait' as const })));
      this.frozen.set(false);
      this.run();
    }
  }

  private run(): void {
    let i = 0;
    this.timer = setInterval(() => {
      const list = this.sources();
      if (i >= list.length) { clearInterval(this.timer); this.frozen.set(true); return; }
      const cur = list[i];
      const next = Math.min(cur.target, cur.count + Math.max(1, Math.ceil(cur.target / 14)));
      const done = next >= cur.target;
      this.sources.set(list.map((x, k) => k === i ? { ...x, count: next, state: done ? 'done' : 'run' } : x));
      if (done) i++;
    }, 45);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
