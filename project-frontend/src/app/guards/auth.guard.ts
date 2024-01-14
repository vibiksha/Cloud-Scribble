import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';
import { ROUTES } from '../constants/routes.constants';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate(): Promise<boolean> {
      const user = await this.authService.getUser().catch((err) => {
        console.log('error from auth guard');
        console.log('the error data is ', err.response);
      });
      if (!user) {
        this.router.navigate([ROUTES.LOGIN]);
        return false;
      }
      return true;

  }
}
