import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReviewService } from '../../review.service';

@Component({
  selector: 'gt-report-screen',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './report.component.html',
})
export class ReportScreenComponent {
  readonly s = inject(ReviewService);
}
