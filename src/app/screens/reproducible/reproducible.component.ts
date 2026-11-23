import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'gt-reproducible-screen',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './reproducible.component.html',
})
export class ReproducibleScreenComponent {
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
