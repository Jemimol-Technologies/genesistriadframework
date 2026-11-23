import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Whose brand is being audited (store value). */
type Whose = 'mine' | 'competitor' | 'client';

@Component({
  selector: 'gt-verify-screen',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './verify.component.html',
})
export class VerifyScreenComponent {
  readonly options: { value: Whose; label: string }[] = [
    { value: 'mine', label: 'Mine' },
    { value: 'competitor', label: 'A competitor' },
    { value: 'client', label: "A client's (agency)" },
  ];
  readonly whose = signal<Whose>('mine');
  readonly promiseLabel = computed(() =>
    this.whose() === 'competitor'
      ? 'In one line, what do you think they promise customers? (optional)'
      : 'In one line, what does this brand promise customers?');
}
