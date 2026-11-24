import { Injectable, signal } from '@angular/core';

/** Opens "How to read your score" from anywhere a score is shown. */
@Injectable({ providedIn: 'root' })
export class ScoreGuideService {
  readonly open = signal(false);
}
