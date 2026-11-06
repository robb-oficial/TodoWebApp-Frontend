import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { Auth } from './auth/auth';
import { inject } from '@angular/core';

export const isLoggedIn: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);
  const user = authService.user();
  if (user === undefined) {
    return new RedirectCommand(router.parseUrl('/login'));
  }
  return true;
};
