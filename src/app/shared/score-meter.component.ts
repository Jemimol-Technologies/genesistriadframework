import { Component, computed, inject, input } from '@angular/core';
import { BUCKETS, bucketOf } from '../score.model';
import { ScoreGuideService } from './score-guide.service';

/**
 * A score as people read it: the bucket name first, the number second, a four-band bar with
 * "you are here", an optional "your leaders believed" tick, and a way into the explanation.
 */
@Component({
  selector: 'gt-score-meter',
  standalone: true,
  template: `
    <div class="sm" [class.sm-compact]="compact()">
      <div class="sm-head">
        <b class="sm-bucket" [style.color]="bucket().color">{{ bucket().label }}</b>
        <span class="sm-num">{{ score() }} <span>of {{ max() }}</span></span>
      </div>
      <div class="sm-bar" role="img" [attr.aria-label]="bucket().label + ', ' + score() + ' of ' + max() + (believed() !== null ? '; leaders believed ' + believed() : '')">
        @for (b of buckets; track b.id; let i = $index) {
          <span class="sm-seg" [style.flex]="width(i)" [style.background]="b.id === bucket().id ? b.color : b.tint"></span>
        }
        <i class="sm-here" [style.left.%]="pos(score())" [style.border-top-color]="bucket().color"></i>
        @if (believed() !== null) { <i class="sm-believed" [style.left.%]="pos(believed()!)"></i> }
      </div>
      @if (!compact()) {
        <div class="sm-labels" aria-hidden="true">
          @for (b of buckets; track b.id; let i = $index) {
            <span [style.flex]="width(i)" [style.color]="b.color" [class.on]="b.id === bucket().id">{{ b.label }}</span>
          }
        </div>
      }
      @if (believed() !== null) {
        <div class="sm-legend"><span class="sm-dot" [style.background]="bucket().color"></span>The evidence: {{ bucket().label }} ({{ score() }})
          <span class="sm-dash"></span>Your leaders believed: {{ believedBucket()!.label }} ({{ believed() }})</div>
      }
      @if (showMeaning()) { <p class="sm-meaning">{{ bucket().meaning }}</p> }
      <button type="button" class="sm-help" [id]="helpId()" (click)="guide.open.set(true)">ⓘ What does this score mean?</button>
    </div>`,
})
export class ScoreMeterComponent {
  readonly guide = inject(ScoreGuideService);
  readonly score = input.required<number>();
  readonly max = input.required<number>();
  /** What leaders believed, on the same scale. */
  readonly believed = input<number | null>(null);
  readonly showMeaning = input(false);
  readonly compact = input(false);
  /** Stable id for the help link, so story replays can click it. */
  readonly helpId = input('score-help');

  readonly buckets = BUCKETS;
  readonly bucket = computed(() => bucketOf(this.score(), this.max()));
  readonly believedBucket = computed(() => (this.believed() === null ? null : bucketOf(this.believed()!, this.max())));

  /** Band widths follow the cut-offs: 30% · 30% · 20% · 20%. */
  width(i: number): string {
    const lo = i === 0 ? 0 : BUCKETS[i - 1].below, hi = Math.min(BUCKETS[i].below, 1);
    return `${Math.round((hi - lo) * 100)} 1 0`;
  }
  pos(v: number): number { return Math.max(0, Math.min(100, (v / this.max()) * 100)); }
}
