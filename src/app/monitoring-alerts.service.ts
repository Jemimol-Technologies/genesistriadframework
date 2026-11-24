import { Injectable, signal } from '@angular/core';
import { ALERT_FILES } from './screens/console-monitoring/alerts.data';

/** What Felix does with a drift alert before the brand sees it (store values). */
export type AlertCall = 'pending' | 'sent' | 'held' | 'dismissed';

/** Felix's decisions on drift alerts, shared by the monitoring list and each alert's drill-down. */
@Injectable({ providedIn: 'root' })
export class MonitoringAlertsService {
  readonly calls = signal<Record<string, AlertCall>>({});
  /** The note to the brand, starting from the engine's draft. */
  readonly notes = signal<Record<string, string>>(Object.fromEntries(ALERT_FILES.map(a => [a.id, a.draft])));
  readonly dismissReasons = signal<Record<string, string>>({});

  callOf(id: string): AlertCall { return this.calls()[id] ?? 'pending'; }
  setCall(id: string, call: AlertCall): void { this.calls.update(c => ({ ...c, [id]: call })); }
  setNote(id: string, text: string): void { this.notes.update(n => ({ ...n, [id]: text })); }
  dismiss(id: string, reason: string): void {
    this.dismissReasons.update(r => ({ ...r, [id]: reason.trim() }));
    this.setCall(id, 'dismissed');
  }
}
