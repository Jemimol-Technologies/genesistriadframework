import { Component, computed, effect, input, signal, untracked } from '@angular/core';
import { MONITOR_STAGES, MonitorStage, pickState } from '../../audit.model';

/** What the brand does about a drift alert (store values). */
type AlertCall = 'open' | 'confirm-rebaseline' | 'rebaseline-sent' | 'fixing';

/**
 * Monitoring, in the brand's app.
 * Default: just started (only the audit's score so far). `?state=feb`: three months on, with a drift alert.
 * Leaders are not re-asked each cycle; their 25 Nov answers stay the starting line unless the promise changes.
 */
@Component({
  selector: 'gt-monitor-screen',
  standalone: true,
  templateUrl: './monitor.component.html',
})
export class MonitorScreenComponent {
  readonly state = input<string | null>(null);
  readonly stage = computed<MonitorStage>(() => pickState(this.state() ?? null, MONITOR_STAGES, 'start'));
  readonly feb = computed(() => this.stage() === 'feb');
  /** `?cadence=quarterly` when chosen in the offer; monthly otherwise. The Feb story is monthly. */
  readonly cadence = input<string | null>(null);
  readonly quarterly = computed(() => this.cadence() === 'quarterly');
  readonly cadenceLabel = computed(() => (this.quarterly() ? 'quarterly' : 'monthly'));
  readonly firstRescanDate = computed(() => (this.quarterly() ? 'Mon 1 Mar 2027' : 'Mon 4 Jan 2027'));
  readonly firstRescan = computed(() => `${this.firstRescanDate()}, then ${this.quarterly() ? 'every quarter' : 'monthly'}`);

  /** Observed score per monthly re-scan; the audit itself is November. */
  readonly points = computed(() => {
    const all = [{ m: 'Nov', v: 6, x: 70 }, { m: 'Dec', v: 8, x: 210 }, { m: 'Jan', v: 9, x: 350 }, { m: 'Feb', v: 10, x: 480 }];
    return this.feb() ? all : all.slice(0, 1);
  });
  readonly path = computed(() => this.points().map((p, i) => `${i ? 'L' : 'M'}${p.x} ${this.y(p.v)}`).join(' '));
  readonly gapFill = computed(() => {
    const p = this.points();
    return p.length > 1 ? `${this.path()} L${p[p.length - 1].x} ${this.y(12)} L${p[0].x} ${this.y(12)} Z` : '';
  });

  readonly alert = signal<AlertCall>('open');
  readonly leaders = ['Priya R.', 'Arjun M.', 'Meera S.'];

  constructor() {
    effect(() => { this.stage(); untracked(() => this.alert.set('open')); }, { allowSignalWrites: true });
  }

  /** Score (0–15) to chart y. */
  y(v: number): number { return 200 - v * 12; }
}
