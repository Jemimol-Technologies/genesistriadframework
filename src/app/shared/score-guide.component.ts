import { Component, inject } from '@angular/core';
import { BAND_LABEL, BUCKETS, CHECKS } from '../score.model';
import { ModalComponent } from './modal.component';
import { ScoreGuideService } from './score-guide.service';

/** "How to read your score": one explanation, opened from every score. */
@Component({
  selector: 'gt-score-guide',
  standalone: true,
  imports: [ModalComponent],
  template: `
    @if (guide.open()) {
      <gt-modal labelledBy="guide-title" closeId="close-score-guide" closeLabel="Close the score guide" (dismissed)="guide.open.set(false)">
        <div class="pad guide">
          <div class="eyebrow">Genesis Triad Alignment Score</div>
          <h2 id="guide-title" style="font-size:30px;margin:10px 0 8px;padding-right:36px">How to read <em>your score</em></h2>
          <p class="muted" style="margin:0;max-width:680px">Read the name first, then the number. The name tells you where you stand. The number tells you how many points the evidence supports.</p>

          <div class="guide-buckets">
            @for (b of buckets; track b.id) {
              <div class="guide-bucket" [style.border-top-color]="b.color">
                <b [style.color]="b.color">{{ b.label }}</b>
                <span class="small muted">{{ b.of15 }} of 15 · {{ b.of12 }} of 12</span>
                <p class="small">{{ b.meaning }}</p>
              </div>
            }
          </div>

          <div class="grid2" style="margin-top:20px">
            <div>
              <h3 style="font-size:18px;margin-bottom:6px">Five checks, 0 to 3 each</h3>
              <ul class="plain-list">
                @for (c of checks; track c.name) { <li><b>{{ c.name }}</b>: {{ c.question }}</li> }
              </ul>
              <p class="small muted" style="margin:8px 0 0">Each check is
                @for (k of bandKeys; track k; let last = $last) {<b>{{ bandLabel[k] }}</b> ({{ k }}){{ last ? '.' : ' · ' }}}
                Add the five together for a score out of 15.</p>
            </div>
            <div>
              <h3 style="font-size:18px;margin-bottom:6px">Reading it well</h3>
              <ul class="plain-list">
                <li><b>Why the free snapshot is out of 12.</b> Public evidence can check 4 of the 5. Whether customers come back needs your own data, so it waits for the full audit.</li>
                <li><b>Your starting line</b> is what your leaders believed before the evidence. The gap between that and your score is what the fixes close. Smaller is better.</li>
                <li><b>Above the line?</b> You deliver more than you say. Good for loyalty, but you are under-selling yourself.</li>
                <li><b>When we are unsure, we score low.</b> A score only goes up when the evidence clearly supports it.</li>
              </ul>
            </div>
          </div>
        </div>
      </gt-modal>
    }`,
})
export class ScoreGuideComponent {
  readonly guide = inject(ScoreGuideService);
  readonly buckets = BUCKETS;
  readonly checks = CHECKS;
  readonly bandLabel = BAND_LABEL;
  readonly bandKeys = [0, 1, 2, 3] as const;
}
