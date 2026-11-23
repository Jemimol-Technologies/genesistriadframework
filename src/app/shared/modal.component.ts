import { Component, HostListener, OnDestroy, OnInit, inject, input, output, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/** Matches the .modal-layer.leaving animation. */
const FADE_OUT_MS = 160;

/**
 * A modal over the screen that opened it: dimmed backdrop, ✕, Esc and backdrop click all close it.
 * `dismissed` fires after the fade-out; the host decides where that leads (a route change).
 */
@Component({
  selector: 'gt-modal',
  standalone: true,
  template: `
    <div class="modal-layer" [class.leaving]="leaving()">
      <div class="modal-backdrop" (click)="close()"></div>
      <div class="modal" role="dialog" aria-modal="true" [attr.aria-labelledby]="labelledBy()">
        <button [id]="closeId()" class="modal-close" (click)="close()" [attr.aria-label]="closeLabel()">✕</button>
        <ng-content />
      </div>
    </div>`,
})
export class ModalComponent implements OnInit, OnDestroy {
  private readonly doc = inject(DOCUMENT);
  /** Id of the heading that names the dialog. */
  readonly labelledBy = input.required<string>();
  /** Stable id for the ✕, so story replays can click it. */
  readonly closeId = input.required<string>();
  readonly closeLabel = input('Close');
  readonly dismissed = output<void>();
  readonly leaving = signal(false);

  /** The screen underneath stays put while the modal scrolls. */
  ngOnInit(): void { this.doc.documentElement.classList.add('panel-open'); }
  ngOnDestroy(): void { this.doc.documentElement.classList.remove('panel-open'); }

  @HostListener('document:keydown.escape')
  close(): void {
    if (this.leaving()) return;
    this.leaving.set(true);
    setTimeout(() => this.dismissed.emit(), FADE_OUT_MS);
  }
}
