import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from '../../shared/modal.component';

@Component({
  selector: 'gt-reproducible-screen',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './reproducible.component.html',
})
/** "How sure can I be of this score?": a modal over the snapshot, opened from a finding's receipts. Closing it reopens the receipts. */
export class ReproducibleScreenComponent {
  private readonly router = inject(Router);
  /** The finding whose receipts opened this, from the address. */
  readonly finding = input<string>('f1');

  /** Closed: slide the finding's receipts back in. */
  back(): void { this.router.navigate(['/r/SNP-2611-0417', this.finding() || 'f1'], { queryParamsHandling: 'preserve' }); }
  /** Swap straight to the subscribe modal over the same snapshot. */
  upgrade(): void { this.router.navigate(['/r/SNP-2611-0417', 'upgrade'], { queryParamsHandling: 'preserve' }); }

  readonly chatRuns = [7, 9, 6, 8, 7];
  readonly engineRuns = signal<(number | null)[]>([6, 6, 6, 6, 6]);
  readonly toast = signal(false);

  rerun(): void {
    this.engineRuns.set([null, null, null, null, null]);
    [0, 1, 2, 3, 4].forEach(k =>
      setTimeout(() => this.engineRuns.update(r => r.map((v, i) => (i === k ? 6 : v))), 250 + k * 220),
    );
    setTimeout(() => {
      this.toast.set(true);
      setTimeout(() => this.toast.set(false), 1800);
    }, 250 + 5 * 220);
  }

  width(v: number | null): string {
    return v === null ? '0%' : `${(v / 12) * 100}%`;
  }
}
