import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DemoSession } from '../services/demo-session';

export const phrasesGuard: CanActivateFn = (_route, state) => {
  const session = inject(DemoSession);
  const router = inject(Router);
  return session.signedIn()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
