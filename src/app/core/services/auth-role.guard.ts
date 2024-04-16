import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../core.index';

@Injectable({
  providedIn: 'root'
})
export class AuthRoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Get the current user's role from AuthService
    const currentUserRole =  localStorage.getItem('roleName') || '';
    ;
    // const currentUserRole = this.authService.roleName;
    // console.log('roleGuard', currentUserRole);

    // Check if the current user's role matches the expected role
    const expectedRoles = next.data['expectedRoles']; // Access 'expectedRoles' using bracket notation
    if (currentUserRole && expectedRoles && expectedRoles.includes(currentUserRole)) {
      return true;
    } else {
      // Redirect to unauthorized page or do something else based on your requirement
      this.router.navigate(['/auth/access']);
      return false;
    }
  }
}
