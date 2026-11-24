import { Component, signal } from '@angular/core';
import { BUCKETS } from '../../score.model';
import { ConsoleNavComponent } from '../../shared/console-nav.component';

/** Felix's controls. Each one is a decision only he makes; the wireframe keeps changes on this page. */
@Component({
  selector: 'gt-console-settings',
  standalone: true,
  imports: [ConsoleNavComponent],
  templateUrl: './console-settings.component.html',
})
export class ConsoleSettingsComponent {
  readonly cacheDays = signal<14 | 30 | 60>(30);
  readonly competitorSnapshots = signal<'auto' | 'hold'>('auto');
  readonly buckets = BUCKETS;
  /** Cut-offs as whole percentages: where each level ends. */
  readonly cutoffs = signal([30, 60, 80]);
  readonly reask = signal({ promise: true, newLeader: true, yearly: true, quarterly: true });
  readonly saved = signal(false);

  setCutoff(i: number, v: string): void {
    const n = Math.max(1, Math.min(99, Number(v) || 0));
    this.cutoffs.update(c => c.map((x, k) => (k === i ? n : x)));
    this.saved.set(false);
  }
  toggle(k: 'promise' | 'newLeader' | 'yearly' | 'quarterly'): void {
    this.reask.update(r => ({ ...r, [k]: !r[k] }));
    this.saved.set(false);
  }
  range(i: number): string {
    const c = this.cutoffs();
    return i === 0 ? `under ${c[0]}%` : i === 3 ? `${c[2]}% and above` : `${c[i - 1]}–${c[i] - 1}%`;
  }
}
