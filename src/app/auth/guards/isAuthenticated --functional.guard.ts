import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';

export const isAuthenticatedFunctionalGuard: CanActivateFn = (route, state) => {

  const url = state.url;
  localStorage.setItem('url', url);

  const authService = inject(AuthService);
  const router = inject(Router);

  // console.log('isAuthenticatedGuard');
  // console.log({route, state});
  if( authService.authStatus() === AuthStatus.authenticated ) return true;
  if(authService.authStatus() === AuthStatus.cheking) return  false


  router.navigateByUrl('/auth/login');
  return false;
};
