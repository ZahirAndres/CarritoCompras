import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (typeof window !== 'undefined' && sessionStorage.getItem('email')) {
    return true;
  } else {
    return router.navigate(['login']);
  }
};
