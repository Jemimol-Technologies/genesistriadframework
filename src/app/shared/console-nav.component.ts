import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReviewService } from '../review.service';

/** Felix's console sidebar, shared by every console screen. */
export type ConsoleSection = 'queue' | 'snapshots' | 'clients' | 'monitoring' | 'settings';

@Component({
  selector: 'gt-console-nav',
  standalone: true,
  imports: [RouterLink],
  host: { class: 'side' },
  template: `
    <div class="wm"><img alt="" src="logo.png">GENESIS TRIAD</div>
    <a id="nav-queue" routerLink="/console/queue" [class.on]="active() === 'queue'">Review queue @if (waiting() > 0) {<b>{{ waiting() }}</b>}</a>
    <a id="nav-snapshots" routerLink="/console/snapshots" [class.on]="active() === 'snapshots'">Snapshots</a>
    <a id="nav-clients" routerLink="/console/clients" [class.on]="active() === 'clients'">Clients</a>
    <a id="nav-monitoring" routerLink="/console/monitoring" [class.on]="active() === 'monitoring'">Monitoring <b>1</b></a>
    <a id="nav-settings" routerLink="/console/settings" [class.on]="active() === 'settings'">Settings</a>
    <div class="me"><b>Felix Chandran G</b>Principal · {{ today() }}
      <a id="sign-out" routerLink="/" class="sign-out">Sign out</a></div>`,
})
export class ConsoleNavComponent {
  private readonly s = inject(ReviewService);
  readonly active = input.required<ConsoleSection>();
  /** The demo date the screen is set on. */
  readonly today = input('Thu 3 Dec 2026');
  /** Audits waiting for Felix: FreshBox drops off once he signs it. */
  readonly waiting = computed(() => (this.s.signed() ? 1 : 2));
}
