import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ModalComponent } from '../../shared/modal.component';

/** "Keep it aligned": the monitoring offer, as a modal over the signed report. Nothing is bought until "Start monitoring". */
@Component({
  selector: 'gt-monitoring-offer',
  standalone: true,
  imports: [RouterLink, ModalComponent],
  templateUrl: './monitoring-offer.component.html',
})
export class MonitoringOfferComponent {
  private readonly router = inject(Router);
  /** Re-scan cadence (store value). */
  readonly cadence = signal<'monthly' | 'quarterly'>('monthly');

  back(): void { this.router.navigate(['/diagnostic/freshbox']); }
}
