import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

/** Sign in, for Felix only in this wireframe (brands use the free snapshot without an account). Email, then a one-time code. */
@Component({
  selector: 'gt-sign-in-screen',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sign-in.component.html',
})
export class SignInScreenComponent {
  private readonly router = inject(Router);
  /** `?state=code`: the code has been sent. Default: enter your email. */
  readonly state = input<string | null>(null);
  readonly step = signal<'email' | 'code'>('email');
  readonly email = signal('felix@genesistriad.demo');
  readonly code = signal('482 913');
  readonly emailOk = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email().trim()));
  readonly codeOk = computed(() => this.code().replace(/\s/g, '').length === 6);

  constructor() {
    effect(() => { const s = this.state(); untracked(() => this.step.set(s === 'code' ? 'code' : 'email')); }, { allowSignalWrites: true });
  }

  sendCode(): void { if (this.emailOk()) this.step.set('code'); }
  signIn(): void { if (this.codeOk()) this.router.navigateByUrl('/console/queue'); }
}
