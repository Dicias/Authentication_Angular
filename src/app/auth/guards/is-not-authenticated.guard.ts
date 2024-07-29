import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {


  const authService = inject(AuthService);
  const router = inject(Router);

  if( authService.authStatus() === AuthStatus.notAuthenticated ) return true;
  if(authService.authStatus() === AuthStatus.cheking) return false
  router.navigateByUrl('/dashboard');
  return false;
};
