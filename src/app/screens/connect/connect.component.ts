import { Component, computed, effect, input, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EVIDENCE_STAGES, EvidenceStage, pickState } from '../../audit.model';

/** An inside-evidence source. Status is a store value; labels live in the template. */
interface Source { id: 'sc' | 'ga' | 'metrics' | 'support'; mark: string; name: string; detail: string; kind: 'connect' | 'upload' | 'add'; optional?: boolean; done: boolean; }
/** A leader asked for intent answers. */
interface Leader { name: string; role: string; email: string; status: 'invited' | 'done'; }

const SOURCES: Omit<Source, 'done'>[] = [
  { id: 'sc', mark: 'SC', name: 'Search Console', detail: 'What people search before they find you', kind: 'connect' },
  { id: 'ga', mark: 'GA', name: 'Website analytics', detail: 'Sign-up and checkout drop-off', kind: 'connect' },
  { id: 'metrics', mark: 'CSV', name: 'Business metrics', detail: 'Repeat orders, on-time %, NPS — template provided', kind: 'upload' },
  { id: 'support', mark: '☏', name: 'Support conversations', detail: 'Optional — tagged export from your helpdesk', kind: 'add', optional: true },
];

/** Example people the demo pre-fills, in order, so the story can add a leader in one click. */
const DEMO_LEADERS: Omit<Leader, 'status'>[] = [
  { name: 'Arjun M.', role: 'Sales lead', email: 'arjun@freshboxkitchens.demo' },
  { name: 'Meera S.', role: 'Operations', email: 'meera@freshboxkitchens.demo' },
  { name: 'Kabir D.', role: 'Marketing', email: 'kabir@freshboxkitchens.demo' },
];

@Component({
  selector: 'gt-connect-screen',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './connect.component.html',
})
export class ConnectScreenComponent {
  /** `?state=ready`: data added and leaders answering, ready to submit. Default: just paid, nothing added yet. */
  readonly state = input<string | null>(null);
  readonly stage = computed<EvidenceStage>(() => pickState(this.state() ?? null, EVIDENCE_STAGES, 'start'));
  /** Submitting is the ready state's move only. */
  readonly canSubmit = computed(() => this.stage() === 'ready');

  /** The buyer: known from the snapshot email and the payment, so never asked for. */
  readonly me = { name: 'Priya R.', email: 'priya@freshboxkitchens.demo' };
  readonly myAnswers = signal<'todo' | 'done'>('todo');
  readonly sources = signal<Source[]>([]);
  readonly leaders = signal<Leader[]>([]);

  readonly adding = signal(false);
  readonly draft = signal<Omit<Leader, 'status'>>({ name: '', role: '', email: '' });
  readonly canSend = computed(() => {
    const d = this.draft();
    return d.name.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim());
  });

  constructor() {
    // Each state starts from its own picture of the page.
    effect(() => {
      const ready = this.stage() === 'ready';
      untracked(() => {
        this.sources.set(SOURCES.map(s => ({ ...s, done: ready && !s.optional })));
        this.myAnswers.set(ready ? 'done' : 'todo');
        this.leaders.set(ready ? [
          { ...DEMO_LEADERS[0], status: 'done' },
          { ...DEMO_LEADERS[1], status: 'invited' },
        ] : []);
        this.adding.set(false);
      });
    }, { allowSignalWrites: true });
  }

  addSource(id: Source['id']): void {
    this.sources.update(list => list.map(s => s.id === id ? { ...s, done: true } : s));
  }

  startAdding(): void {
    this.draft.set({ ...(DEMO_LEADERS[this.leaders().length] ?? { name: '', role: '', email: '' }) });
    this.adding.set(true);
  }

  set(field: 'name' | 'role' | 'email', value: string): void {
    this.draft.update(d => ({ ...d, [field]: value }));
  }

  sendInvite(): void {
    if (!this.canSend()) return;
    const d = this.draft();
    this.leaders.update(list => [...list, { name: d.name.trim(), role: d.role.trim(), email: d.email.trim(), status: 'invited' }]);
    this.adding.set(false);
  }
}
