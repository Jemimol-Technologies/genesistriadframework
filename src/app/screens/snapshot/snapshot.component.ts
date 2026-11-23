import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { READINGS, Reading, pickState } from '../../audit.model';
import { BAND_LABEL, FINDING_KIND, FindingId, SCENARIOS } from './snapshot.data';

@Component({
  selector: 'gt-snapshot-screen',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './snapshot.component.html',
})
export class SnapshotScreenComponent {
  private readonly router = inject(Router);
  readonly kinds = FINDING_KIND;
  readonly bandLabel = BAND_LABEL;
  /** `?state=apart|almost|aligned|over`: which reading this brand's snapshot shows. Default: apart. */
  readonly state = input<string | null>(null);
  readonly reading = computed<Reading>(() => pickState(this.state() ?? null, READINGS, 'apart'));
  readonly sc = computed(() => SCENARIOS[this.reading()]);
  readonly total = computed(() => Object.values(this.sc().bands).reduce((a: number, b) => a + b, 0));
  readonly rows = computed(() => {
    const b = this.sc().bands;
    return [
      { name: 'Expectation', hint: 'Promise understood &amp; true?', band: b.expectation },
      { name: 'Experience', hint: 'Low friction?', band: b.experience },
      { name: 'Reliability', hint: 'Delivers consistently?', band: b.reliability },
      { name: 'Emotional', hint: 'How people feel', band: b.emotional },
    ];
  });

  /** Open a finding's receipts over this snapshot, keeping the reading in the address. */
  open(id: FindingId): void {
    this.router.navigate(['/r/SNP-2611-0417', id], { queryParamsHandling: 'preserve' });
  }
}
