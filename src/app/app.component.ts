import { Component, inject } from '@angular/core';
import { NavigationEnd, Route, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<main class="screen"><router-outlet /></main>',
})
export class AppComponent {
  private screen?: Route | null;

  constructor() {
    const router = inject(Router);
    // A new screen starts at the top; opening or closing a panel over the same screen keeps the scroll.
    router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      const screen = router.routerState.snapshot.root.firstChild?.routeConfig;
      if (screen !== this.screen) window.scrollTo(0, 0);
      this.screen = screen;
    });
  }
}
