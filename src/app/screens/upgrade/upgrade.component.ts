import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ModalComponent } from '../../shared/modal.component';

/** The subscribe nudge: free snapshot vs Alignment Diagnostic, as a modal over the snapshot that summoned it. */
@Component({
  selector: 'gt-upgrade-screen',
  standalone: true,
  imports: [RouterLink, ModalComponent],
  templateUrl: './upgrade.component.html',
})
export class UpgradeScreenComponent {
  private readonly router = inject(Router);

  /** Closed: back to the snapshot underneath, same reading. */
  back(): void { this.router.navigate(['/r/SNP-2611-0417'], { queryParamsHandling: 'preserve' }); }
}
