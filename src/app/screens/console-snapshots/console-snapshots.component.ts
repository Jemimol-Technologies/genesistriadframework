import { Component, computed, signal } from '@angular/core';
import { bucketOf } from '../../score.model';
import { ConsoleNavComponent } from '../../shared/console-nav.component';

/** Whose brand the requester said it was (store values, as asked on the free form). */
type Whose = 'own' | 'competitor' | 'agency';
/** Follow-up on the requester (store values). */
type FollowUp = 'new' | 'drafted' | 'contacted' | 'converted' | 'none';

interface SnapshotRow {
  date: string; brand: string; requester: string; whose: Whose; score: number;
  live: boolean; followUp: FollowUp; note?: string;
}

const ROWS: SnapshotRow[] = [
  { date: '3 Dec', brand: 'urbanthreads.demo', requester: 'Dev K. · founder', whose: 'own', score: 3, live: true, followUp: 'new' },
  { date: '2 Dec', brand: 'spiceroute.demo', requester: 'Mira L. · Bloom Agency', whose: 'agency', score: 5, live: true, followUp: 'new', note: 'Agency auditing a client' },
  { date: '1 Dec', brand: 'greenleafcafe.demo', requester: 'Sam P. · Leaf & Co.', whose: 'competitor', score: 9, live: true, followUp: 'none', note: 'Competitor snapshot: no follow-up to the audited brand' },
  { date: '28 Nov', brand: 'kilnandco.demo', requester: 'Asha V. · founder', whose: 'own', score: 8, live: true, followUp: 'contacted' },
  { date: '21 Nov', brand: 'freshboxkitchens.demo', requester: 'Priya R. · founder', whose: 'own', score: 6, live: true, followUp: 'converted', note: 'Alignment Diagnostic, signed 3 Dec' },
  { date: '18 Nov', brand: 'nimbuslearning.demo', requester: 'Tom H. · CMO', whose: 'own', score: 7, live: true, followUp: 'converted', note: 'Alignment Diagnostic, in your queue' },
  { date: '3 Nov', brand: 'quickbite.demo', requester: 'Priya R. · FreshBox', whose: 'competitor', score: 8, live: false, followUp: 'none', note: 'Run by FreshBox on a competitor' },
];

@Component({
  selector: 'gt-console-snapshots',
  standalone: true,
  imports: [ConsoleNavComponent],
  templateUrl: './console-snapshots.component.html',
})
export class ConsoleSnapshotsComponent {
  readonly bk = bucketOf;
  readonly filter = signal<'all' | Whose>('all');
  readonly rows = signal(ROWS);
  readonly shown = computed(() => this.rows().filter(r => this.filter() === 'all' || r.whose === this.filter()));
  readonly count = (w: Whose) => ROWS.filter(r => r.whose === w).length;
  readonly whoseLabel: Record<Whose, string> = { own: 'Their own brand', competitor: 'A competitor', agency: 'A client (agency)' };
  readonly followLabel: Record<FollowUp, string> = { new: 'New lead', drafted: 'Follow-up drafted', contacted: 'Contacted', converted: 'Became a client', none: 'No follow-up' };
  readonly followChip: Record<FollowUp, string> = { new: 'red', drafted: 'amber', contacted: '', converted: 'teal', none: '' };

  /** Draft a follow-up for Felix to read and send himself; nothing goes out automatically. */
  draft(brand: string): void {
    this.rows.update(list => list.map(r => r.brand === brand ? { ...r, followUp: 'drafted' as const } : r));
  }
}
