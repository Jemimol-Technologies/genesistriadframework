import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MONITOR_STAGES, MonitorStage, pickState } from '../../audit.model';
import { bucketOf } from '../../score.model';
import { ConsoleNavComponent } from '../../shared/console-nav.component';
import { MonitoringAlertsService } from '../../monitoring-alerts.service';
import { alertFor } from './alerts.data';

/** Felix's monitoring: every monitored client, and alerts he reviews before they reach the brand. */
@Component({
  selector: 'gt-console-monitoring',
  standalone: true,
  imports: [ConsoleNavComponent, RouterLink],
  templateUrl: './console-monitoring.component.html',
})
export class ConsoleMonitoringComponent {
  readonly bk = bucketOf;
  readonly m = inject(MonitoringAlertsService);
  /** Default: today (Thu 3 Dec). `?state=feb`: Mon 1 Feb, FreshBox's first alert. */
  readonly state = input<string | null>(null);
  readonly stage = computed<MonitorStage>(() => pickState(this.state() ?? null, MONITOR_STAGES, 'start'));
  readonly feb = computed(() => this.stage() === 'feb');
  readonly alert = computed(() => alertFor(this.stage()));
  readonly call = computed(() => this.m.callOf(this.alert().id));
}
