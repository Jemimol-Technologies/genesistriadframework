import { Routes } from '@angular/router';
import { LandingScreenComponent } from './screens/landing/landing.component';
import { VerifyScreenComponent } from './screens/verify/verify.component';
import { CollectScreenComponent } from './screens/collect/collect.component';
import { SnapshotScreenComponent } from './screens/snapshot/snapshot.component';
import { EvidenceScreenComponent } from './screens/evidence/evidence.component';
import { ReproducibleScreenComponent } from './screens/reproducible/reproducible.component';
import { UpgradeScreenComponent } from './screens/upgrade/upgrade.component';
import { ConnectScreenComponent } from './screens/connect/connect.component';
import { SubmittedScreenComponent } from './screens/submitted/submitted.component';
import { QueueScreenComponent } from './screens/queue/queue.component';
import { ReviewScreenComponent } from './screens/review/review.component';
import { ReportScreenComponent } from './screens/report/report.component';
import { MonitorScreenComponent } from './screens/monitor/monitor.component';
import { MonitoringOfferComponent } from './screens/monitoring-offer/monitoring-offer.component';

/** Brand-facing audit site and Felix's console, as one clickable wireframe. Paths mirror the real product's. */
export const routes: Routes = [
  { path: '', component: LandingScreenComponent, title: 'Genesis Triad · Free Triad Snapshot' },
  { path: 'start', component: VerifyScreenComponent, title: 'About this brand · Genesis Triad' },
  { path: 'collect', component: CollectScreenComponent, title: 'Collecting evidence · Genesis Triad' },
  {
    path: 'r/SNP-2611-0417', component: SnapshotScreenComponent, title: 'Triad Snapshot · Genesis Triad',
    // A finding's receipts open as a panel over the snapshot that summoned it.
    children: [
      // "Unlock the full audit": the subscribe nudge as a modal over the snapshot. Listed before :finding so it wins.
      { path: 'upgrade', component: UpgradeScreenComponent, title: 'Alignment Diagnostic · Genesis Triad' },
      { path: ':finding', component: EvidenceScreenComponent, title: 'Finding · Genesis Triad' },
      // "How sure can I be of this score?" from the receipts: a modal over the snapshot; closing it returns to the receipts.
      { path: ':finding/method', component: ReproducibleScreenComponent, title: 'Same evidence, same score · Genesis Triad' },
    ],
  },
  { path: 'method', redirectTo: 'r/SNP-2611-0417/f1/method' },
  { path: 'upgrade', redirectTo: 'r/SNP-2611-0417/upgrade' },
  { path: 'diagnostic/evidence', component: ConnectScreenComponent, title: 'Inside evidence · Genesis Triad' },
  { path: 'diagnostic/submitted', component: SubmittedScreenComponent, title: 'Submitted · Genesis Triad' },
  // Felix's console: his own app. No brand-side button leads here; the story reaches it by address.
  { path: 'console/queue', component: QueueScreenComponent, title: 'Review queue · Genesis Triad console' },
  { path: 'console/review/freshbox', component: ReviewScreenComponent, title: 'Signal review · Genesis Triad console' },
  {
    path: 'diagnostic/freshbox', component: ReportScreenComponent, title: 'Alignment report · Genesis Triad',
    // "Keep it aligned": the monitoring offer as a modal over the report.
    children: [{ path: 'monitoring', component: MonitoringOfferComponent, title: 'Monitoring · Genesis Triad' }],
  },
  { path: 'monitor/freshbox', component: MonitorScreenComponent, title: 'Monitoring · Genesis Triad' },
  { path: '**', redirectTo: '' },
];
