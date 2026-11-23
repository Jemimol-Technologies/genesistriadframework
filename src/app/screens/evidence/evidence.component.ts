import { Component, HostListener, OnDestroy, OnInit, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { READINGS, Reading, pickState } from '../../audit.model';
import { FINDING_IDS, FINDING_KIND, FindingId, SCENARIOS } from '../snapshot/snapshot.data';

const SNAPSHOT = '/r/SNP-2611-0417';
/** Matches the .drawer.leaving animation. */
const SLIDE_OUT_MS = 220;

/** A finding's receipts: a full-height panel over the snapshot that opened it. */
@Component({
  selector: 'gt-evidence-screen',
  standalone: true,
  templateUrl: './evidence.component.html',
})
export class EvidenceScreenComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);
  readonly kinds = FINDING_KIND;
  readonly leaving = signal(false);

  /** From the address: `/r/SNP-2611-0417/<finding>?state=<reading>`. */
  readonly finding = input<string>('');
  readonly state = input<string | null>(null);
  private readonly reading = computed<Reading>(() => pickState(this.state() ?? null, READINGS, 'apart'));
  private readonly id = computed<FindingId | null>(() => (FINDING_IDS as readonly string[]).includes(this.finding()) ? this.finding() as FindingId : null);
  readonly f = computed(() => SCENARIOS[this.reading()].findings.find(x => x.id === this.id()) ?? null);

  constructor() {
    // An address naming no finding goes back to the snapshot.
    effect(() => { if (!this.f()) untracked(() => this.router.navigate([SNAPSHOT], { queryParamsHandling: 'preserve', replaceUrl: true })); }, { allowSignalWrites: true });
  }

  /** The report underneath stays put while the panel scrolls. */
  ngOnInit(): void { this.doc.documentElement.classList.add('panel-open'); }
  ngOnDestroy(): void { this.doc.documentElement.classList.remove('panel-open'); }

  pct(v: number): string { return `${Math.round(v * 100)}%`; }

  @HostListener('document:keydown.escape')
  close(): void { this.leave([SNAPSHOT]); }

  /** Collapse the panel, then open "How sure can I be of this score?" as a modal over the snapshot. */
  howSure(): void { this.leave([SNAPSHOT, this.finding(), 'method']); }

  private leave(commands: string[]): void {
    if (this.leaving()) return;
    this.leaving.set(true);
    setTimeout(() => this.router.navigate(commands, { queryParamsHandling: 'preserve' }), SLIDE_OUT_MS);
  }
}
