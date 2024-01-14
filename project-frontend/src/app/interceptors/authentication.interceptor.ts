import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators'; // Import catchError from 'rxjs/operators'
import { AuthService } from '../services/auth/auth.service';
import { throwError } from 'rxjs'; // Import throwError from 'rxjs'
import { BASE_ROUTE } from '../constants/routes.constants';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  private readonly baseUrl = BASE_ROUTE; // Replace with your specified base URL

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith(this.baseUrl) && !req.url.includes('/signup') && !req.url.includes('/posts/all')) {
      return from(this.authService.getJwtToken()).pipe(
        mergeMap(token => {
          if (token) {
            const modifiedRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
            return next.handle(modifiedRequest).pipe(
              catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                   this.authService.signOut();
                }
                return throwError(error);
              })
            );
          } else {
            return next.handle(req);
          }
        })
      );
    } else if (req.url.includes('/signup')) {
      return next.handle(req);
    } else {
      return next.handle(req);
    }
  }
}
