import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { Auth } from './auth/auth';
import { catchError, of, tap } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideAppInitializer(() => {
      const authService = inject(Auth);
      return authService.checkSession().pipe(
        tap((res: any) => {
          if (res.status === 'success') {
            authService.user.set(res.data.user)
          }
        }),
        catchError((err) => of(true))
      )
    })
  ]
};
