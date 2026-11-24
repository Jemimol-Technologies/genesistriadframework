import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ReviewService } from '../../review.service';
import { CONNECTION_SHEET, VERDICT, Verdict } from './report.data';
import { BAND_LABEL, bucketOf } from '../../score.model';
import { ScoreMeterComponent } from '../../shared/score-meter.component';

@Component({
  selector: 'gt-report-screen',
  standalone: true,
  imports: [RouterLink, RouterOutlet, ScoreMeterComponent],
  templateUrl: './report.component.html',
})
export class ReportScreenComponent {
  readonly s = inject(ReviewService);
  readonly bk = bucketOf;
  readonly bl = BAND_LABEL;
  readonly sheet = CONNECTION_SHEET;
  readonly verdict = VERDICT;
  readonly evidenceTotal = CONNECTION_SHEET.reduce((a, r) => a + r.evidence, 0);
  /** Rows per verdict, in display order, for the summary strip. */
  readonly counts = (['broken', 'drifting', 'unsupported', 'holding'] as Verdict[])
    .map(v => ({ v, n: CONNECTION_SHEET.filter(r => r.verdict === v).length }))
    .filter(x => x.n > 0);
}
