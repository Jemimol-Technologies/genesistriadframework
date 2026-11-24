import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { DIAGNOSTIC_STAGES, DiagnosticStage, pickState } from '../../audit.model';
import { ReviewService } from '../../review.service';
import { ScoreMeterComponent } from '../../shared/score-meter.component';

/**
 * What Priya sees after "Submit for analysis". Felix's console is never shown to her.
 * Default: with Felix, and what happens next. `?state=ready`: Felix has signed, her report is ready.
 */
@Component({
  selector: 'gt-submitted-screen',
  standalone: true,
  imports: [RouterLink, ScoreMeterComponent],
  templateUrl: './submitted.component.html',
})
export class SubmittedScreenComponent {
  readonly s = inject(ReviewService);
  readonly state = input<string | null>(null);
  readonly stage = computed<DiagnosticStage>(() => pickState(this.state() ?? null, DIAGNOSTIC_STAGES, 'waiting'));
  readonly ready = computed(() => this.stage() === 'ready');

  constructor() {
    const title = inject(Title);
    effect(() => title.setTitle(this.ready() ? 'Report ready · Genesis Triad' : 'Submitted · Genesis Triad'));
  }
}
