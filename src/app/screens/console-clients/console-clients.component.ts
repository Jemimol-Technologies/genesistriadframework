import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReviewService } from '../../review.service';
import { bucketOf } from '../../score.model';
import { ConsoleNavComponent } from '../../shared/console-nav.component';

/** Felix's paying clients: where each one is, and what he does next. */
@Component({
  selector: 'gt-console-clients',
  standalone: true,
  imports: [RouterLink, ConsoleNavComponent],
  templateUrl: './console-clients.component.html',
})
export class ConsoleClientsComponent {
  readonly s = inject(ReviewService);
  readonly bk = bucketOf;
  /** FreshBox's row follows whether Felix has signed in this session. */
  readonly freshbox = computed(() => this.s.signed()
    ? { stage: 'Report signed', next: 'Offer monitoring · Priya opens the report', score: this.s.signedTotal() }
    : { stage: 'Waiting for your review', next: 'Review and sign the diagnostic', score: this.s.total() });
}
