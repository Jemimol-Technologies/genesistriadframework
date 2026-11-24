import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReviewService } from '../../review.service';
import { BUCKETS, bucketOf } from '../../score.model';
import { ScoreGuideService } from '../../shared/score-guide.service';
import { ConsoleNavComponent } from '../../shared/console-nav.component';

@Component({
  selector: 'gt-queue-screen',
  standalone: true,
  imports: [RouterLink, ConsoleNavComponent],
  templateUrl: './queue.component.html',
})
export class QueueScreenComponent {
  readonly s = inject(ReviewService);
  readonly bk = bucketOf;
  readonly buckets = BUCKETS;
  readonly guide = inject(ScoreGuideService);
}
