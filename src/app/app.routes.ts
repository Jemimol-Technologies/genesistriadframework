import { Routes } from '@angular/router';
import { LandingScreenComponent } from './screens/landing/landing.component';
import { VerifyScreenComponent } from './screens/verify/verify.component';
import { CollectScreenComponent } from './screens/collect/collect.component';
import { SnapshotScreenComponent } from './screens/snapshot/snapshot.component';
import { EvidenceScreenComponent } from './screens/evidence/evidence.component';
import { ReproducibleScreenComponent } from './screens/reproducible/reproducible.component';
import { UpgradeScreenComponent } from './screens/upgrade/upgrade.component';
import { ConnectScreenComponent } from './screens/connect/connect.component';
import { QueueScreenComponent } from './screens/queue/queue.component';
import { ReviewScreenComponent } from './screens/review/review.component';
import { ReportScreenComponent } from './screens/report/report.component';
import { MonitorScreenComponent } from './screens/monitor/monitor.component';

/** Brand-facing audit site and Felix's console, as one clickable wireframe. Paths mirror the real product's. */
export const routes: Routes = [
  { path: '', component: LandingScreenComponent, title: 'Genesis Triad · Free Triad Snapshot' },
  { path: 'start', component: VerifyScreenComponent, title: 'About this brand · Genesis Triad' },
  { path: 'collect', component: CollectScreenComponent, title: 'Collecting evidence · Genesis Triad' },
  { path: 'r/SNP-2611-0417', component: SnapshotScreenComponent, title: 'Triad Snapshot · Genesis Triad' },
  { path: 'r/SNP-2611-0417/f1', component: EvidenceScreenComponent, title: 'Finding · Genesis Triad' },
  { path: 'method', component: ReproducibleScreenComponent, title: 'Same evidence, same score · Genesis Triad' },
  { path: 'upgrade', component: UpgradeScreenComponent, title: 'Alignment Diagnostic · Genesis Triad' },
  { path: 'diagnostic/evidence', component: ConnectScreenComponent, title: 'Inside evidence · Genesis Triad' },
  { path: 'console/queue', component: QueueScreenComponent, title: 'Review queue · Genesis Triad console' },
  { path: 'console/review/freshbox', component: ReviewScreenComponent, title: 'Signal review · Genesis Triad console' },
  { path: 'diagnostic/freshbox', component: ReportScreenComponent, title: 'Alignment report · Genesis Triad' },
  { path: 'monitor/freshbox', component: MonitorScreenComponent, title: 'Monitoring · Genesis Triad' },
  { path: '**', redirectTo: '' },
];
