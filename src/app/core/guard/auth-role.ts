import { CanActivateFn } from '@angular/router';
import { AuthService } from '../httpServices/auth-service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const authRole= (expectedRole: string): CanActivateFn => {
 return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.getRole() === expectedRole) {
      return true;
    }
    router.navigate(['/login']);
    return false;
  };
};
