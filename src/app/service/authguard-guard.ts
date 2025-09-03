import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../service/auth';

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(Auth) as Auth;
  const router = inject(Router) as Router;

  if (authService.isAuthenticated()) {
    return true;
  } else {
    setTimeout(() => {
      router.navigate(['/login']);
    }, 0);
    return false;
  }
};
