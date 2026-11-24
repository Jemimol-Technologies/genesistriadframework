import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConsoleNavComponent } from '../../shared/console-nav.component';
import { MonitoringAlertsService } from '../../monitoring-alerts.service';
import { BAND_LABEL, bucketOf } from '../../score.model';
import { FROM, WEIGHT } from '../review/review.data';
import { ALERT_LEAN, AlertItem, AlertLean, alertFile } from '../console-monitoring/alerts.data';

/** One drift alert, opened: what changed, the evidence both ways, how it became an alert, and Felix's decision. */
@Component({
  selector: 'gt-console-alert',
  standalone: true,
  imports: [RouterLink, ConsoleNavComponent],
  templateUrl: './console-alert.component.html',
})
export class ConsoleAlertComponent {
  readonly m = inject(MonitoringAlertsService);
  private readonly router = inject(Router);
  readonly alert = input<string>('');
  readonly a = computed(() => alertFile(this.alert()));
  readonly lean = ALERT_LEAN;
  readonly leans: AlertLean[] = ['drift', 'fine', 'unsure'];
  readonly from = FROM;
  readonly weight = WEIGHT;
  readonly bandLabel = BAND_LABEL;
  readonly bk = bucketOf;
  readonly call = computed(() => { const a = this.a(); return a ? this.m.callOf(a.id) : 'pending'; });
  /** Back to the monitoring page on the alert's own demo date. */
  readonly backQuery = computed(() => (this.a()?.stage === 'feb' ? { state: 'feb' } : {}));

  readonly dismissing = signal(false);
  readonly reason = signal('');

  constructor() {
    effect(() => { if (this.alert() && !this.a()) this.router.navigate(['/console/monitoring']); });
  }

  itemsOf(l: AlertLean): AlertItem[] { return this.a()?.items.filter(i => i.lean === l) ?? []; }
  weightOf(l: AlertLean): number { return this.itemsOf(l).reduce((s, i) => s + i.weight, 0); }
  driftShare(): number { const d = this.weightOf('drift'), f = this.weightOf('fine'); return d + f ? d / (d + f) : 0; }
  pct(v: number): string { return `${Math.round(v * 100)}%`; }
  dots(w: number): number[] { return [1, 2, 3].map(n => (n <= w ? 1 : 0)); }

  confirmDismiss(): void {
    const a = this.a();
    if (!a || this.reason().trim().length < 4) return;
    this.m.dismiss(a.id, this.reason());
    this.dismissing.set(false);
  }
}
